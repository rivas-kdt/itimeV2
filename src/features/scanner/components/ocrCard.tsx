"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createWorker, Worker } from "tesseract.js";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import Image from "next/image";
import Link from "next/link";
import { SquarePen } from "lucide-react";
import { CustomComboBox } from "@/components/customComboBox";
// import { useResponsiveScanBox } from "@/hooks/responsiveScanBox";

const SCAN_BOX_SIZES = {
  sm: { width: 0.9, height: 0.5, x: 0.05, y: 0.1 },
  md: { width: 0.8, height: 0.6, x: 0.1, y: 0.08 },
  lg: { width: 0.8, height: 0.8, x: 0.1, y: 0.08 },
};

function useResponsiveScanBox() {
  const [scanBox, setScanBox] = useState(SCAN_BOX_SIZES.sm);

  useEffect(() => {
    const updateBox = () => {
      const height = window.innerHeight;
      console.log("innerwidth: ", height);
      if (height < 750)
        setScanBox(SCAN_BOX_SIZES.sm); // Tailwind 'sm'
      else if (height < 1024)
        setScanBox(SCAN_BOX_SIZES.md); // Tailwind 'md'
      else setScanBox(SCAN_BOX_SIZES.lg); // Tailwind 'lg'
    };

    updateBox();
    window.addEventListener("resize", updateBox);
    return () => window.removeEventListener("resize", updateBox);
  }, []);

  return scanBox;
}

