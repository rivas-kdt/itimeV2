"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, FileSpreadsheet, FilePlus2 } from "lucide-react";

type ImportSectionProps = {
  onFilesChange?: (files: { name: string; file: File }[]) => void;
  //   toast: (status: boolean, type: string) => void;
  // showModal: (boolean: boolean) => void;
  showModal: boolean;
  onImportSuccess?: () => void;
};

export const ImportSection: React.FC<ImportSectionProps> = ({
  onFilesChange,
  //   toast,
  showModal,
  onImportSuccess,
}) => {
  const [files, setFiles] = useState<{ name: string; file: File }[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  //   const t = useTranslations("AssetPage");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (files.length < 1) {
      const selectedFiles = e.target.files;
      if (!selectedFiles) return;

      const newFiles = Array.from(selectedFiles).map((file) => ({
        name: file.name,
        file: file,
      }));

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);

      setShowDialog(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      //   toast(false, "max-import");
    }
    setShowDialog(false);
  };

  const handleDelete = (name: string) => {
    const updatedFiles = files.filter((f) => f.name !== name);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const handleImport = async () => {
    if (files.length === 0) {
      //   toast(false, "import");
      return;
    }

    setIsUploading(true);

    try {
      let totalSuccessCount = 0;
      let totalErrorCount = 0;
      let totalProcessed = 0;

      // Process each file
      for (const fileObj of files) {
        const formData = new FormData();
        formData.append("file", fileObj.file);

        const response = await fetch("/api/assets/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Upload failed:", errorData);
          setIsUploading(false);
          return;
        }

        const result = await response.json();

        // Accumulate results
        totalSuccessCount += result.summary.successCount;
        totalErrorCount += result.summary.errorCount;
        totalProcessed += result.summary.processed;
      }

      // Results handled by existing toast system

      // Clear files and show success
      setFiles([]);
      onFilesChange?.([]);
      //   toast(true, "import");
      // showModal(false);
      onImportSuccess?.();

      // Refresh asset list
      onImportSuccess?.();
    } catch (error) {
      console.error("Error uploading files:", error);
      //   toast(false, "import");
    } finally {
      setIsUploading(false);
    }
  };

  const fileTypes = ".xlsx, .csv, .xls, .xlsm, .xlsb, .xltx, .xlt, .ods, .xlsb";
  return (
    <div className="grid gap-4 p-4 border border-gray-500 rounded-lg">
      {/* Header */}
      <div className="grid grid-cols-2 items-center">
        <div className="flex items-center gap-2">
          {/* <FileSpreadsheet className="w-7 h-7 text-primary" /> */}
          <h2 className="text-sm font-bold text-primary">Import Data</h2>
        </div>
        <div className="flex justify-end">
          <Button
            className="flex text-white text-md gradient-bg items-center justify-center gap-2 cursor-pointer"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <FilePlus2 className="text-white w-5 h-5" />
            Select File
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="border border-gray-300 rounded-md p-4 space-y-2 max-h-36 overflow-y-auto no-scrollbar">
        {files.length === 0 ? (
          <p className="text-center text-gray-500">No Files Selected</p>
        ) : (
          files.map((f, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 border border-primary rounded hover:bg-gray-100 hover:border-gray-300 transition"
            >
              <span className="truncate max-w-[80%] text-black-text">
                {f.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(f.name)}
              >
                <X className="w-4 h-4 text-black-text" />
              </Button>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center justify-center">
        {/* Sample File here */}
        <Button
          className="flex gradient-bg w-full text-white"
          onClick={() => handleImport()}
          disabled={isUploading || files.length === 0}
        >
          {" "}
          {/* onclick here for uploading imported file to DB, then close modal*/}
          {isUploading ? "Processing..." : "Import Selected Files"}
        </Button>
      </div>

      {/* Upload Dialog */}
      {/* <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-rustic-300">Upload Excel File</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                fileInputRef.current?.click();
              }}
            >
              Choose from Device
            </Button>
            <Button
              className="w-[30%] mx-auto"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog> */}

      {/* Hidden Input */}
      <input
        type="file"
        accept={fileTypes}
        ref={fileInputRef}
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
