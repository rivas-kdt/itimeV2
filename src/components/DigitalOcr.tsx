"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CameraCapture from "@/components/CameraCapture";
import { AlertTriangle, CheckCircle2, SquarePen } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import NextImage from "next/image";
import { Input } from "./ui/input";
import { CustomComboBox } from "./customComboBox";
import Link from "next/link";

type Sel = { x: number; y: number; w: number; h: number };

type Result = {
  mode?: "digital";
  value?: string;
  unit?: string;
  confidence?: number;
  method?: string;
  error?: string;
};

type DigitToken = { kind: "digit"; value: string; isDecimal?: boolean };

const BASE_API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_URL = `${BASE_API.replace(/\/$/, "")}/read/digital`;

const MAX_IMG_VH = 40; // fit image/canvas into 50vh WITHOUT CSS squish

const DIGIT_W = 54;
const DIGIT_H = 78;
const DIGIT_FONT = 42;
const DIGIT_RADIUS = 12;

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

// Parse OCR string into fixed 8 digits with fixed 2 decimals (truncate, no rounding).
function tokenizeFlexible(raw: string): DigitToken[] {
  const s = String(raw ?? "").trim();

  if (!s) return [];

  const cleaned = s.replace(/[^a-zA-Z0-9.]/g, "");
  const dot = cleaned.indexOf(".");
  let intPart = cleaned;
  let decPart = "";

  if (dot >= 0) {
    intPart = cleaned.slice(0, dot);
    decPart = cleaned.slice(dot + 1);
  }
  const full = intPart + (decPart ? "." + decPart : "");
  return Array.from(full).map((ch, i) => ({
    kind: "digit",
    value: ch,
    isDecimal: i >= intPart.length && ch === ".",
  }));
}

function bumpDigitToken(
  tokens: DigitToken[],
  tokenIndex: number,
  delta: number,
) {
  const t = tokens[tokenIndex];
  if (!t || t.kind !== "digit") return tokens;

  const cur = parseInt(t.value || "0", 10);
  let v = (cur + delta) % 10;
  if (v < 0) v += 10;

  const next = tokens.slice();
  next[tokenIndex] = { ...t, value: String(v) };
  return next;
}

function tokensToString(tokens: DigitToken[]) {
  return tokens.map((t) => t.value).join("");
}

