"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import { FileState, MultiFileDropzone } from "../multi-image-dropzone";

interface MultiFileDropzoneUsageProps {
  onChange: (urls: string[]) => void;
  value: string[];
}

export function MultiFileDropzoneUsage({
  value,
  onChange,
}: MultiFileDropzoneUsageProps) {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();
  const [loading, setloading] = useState(false);
  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }
  return (
    <div>
      <MultiFileDropzone
        value={fileStates}
        onChange={(files) => {
          setFileStates(files);
        }}
        disabled={loading}
        imageUploaded={value}
        onImageUploadedChange={(url) =>
          onChange([...value.filter((item) => item !== url)])
        }
        onFilesAdded={async (addedFiles) => {
          setloading(true);
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.publicFiles.upload({
                  file: addedFileState.file,
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, "COMPLETE");
                    }
                  },
                });
                onChange([...value, res.url]);
              } catch (err) {
                updateFileProgress(addedFileState.key, "ERROR");
              } finally {
                setloading(false);
              }
            })
          );
        }}
      />
    </div>
  );
}
