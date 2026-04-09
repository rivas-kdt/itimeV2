import io
import re
import base64
from typing import Tuple, Dict, Any

import cv2
import numpy as np
from PIL import Image, ImageOps

import pytesseract
import easyocr

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
# NUM_RE = re.compile(r"-?\d+(?:\.\d+)?")


# init once
_EASY = easyocr.Reader(["en"], gpu=False)


def _to_cv(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes))
    img = ImageOps.exif_transpose(img)
    img = img.convert("RGB")
    return cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)


def _safe_crop(img: np.ndarray, x: int, y: int, w: int, h: int) -> np.ndarray:
    H, W = img.shape[:2]
    if w <= 0 or h <= 0:
        return img
    x0 = max(0, min(W - 1, x))
    y0 = max(0, min(H - 1, y))
    x1 = max(x0 + 1, min(W, x + w))
    y1 = max(y0 + 1, min(H, y + h))
    if (x1 - x0) < 2 or (y1 - y0) < 2:
        return img
    return img[y0:y1, x0:x1]


def _resize_if_small(img: np.ndarray) -> np.ndarray:
    H, W = img.shape[:2]
    if max(H, W) < 600:
        return cv2.resize(img, None, fx=3.0, fy=3.0, interpolation=cv2.INTER_CUBIC)
    target = 900
    scale = max(target / max(W, H), 1.0)

    if scale > 1:
        img = cv2.resize(
            img,
            None,
            fx=scale,
            fy=scale,
            interpolation=cv2.INTER_CUBIC
        )
    return img


def _b64_png(img_bgr: np.ndarray) -> str:
    ok, buf = cv2.imencode(".png", img_bgr)
    return base64.b64encode(buf.tobytes()).decode("ascii") if ok else ""


def _enhance(img: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.convertScaleAbs(gray, alpha=1.8, beta=5)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray = clahe.apply(gray)
    blur = cv2.GaussianBlur(gray, (3, 3), 0)
    thr = cv2.adaptiveThreshold(
        blur, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 11, 4
        # blur, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 4
    )
    return cv2.cvtColor(thr, cv2.COLOR_GRAY2BGR)


def _lcd_preprocess(img: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    g = img[:, :, 1].astype(np.float32)
    mean = max(1.0, float(g.mean()))
    g = g * (128.0 / mean)
    g = np.clip(g, 0, 255)
    g = (g / 255.0) ** 0.8
    g = (g * 255).astype(np.uint8)
    g = cv2.bilateralFilter(g, d=7, sigmaColor=35, sigmaSpace=7)
    se = cv2.getStructuringElement(cv2.MORPH_RECT, (9, 9))
    top = cv2.morphologyEx(g, cv2.MORPH_TOPHAT, se)
    ga = cv2.GaussianBlur(top, (5, 5), 0)
    ad = cv2.adaptiveThreshold(
        ga, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 23, -6
    )
    _, ot = cv2.threshold(ga, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    strong = cv2.bitwise_or(ad, ot)
    strong = cv2.morphologyEx(
        strong, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)), iterations=1
    )
    inv = cv2.bitwise_not(strong)
    return cv2.cvtColor(strong, cv2.COLOR_GRAY2BGR), cv2.cvtColor(inv, cv2.COLOR_GRAY2BGR)


def ocr_tesseract(img_bgr: np.ndarray, psm: int) -> Tuple[str, float]:
    # cfg = f"-l eng --oem 1 --psm {psm} -c tessedit_char_whitelist=0123456789.-"
    # cfg = f"-l eng --oem 1 --psm {psm}"
    cfg = "-l eng --oem 1 --psm 7 -c tessedit_char_whitelist=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    data = pytesseract.image_to_data(img_bgr, config=cfg, output_type=pytesseract.Output.DICT)
    text = " ".join([t for t in data.get("text", []) if t]).strip()
    # m = NUM_RE.search(text)
    # val = m.group(0) if m else ""
    confs = [float(c) for c in data.get("conf", []) if c not in ("-1", -1, None)]
    conf = sum(confs) / len(confs) if confs else 0.0
    # return val, round(conf, 1)
    return text, round(conf, 1)


def ocr_easyocr(img_bgr: np.ndarray) -> Tuple[str, float]:
    rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    results = _EASY.readtext(rgb, detail=1, paragraph=False)
    # results = _EASY.readtext(
    #     rgb,
    #     detail=1,
    #     paragraph=False,
    #     allowlist="0123456789."
    # )
    best_val, best_conf = "", 0.0
    for _, text, conf in results:
        # t = "".join(ch for ch in text if ch.isdigit() or ch == ".")
        # t = "".join(ch for ch in text if ch.isprintable()).strip()
        t = "".join(ch for ch in text if ch.isalnum())
        # t = text.strip()
        if t and conf * 100 > best_conf:
            best_val, best_conf = t, conf * 100
    return best_val, round(best_conf, 1)


def read_digital_meter(
    image_bytes: bytes,
    x: int,
    y: int,
    w: int,
    h: int,
    debug_images: bool,
    unit_hint: str = "",
) -> Dict[str, Any]:
    bgr = _to_cv(image_bytes)
    H0, W0 = bgr.shape[:2]

    cropped = _safe_crop(bgr, x, y, w, h)
    # cropped = bgr
    cropped = _resize_if_small(cropped)

    enhanced = _enhance(cropped)
    lcd_norm, lcd_inv = _lcd_preprocess(cropped)

    candidates: list[tuple[str, str, float]] = []

    for tag, im in (("easyocr", cropped), ("easyocr-lcd", lcd_norm)):
    # for tag, im in (
    #     ("easyocr", cropped),
    #     ("easyocr-enhanced", enhanced),
    #     ("easyocr-lcd", lcd_norm),
    # ):
        v, c = ocr_easyocr(im)
        if v:
            candidates.append((tag, v, c))

    for tag, im in (
        ("tesseract-color", cropped),
        ("tesseract-enhanced", enhanced),
        ("tesseract-lcd", lcd_norm),
        ("tesseract-lcd-inv", lcd_inv),
    ):
        for psm in (7, 8, 6, 13):
            v, c = ocr_tesseract(im, psm)
            if v:
                candidates.append((f"{tag}-psm{psm}", v, c))

    payload: Dict[str, Any] = {
        "mode": "digital",
        "value": "",
        "unit": unit_hint,
        "confidence": 0.0,
        "method": "none",
        "debug": {
            "received_crop": {"x": x, "y": y, "w": w, "h": h},
            "original_size": {"w": W0, "h": H0},
            "used_crop_size": {"w": int(cropped.shape[1]), "h": int(cropped.shape[0])},
        },
    }

    if candidates:
        best_method, best_val, best_conf = max(candidates, key=lambda t: t[2])
        payload.update({"value": best_val, "confidence": float(best_conf), "method": best_method})

    if debug_images:
        payload["debug"]["images"] = {
            "cropped": _b64_png(cropped),
            "enhanced": _b64_png(enhanced),
            "lcd_norm": _b64_png(lcd_norm),
            "lcd_inv": _b64_png(lcd_inv),
        }

    return payload
