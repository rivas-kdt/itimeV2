"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import Image from "next/image";
import { Input } from "./ui/input";
import { CustomComboBox } from "./customComboBox";

export default function HomeClient() {
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraBoxRef = useRef<HTMLDivElement | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  const startingRef = useRef(false);
  const didInitRef = useRef(false);

  //   const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [ready, setReady] = useState(false);
  const [err, setErr] = useState("");

  const [zoomMode, setZoomMode] = useState<"native" | "css">("native");
  const [zoom, setZoom] = useState(1);

  const [capturing, setCapturing] = useState(false);

  // UI effects
  const [flashGreen, setFlashGreen] = useState(false);
  const flashTimerRef = useRef<number | null>(null);

  // Manual Input States
  const [openModal, setOpenModal] = useState(false);
  const [manualWorkOrder, setManualWorkOrder] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const stopCamera = useCallback(() => {
    setReady(false);

    const v = videoRef.current;
    if (v) {
      try {
        v.pause();
      } catch {}
      try {
        (v as any).srcObject = null;
      } catch {}
    }

    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {}
      });
    }

    streamRef.current = null;
    trackRef.current = null;

    setZoomMode("native");
    setZoom(1);
  }, []);

  const applyZoom = useCallback(async (z: number) => {
    const track = trackRef.current;
    if (!track) {
      setZoom(z);
      return;
    }

    const caps: any = track.getCapabilities?.() ?? {};
    const hasNativeZoom =
      typeof caps?.zoom === "object" || typeof caps?.zoom === "number";

    if (hasNativeZoom) {
      try {
        await track.applyConstraints({ advanced: [{ zoom: z }] } as any);
        setZoomMode("native");
        setZoom(z);
        return;
      } catch {
        // fall through to CSS
      }
    }

    setZoomMode("css");
    setZoom(z);
  }, []);

  const startCamera = useCallback(async () => {
    if (startingRef.current) return;
    startingRef.current = true;

    setErr("");
    setReady(false);

    try {
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;
      const track = stream.getVideoTracks()[0] ?? null;
      trackRef.current = track;

      const video = videoRef.current;
      if (!video) return;

      try {
        (video as any).srcObject = stream;
      } catch {}

      await new Promise<void>((resolve) => {
        const onMeta = () => resolve();
        video.addEventListener("loadedmetadata", onMeta, { once: true });
      });

      try {
        await video.play();
      } catch (e: any) {
        // iOS can throw AbortError when play() races with reloads
        if (
          String(e?.name || "")
            .toLowerCase()
            .includes("abort")
        ) {
          try {
            await new Promise((r) => setTimeout(r, 80));
            await video.play();
          } catch {}
        } else {
          throw e;
        }
      }

      await applyZoom(1);
      setReady(true);
    } catch (e: any) {
      setErr(
        e?.message ||
          "Camera failed to start. Make sure you are on HTTPS (or localhost) and allowed camera permission.",
      );
      stopCamera();
    } finally {
      startingRef.current = false;
    }
  }, [applyZoom, stopCamera]);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    };
  }, []);

  const videoStyle = useMemo(() => {
    // Match your Figma: fill camera window, crop edges
    const base: React.CSSProperties = {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    };
    if (zoomMode !== "css") return base;
    return {
      ...base,
      transform: `scale(${zoom})`,
      transformOrigin: "center center",
    };
  }, [zoom, zoomMode]);

  function goToModePage(from: "capture" | "upload") {
    const fromValue = from === "upload" ? "capture_upload" : "capture";
    router.push(`/scan-barcode/ocr-selector?from=${fromValue}`);
  }

  async function storeBlobAndGo(blob: Blob, from: "capture" | "upload") {
    const dataUrl = await blobToDataURL(blob);
    sessionStorage.setItem("itime:lastCapture", dataUrl);
    goToModePage(from);
  }

  function triggerGreenFlash() {
    setFlashGreen(true);
    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(() => setFlashGreen(false), 160);
  }

  async function captureAndGo() {
    if (!videoRef.current || !cameraBoxRef.current || !ready || capturing)
      return;

    setCapturing(true);
    setErr("");

    try {
      const video = videoRef.current;
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) throw new Error("Video not ready yet.");

      const box = cameraBoxRef.current;
      const boxW = Math.max(1, box.clientWidth);
      const boxH = Math.max(1, box.clientHeight);

      const targetAspect = boxW / boxH;
      const srcAspect = vw / vh;

      // object-fit: cover crop in SOURCE coords
      let sx = 0,
        sy = 0,
        sWidth = vw,
        sHeight = vh;

      if (srcAspect > targetAspect) {
        // source wider => crop left/right
        sHeight = vh;
        sWidth = Math.round(vh * targetAspect);
        sx = Math.round((vw - sWidth) / 2);
        sy = 0;
      } else {
        // source taller => crop top/bottom
        sWidth = vw;
        sHeight = Math.round(vw / targetAspect);
        sx = 0;
        sy = Math.round((vh - sHeight) / 2);
      }

      // If CSS zoom is used, visually we "zoom in" => additional crop
      if (zoomMode === "css" && zoom > 1) {
        const zw = Math.round(sWidth / zoom);
        const zh = Math.round(sHeight / zoom);
        sx = sx + Math.round((sWidth - zw) / 2);
        sy = sy + Math.round((sHeight - zh) / 2);
        sWidth = zw;
        sHeight = zh;
      }

      // Output size: keep source crop resolution (best for OCR)
      const canvas = document.createElement("canvas");
      canvas.width = sWidth;
      canvas.height = sHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not available.");

      ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);

      triggerGreenFlash();

      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) =>
            b ? resolve(b) : reject(new Error("Failed to create image blob.")),
          "image/jpeg",
          0.92,
        );
      });

      await storeBlobAndGo(blob, "capture");
    } catch (e: any) {
      setErr(e?.message || "Failed to capture.");
    } finally {
      setCapturing(false);
    }
  }

  const handleCancel = () => {
    setConsItemVal("");
    setWorkCodeVal("");
    setOthersVal("");
    setOpenModal(false);
  };

  const handleSubmitManualInput = async () => {
    if (!manualWorkOrder.trim()) {
      alert("Work Order is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/work-orders", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workOrder: manualWorkOrder,
          constructionItem: consItemVal,
          workCode: workCodeVal,
          others: othersVal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to save work order");
      }

      // Navigate to timer with the work_id
      window.location.href = `/timer/${data.workId}`;
    } catch (error: any) {
      console.error("Error:", error);
      alert("Error: " + (error?.message || "Failed to save work order"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="h-full flex flex-col overflow-hidden">
      {/* CAMERA AREA */}
      <div className="relative flex-1">
        <div ref={cameraBoxRef} className="w-full h-full">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full"
            style={videoStyle}
          />
        </div>

        {flashGreen && (
          <div className="absolute inset-0 bg-white/25 pointer-events-none" />
        )}

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-white/80 text-sm">
            Starting camera…
          </div>
        )}

        {err && (
          <div className="absolute top-16 left-3 right-3 rounded-xl bg-red-600/90 text-white text-sm px-3 py-2">
            {err}
          </div>
        )}

        <div className="absolute bottom-25 w-full flex flex-col gap-2 px-6">
          <Button
            onClick={captureAndGo}
            disabled={!ready || capturing}
            aria-label="Shutter"
            className="flex-1 gradient-bg text-xl"
          >
            Scan
          </Button>
          <Button
            className="flex-1 text-xl gradient-bg disabled:bg-transparent disabled:text-gray-100"
            onClick={() => setOpenModal(true)}
          >
            Manual Input
          </Button>
          <p className="text-center text-sm text-white ">
            Cannot scan the Work Order? Add it here manually.{" "}
            <span>
              <Link href={"/scan-barcode/ocr"}>Go to EasyOCR</Link>
            </span>
          </p>
        </div>
      </div>

      {/* Manual Input Dialog */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="box-design text-black-text">
          <DialogHeader className="border-b border-gray-300 pb-2">
            <DialogTitle className="flex flex-row items-center gap-3 font-semibold">
              <Image src="/manual_edit.png" width={35} height={35} alt="icon" />
              Manual Input
            </DialogTitle>
          </DialogHeader>

          {/* TODO save the information to db */}
          <div className="flex flex-col w-full gap-1">
            <label className="font-bold">Work Order</label>
            <Input
              className="border-gray-500 text-sm"
              placeholder="Enter Work Order"
              value={manualWorkOrder}
              onChange={(e) => setManualWorkOrder(e.target.value)}
            />
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
              onClick={() => {
                setOpenModal(false);
                handleCancel();
              }}
            >
              Cancel
            </Button>
            {/* TODO link work order id on timer here */}
            <Button
              className="gradient-bg text-lg py-5"
              onClick={handleSubmitManualInput}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Start Inspection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = () => reject(new Error("Failed to read captured image."));
    r.readAsDataURL(blob);
  });
}

// function fileToDataURL(file: File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const r = new FileReader();
//     r.onload = () => resolve(String(r.result || ""));
//     r.onerror = () => reject(new Error("Failed to read uploaded image."));
//     r.readAsDataURL(file);
//   });
// }