export default function CameraOcr() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openManualModal, setOpenManualModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newWorkCode, setNewWorkCode] = useState("");

  // Manual Input States
  const [manualWorkOrder, setManualWorkOrder] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scanBox = useResponsiveScanBox();

  // Start camera
  useEffect(() => {
    const videoElement = videoRef.current;

    const startCamera = async () => {
      if (!videoElement) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      videoElement.srcObject = stream;
      // if (videoRef.current) {
      //   videoRef.current.srcObject = stream;
      // }
    };

    startCamera();

    return () => {
      // const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
      // tracks?.forEach((track) => track.stop());
      // workerRef.current?.terminate();
      if (videoElement) {
        const tracks = (videoElement.srcObject as MediaStream)?.getTracks();
        tracks?.forEach((track) => track.stop());
      }
      workerRef.current?.terminate();
    };
  }, []);

  const SCAN_BOX = {
    width: 0.9, // 80%
    height: 0.5, // 30%
    x: 0.05,
    y: 0.15,
  };
  // width: 0.9, height: 0.5, x: 0.05, y: 0.1

  // Combobox Selection
  const itemList = [
    "0A00",
    "0A01",
    "0A02",
    "0B00",
    "0B01",
    "B0B00B010B010B010B01",
    "B0B00B010B010B010B02",
    "B0B00B010B010B010B03",
    "B0B00B010B010B010B04",
    "B0B00B010B010B010B05",
    "B0B00B010B010B010B06",
  ] as const;

  const [consItemVal, setConsItemVal] = useState("");
  const [workCodeVal, setWorkCodeVal] = useState("");
  const [othersVal, setOthersVal] = useState("");

  const captureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Capture cropped frame
    const cropWidth = canvas.width * 0.8;
    const cropHeight = canvas.height * 0.3;

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    const sx = vw * SCAN_BOX.x;
    const sy = vh * SCAN_BOX.y;
    const sw = vw * SCAN_BOX.width;
    const sh = vh * SCAN_BOX.height;

    canvas.width = sw;
    canvas.height = sh;

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);

    // ctx.drawImage(
    //   video,
    //   canvas.width * 0.1,
    //   canvas.height * 0.35,
    //   cropWidth,
    //   cropHeight,
    //   0,
    //   0,
    //   cropWidth,
    //   cropHeight,
    // );

    // Optional: simple thresholding
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const avg =
        (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
      imageData.data[i] =
        imageData.data[i + 1] =
        imageData.data[i + 2] =
          avg > 128 ? 255 : 0;
    }
    ctx.putImageData(imageData, 0, 0);

    setLoading(true);

    if (!workerRef.current) {
      workerRef.current = await createWorker("eng+jpn", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(m.progress);
          }
        },
      });
      // await workerRef.current.loadLanguage("eng");
      // await workerRef.current.initialize("eng");
    }

    const { data } = await workerRef.current.recognize(canvas);

    setText(data.text);
    setNewWorkCode(data.text);
    setLoading(false);
    setProgress(0);
    handleScanResults();
    // setOpenModal(true); // Open modal after scanning
  };
  const handleScanResults = () => {
    setOpenModal(true);
    console.log("text: ", text);
  };
  const handleManualInput = () => {
    setOpenManualModal(true);
  };
  const handleCancel = () => {
    setConsItemVal("");
    setWorkCodeVal("");
    setOthersVal("");
    setOpenModal(false);
    setManualWorkOrder("");
  };

  const handleSubmitManualInput = async () => {
    if (!manualWorkOrder.trim()) {
      alert("Work Order name is required");
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
    <div className="flex flex-col w-full h-full">
      <div className="relative flex-1">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-[85dvh] object-cover rounded-md"
        />

        {/* Overlay scan box */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(${scanBox.y * 100}% ${100 - (scanBox.x + scanBox.width) * 100}% ${100 - (scanBox.y + scanBox.height) * 100}% ${scanBox.x * 100}%)`,
            }}
          />
          <div
            className="absolute border-3 border-primary"
            style={{
              width: `${scanBox.width * 100}%`,
              height: `${scanBox.height * 100}%`,
              left: `${scanBox.x * 100}%`,
              top: `${scanBox.y * 100}%`,
            }}
          />
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {loading && <Progress value={progress * 100} />}

        <div className="absolute bottom-25 w-full flex flex-col gap-2 px-6">
          <Button
            onClick={captureAndRecognize}
            disabled={loading}
            className="flex-1 gradient-bg text-xl"
          >
            Scan
          </Button>
          {/* <Button
            disabled={!text}
            className="flex-1 text-xl gradient-bg disabled:bg-transparent disabled:text-gray-100"
            onClick={handleScanResults}
          >
            Show Result
          </Button> */}
          <Button
            className="flex-1 text-xl gradient-bg disabled:bg-transparent disabled:text-gray-100"
            onClick={handleManualInput}
          >
            Manual Input
          </Button>
          <p className="text-center text-sm text-white ">
            Cannot scan the Work Order? Add it here manually.
          </p>
        </div>

        {/* Scanning Dialog */}
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="box-design text-black-text">
            <DialogHeader className="border-b-1 border-gray-300 pb-2">
              <DialogTitle className="flex flex-row items-center gap-3 font-semibold">
                <Image
                  src="/scan_result.png"
                  width={35}
                  height={35}
                  alt="icon"
                />
                Scanning Results
              </DialogTitle>
            </DialogHeader>
            {/* <pre className="whitespace-pre-wrap rounded bg-muted p-3 text-sm">
              {text}
            </pre> */}

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
                items={itemList}
                placeholder="Select Work Code"
              />
            </div>

            <div className="flex flex-col w-full gap-1">
              {/* <label className="font-bold">Others</label> */}
              <CustomComboBox
                label="Others"
                value={othersVal}
                setValue={setOthersVal}
                items={itemList}
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

        {/* Manual Input Dialog */}
        <Dialog open={openManualModal} onOpenChange={setOpenManualModal}>
          <DialogContent className="box-design text-black-text">
            <DialogHeader className="border-b-1 border-gray-300 pb-2">
              <DialogTitle className="flex flex-row items-center gap-3 font-semibold">
                <Image
                  src="/manual_edit.png"
                  width={35}
                  height={35}
                  alt="icon"
                />
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
                items={itemList}
                placeholder="Select Work Code"
              />
            </div>
            <div className="flex flex-col w-full gap-1">
              {/* <label className="font-bold">Others</label> */}
              <CustomComboBox
                label="Others"
                value={othersVal}
                setValue={setOthersVal}
                items={itemList}
                placeholder="Select Others"
              />
            </div>

            <DialogFooter className="mt-3">
              <Button
                variant="outline"
                className="cancel-btn text-lg"
                onClick={() => {
                  setOpenManualModal(false);
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
      </div>
    </div>
  );
}