export default function DigitalClient() {
  const router = useRouter();
  const params = useSearchParams();

  const CameraCaptureAny = CameraCapture as unknown as React.ComponentType<any>;

  const fileRef = useRef<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const [imgURL, setImgURL] = useState("");
  const [dispW, setDispW] = useState(0);
  const [dispH, setDispH] = useState(0);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);

  const [sel, setSel] = useState<Sel>({ x: 40, y: 40, w: 280, h: 120 });

  const [drag, setDrag] = useState(false);
  const [resize, setResize] = useState<null | "nw" | "ne" | "sw" | "se">(null);
  const startRef = useRef<{ x: number; y: number; s: Sel } | null>(null);

  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>({});
  const [uiErr, setUiErr] = useState<string>("");

  const [tokens, setTokens] = useState<DigitToken[]>([]);

  const digitDragRef = useRef<{
    tokenIndex: number | null;
    lastY: number | null;
  }>({ tokenIndex: null, lastY: null });

  const [toast, setToast] = useState<{
    msg: string;
    kind: "success" | "error";
  } | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const [text, setText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [newWorkCode, setNewWorkCode] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [consItemVal, setConsItemVal] = useState("");
  const [workCodeVal, setWorkCodeVal] = useState("");
  const [othersVal, setOthersVal] = useState("");

  const itemList = [
    "0A00",
    "0A01",
    "0A02",
    "0A03",
    "0A04",
    "0A05",
    "0100",
    "YC00",
    "0400",
    "0600",
    "PLNT",
    "2681",
  ] as const;

  const workCodeList = [
    "1",
    "10",
    "20",
    "30",
    "31",
    "41",
    "42",
    "50",
    "60",
    "61",
    "70",
    "97",
    "98",
  ] as const;

  const othersList = ["7", "7R", "8J", "9M", "1A", "2B", "3C", "4D"] as const;

  function showToast(msg: string, kind: "success" | "error" = "success") {
    if (!msg) return;
    setToast({ msg, kind });
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 1800);
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  // === Load capture from Home page (sessionStorage) ===
  useEffect(() => {
    const fromCapture = String(params?.get("from") || "").includes("capture");
    if (!fromCapture) return;

    const dataUrl = sessionStorage.getItem("kiman:lastCapture") || "";
    if (!dataUrl) return;

    (async () => {
      try {
        const file = await dataURLToFile(dataUrl, `capture_${Date.now()}.jpg`);
        fileRef.current = file;
        setUiErr("");
        setResult({});
        setTokens([]);
        setImgURL(URL.createObjectURL(file));
      } catch {
        setImgURL(dataUrl);
        showToast(
          "Capture loaded, but conversion failed. Please upload again to OCR.",
          "error",
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showBanner = !!imgURL && !result?.value;

  useEffect(() => {
    if (!imgURL) return;

    const img = new Image();
    img.onload = () => {
      const natW = img.naturalWidth || 1;
      const natH = img.naturalHeight || 1;

      setOrigW(natW);
      setOrigH(natH);

      // const maxW = 980;
      const maxW = window.innerWidth;
      // const maxH = Math.floor((window.innerHeight * MAX_IMG_VH) / 100);
      const maxH = window.innerHeight * 0.75;

      // const scale = Math.min(1, maxW / natW, maxH / natH);

      // const w = Math.max(1, Math.round(natW * scale));
      // const h = Math.max(1, Math.round(natH * scale));

      const scale = Math.min(maxW / natW, maxH / natH);

      const w = Math.round(natW * scale);
      const h = Math.round(natH * scale);

      setDispW(w);
      setDispH(h);

      const canvas = canvasRef.current!;
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      setSel((s) => ({
        x: Math.min(s.x, w - 10),
        y: Math.min(s.y, h - 10),
        w: Math.min(s.w, w),
        h: Math.min(s.h, h),
      }));
    };

    img.src = imgURL;
  }, [imgURL]);

  function onFileSelected(f: File) {
    fileRef.current = f;
    setUiErr("");
    setResult({});
    setTokens([]);

    setImgURL(URL.createObjectURL(f));
  }

  function getLocalXY(e: React.PointerEvent) {
    const el = overlayRef.current!;
    const r = el.getBoundingClientRect();
    const x = Math.round(e.clientX - r.left);
    const y = Math.round(e.clientY - r.top);
    return { x, y };
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!overlayRef.current) return;
    if (!imgURL) return;

    e.preventDefault();
    overlayRef.current.setPointerCapture(e.pointerId);

    const { x, y } = getLocalXY(e);
    const hs = 12;

    const { x: sx, y: sy, w: sw, h: sh } = sel;

    const onNW = Math.abs(x - sx) <= hs && Math.abs(y - sy) <= hs;
    const onNE = Math.abs(x - (sx + sw)) <= hs && Math.abs(y - sy) <= hs;
    const onSW = Math.abs(x - sx) <= hs && Math.abs(y - (sy + sh)) <= hs;
    const onSE = Math.abs(x - (sx + sw)) <= hs && Math.abs(y - (sy + sh)) <= hs;

    if (onNW || onNE || onSW || onSE) {
      setResize(onNW ? "nw" : onNE ? "ne" : onSW ? "sw" : "se");
      startRef.current = { x, y, s: { ...sel } };
      return;
    }

    if (x >= sx && x <= sx + sw && y >= sy && y <= sy + sh) {
      setDrag(true);
      startRef.current = { x, y, s: { ...sel } };
      return;
    }
    const s: Sel = { x, y, w: 180, h: 90 };
    setSel(s);
    setDrag(true);
    startRef.current = { x, y, s };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!startRef.current || (!drag && !resize)) return;
    if (!overlayRef.current) return;

    e.preventDefault();

    const { x, y } = getLocalXY(e);
    const st = startRef.current;

    if (resize) {
      const s = st.s;
      let nx = s.x,
        ny = s.y,
        nw = s.w,
        nh = s.h;

      if (resize === "nw") {
        nx = clamp(x, 0, s.x + s.w - 10);
        ny = clamp(y, 0, s.y + s.h - 10);
        nw = s.w + (s.x - nx);
        nh = s.h + (s.y - ny);
      }
      if (resize === "ne") {
        ny = clamp(y, 0, s.y + s.h - 10);
        nw = clamp(x - s.x, 10, dispW - s.x);
        nh = s.h + (s.y - ny);
      }
      if (resize === "sw") {
        nx = clamp(x, 0, s.x + s.w - 10);
        nw = s.w + (s.x - nx);
        nh = clamp(y - s.y, 10, dispH - s.y);
      }
      if (resize === "se") {
        nw = clamp(x - s.x, 10, dispW - s.x);
        nh = clamp(y - s.y, 10, dispH - s.y);
      }

      setSel({ x: nx, y: ny, w: nw, h: nh });
      return;
    }

    if (drag) {
      const s = st.s;
      const dx = x - st.x;
      const dy = y - st.y;
      const nx = clamp(s.x + dx, 0, dispW - s.w);
      const ny = clamp(s.y + dy, 0, dispH - s.h);
      setSel({ ...s, x: nx, y: ny });
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!overlayRef.current) return;
    e.preventDefault();
    try {
      overlayRef.current.releasePointerCapture(e.pointerId);
    } catch {}
    setDrag(false);
    setResize(null);
    startRef.current = null;
  }

  // function onDigitWheel(tokenIndex: number, deltaY: number) {
  //   setTokens((prev) => bumpDigitToken(prev, tokenIndex, deltaY < 0 ? +1 : -1));
  // }

  // function startDigitDrag(tokenIndex: number, clientY: number) {
  //   digitDragRef.current = { tokenIndex, lastY: clientY };
  // }

  // function moveDigitDrag(clientY: number) {
  //   const st = digitDragRef.current;
  //   if (st.tokenIndex == null || st.lastY == null) return;

  //   const dy = clientY - st.lastY;
  //   const threshold = 14;

  //   if (Math.abs(dy) >= threshold) {
  //     const steps = Math.trunc(dy / threshold);
  //     if (steps !== 0) {
  //       setTokens((prev) => bumpDigitToken(prev, st.tokenIndex!, -steps));
  //       st.lastY = clientY;
  //     }
  //   }
  // }

  // function endDigitDrag() {
  //   digitDragRef.current = { tokenIndex: null, lastY: null };
  // }

  async function read() {
    if (!fileRef.current || !origW || !origH || !dispW || !dispH) {
      const msg =
        "No image file is available for OCR. Please capture/upload again.";
      setUiErr(msg);
      showToast(msg, "error");
      return;
    }

    setBusy(true);
    setUiErr("");
    setResult({});

    try {
      const scaleX = origW / dispW;
      const scaleY = origH / dispH;

      const sent = {
        x: Math.round(sel.x * scaleX),
        y: Math.round(sel.y * scaleY),
        w: Math.round(sel.w * scaleX),
        h: Math.round(sel.h * scaleY),
      };

      const form = new FormData();
      form.append("image", fileRef.current);
      form.append("x", String(sent.x));
      form.append("y", String(sent.y));
      form.append("w", String(sent.w));
      form.append("h", String(sent.h));
      form.append("debug_images", "0");
      // form.append("debug_images", "1");

      const res = await fetch(API_URL, { method: "POST", body: form });
      const data: Result = await res.json();
      console.log("OCR response:", data);
      setResult(data);

      if (data?.error) {
        setUiErr(data.error);
        showToast(data.error, "error");
        return;
      }

      const raw = data.value ?? "";
      if (!String(raw).trim()) {
        const msg = "No reading returned. Tighten the crop around the digits.";
        setUiErr(msg);
        showToast(msg, "error");
        return;
      }

      setTokens(tokenizeFlexible(raw));
      setText(data.value ?? "");
      setNewWorkCode(data.value ?? "");
      // setLoading(false);
      // setProgress(0);
      handleScanResults();
    } catch (e: any) {
      const msg = e?.message || "Request failed";
      setUiErr(msg);
      setResult({ error: msg });
      showToast(msg, "error");
    } finally {
      setBusy(false);
    }
  }

  const handleScanResults = () => {
    setOpenModal(true);
    console.log("text: ", text);
  };

  const handleCancel = () => {
    setConsItemVal("");
    setWorkCodeVal("");
    setOthersVal("");
    setOpenModal(false);
    // setManualWorkOrder("");
  };

  const displayValue = useMemo(() => tokensToString(tokens), [tokens]);

  function onSave() {
    showToast("Reading is saved to database (prototype).", "success");
  }

  function onReplaceImage() {
    try {
      localStorage.setItem("kiman:lastMode", "digital");
    } catch {}
    router.push("/scan-barcode");
  }

  return (
    <main className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      {toast && (
        <div className="fixed p-6 z-50">
          <div
            className="rounded-md w-full bg-black/85 text-white text-sm px-4 py-2 shadow flex items-center gap-2"
            style={{
              border:
                toast.kind === "error"
                  ? "1px solid rgba(239,68,68,0.55)"
                  : "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {toast.kind === "error" ? (
              <AlertTriangle className="w-4 h-4 text-red-300" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-green-300" />
            )}
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* <div className="flex-1 overflow-y-auto"> */}
      <div className="flex-1 overflow-hidden flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
          {!imgURL && (
            <div className="pt-2">
              <CameraCaptureAny
                label="Upload Photo"
                onFileSelected={onFileSelected}
              />
            </div>
          )}

          {imgURL && (
            <div className="rounded-2xl overflow-hidden">
              <div className="relative flex justify-center">
                <div className="relative" style={{ width: dispW || "auto" }}>
                  <canvas
                    ref={canvasRef}
                    style={{
                      display: "block",
                      width: dispW ? `${dispW}px` : "auto",
                      height: dispH ? `${dispH}px` : "auto",
                    }}
                  />
                  <div
                    ref={overlayRef}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: dispW,
                      height: dispH,
                      pointerEvents: "auto",
                      touchAction: "none",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: dispW,
                        height: dispH,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: sel.x,
                          height: "100%",
                          background: "rgba(0,0,0,0.45)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: sel.x + sel.w,
                          top: 0,
                          width: dispW - sel.x - sel.w,
                          height: "100%",
                          background: "rgba(0,0,0,0.45)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: sel.x,
                          top: 0,
                          width: sel.w,
                          height: sel.y,
                          background: "rgba(0,0,0,0.45)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: sel.x,
                          top: sel.y + sel.h,
                          width: sel.w,
                          height: dispH - sel.y - sel.h,
                          background: "rgba(0,0,0,0.45)",
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          left: sel.x,
                          top: sel.y,
                          width: sel.w,
                          height: sel.h,
                          border: "2px solid #ff6801",
                          boxSizing: "border-box",
                          borderRadius: 12,
                        }}
                      >
                        {(["nw", "ne", "sw", "se"] as const).map((h) => {
                          const base = {
                            position: "absolute" as const,
                            width: 14,
                            height: 14,
                            background: "#ff6801",
                            borderRadius: 5,
                            border: "2px solid rgba(0,0,0,0.35)",
                          };
                          if (h === "nw")
                            return (
                              <div
                                key={h}
                                style={{ ...base, left: -7, top: -7 }}
                              />
                            );
                          if (h === "ne")
                            return (
                              <div
                                key={h}
                                style={{ ...base, right: -7, top: -7 }}
                              />
                            );
                          if (h === "sw")
                            return (
                              <div
                                key={h}
                                style={{ ...base, left: -7, bottom: -7 }}
                              />
                            );
                          return (
                            <div
                              key={h}
                              style={{ ...base, right: -7, bottom: -7 }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {imgURL && (
        <div className="shrink-0 border-t border-white/10 p-4 mb-30">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={onReplaceImage}
                // className="rounded-2xl border border-white/20 bg-white/10 text-white px-3 py-4 text-sm font-extrabold"
                className="bg-gray-300 text-white text-lg py-6"
              >
                Change Image
              </Button>

              <Button
                type="button"
                onClick={read}
                disabled={busy}
                // className="rounded-2xl bg-blue-600 text-white px-3 py-4 text-sm font-extrabold disabled:opacity-40"
                className="gradient-bg text-white text-lg py-6"
              >
                {busy ? "Scanning..." : "Scan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Scanning Dialog */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="box-design text-black-text">
          <DialogHeader className="border-b-1 border-gray-300 pb-2">
            <DialogTitle className="flex flex-row items-center gap-3 font-semibold">
              <NextImage
                src="/scan_result.png"
                width={35}
                height={35}
                alt="icon"
              />
              Scanning Results
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col w-full gap-1">
            <label className="font-bold">Work Order</label>
            <div className="flex items-center m-0 p-0">
              <Input
                disabled={!isEditing}
                className="border-gray-500 text-sm"
                placeholder="Work Order"
                value={newWorkCode}
                onChange={(e) => setNewWorkCode(e.target.value)}
              />
              <SquarePen
                className={`p-1 rounded-lg transition ${isEditing ? "text-primary" : "text-black-text"}`}
                size={40}
                onClick={() => setIsEditing((prev) => !prev)}
              />
            </div>
          </div>

          <div className="flex flex-col w-full gap-1">
            {/* <label className="font-bold">Construction Item</label> */}
            <CustomComboBox
              label="Construction Item"
              value={consItemVal}
              setValue={setConsItemVal}
              items={itemList}
              placeholder="Select Construction Item"
            />
          </div>

          <div className="flex flex-col w-full gap-1">
            {/* <label className="font-bold">Work Code</label> */}
            <CustomComboBox
              label="Work Code"
              value={workCodeVal}
              setValue={setWorkCodeVal}
              items={workCodeList}
              placeholder="Select Work Code"
            />
          </div>

          <div className="flex flex-col w-full gap-1">
            {/* <label className="font-bold">Others</label> */}
            <CustomComboBox
              label="Others"
              value={othersVal}
              setValue={setOthersVal}
              items={othersList}
              placeholder="Select Others"
            />
          </div>

          <DialogFooter className="mt-3">
            <Button
              variant="outline"
              className="cancel-btn text-lg"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            {/* TODO link work order id on timer here */}
            <Button className="gradient-bg text-lg py-5">
              <Link href={`/timer/`}>Start Inspection</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

async function dataURLToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const type = blob.type || "image/jpeg";
  return new File([blob], filename, { type });
}
