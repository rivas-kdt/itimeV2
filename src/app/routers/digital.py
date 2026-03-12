from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from fastapi.responses import JSONResponse

from src.app.service.ocr import read_digital_meter

router = APIRouter()


@router.post("/digital")
async def digital_read(
    image: UploadFile = File(...),
    x: int = Form(0),
    y: int = Form(0),
    w: int = Form(0),
    h: int = Form(0),
    unit_hint: str = Form(""),
    debug_images: int = Form(0),
):
    try:
        raw = await image.read()
        # return {"value": "12345.67", "confidence": 0.99, "mode": "digital"}
        payload = read_digital_meter(
            image_bytes=raw,
            x=int(x),
            y=int(y),
            w=int(w),
            h=int(h),
            debug_images=bool(int(debug_images)),
            unit_hint=unit_hint,
        )
        return JSONResponse(payload)
    except Exception as e:
        # keep prototype friendly but not a full traceback
        raise HTTPException(status_code=500, detail=str(e))
