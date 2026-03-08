"use client";

import { createWorker, Worker } from "tesseract.js";
import { useEffect, useRef, useState } from "react";

export function useTesseract() {
  const workerRef = useRef<Worker | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const recognize = async (file: File) => {
    setLoading(true);

    if (!workerRef.current) {
      workerRef.current = await createWorker(
        "eng+jpn", // 👈 language goes here
        1, // 👈 number of workers (optional)
        {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setProgress(m.progress);
            }
          },
        },
      );
    }

    const { data } = await workerRef.current.recognize(file);

    setLoading(false);
    setProgress(0);

    return data.text;
  };

  return { recognize, progress, loading };
}
