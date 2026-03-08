"use client";

import { useRef } from "react";

type Props = {
  label?: string;
  onFileSelected: (file: File) => void;
};

export default function CameraCapture({ label, onFileSelected }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          onFileSelected(f);
        }}
      />

      <button
        className="px-3 py-2 rounded-xl border bg-zinc-300 text-sm font-semibold"
        onClick={() => inputRef.current?.click()}
      >
        {label}
      </button>
    </div>
  );
}
