
"use client";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import { AxiosProgressEvent } from "axios";
import { useCallback, useState } from "react";
import RadialProgress from "@/components/globals/radial-progress";
import { uploadImageToCloudinary } from "@/lib/upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

interface FileState {
  id: string;
  file?: File;
  progress: number;
  loading: boolean;
  url?: string;
}

interface MultipleImageUploadProps {
  onUploadComplete?: (urls: string[]) => void;
  defaultValues?: string[];
  maxImages?: number;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  onUploadComplete,
  defaultValues = [],
  maxImages = 5,
}) => {
  const [files, setFiles] = useState<FileState[]>(
    defaultValues.map((url, i) => ({
      id: `default-${i}`,
      progress: 100,
      loading: false,
      url,
    }))
  );

  const updateParent = (updated: FileState[]) => {
    if (onUploadComplete) {
      const urls = updated.filter((f) => f.url).map((f) => f.url!) as string[];
      onUploadComplete(urls);
    }
  };

  const onUploadProgress = (fileId: string, progressEvent: AxiosProgressEvent) => {
    if (progressEvent.total) {
      const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, progress: percentage } : f))
      );
    }
  };

  const handleUpload = async (file: File, fileId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset as string);
    formData.append("api_key", apiKey as string);

    try {
      const res = await uploadImageToCloudinary(formData, (e) =>
        onUploadProgress(fileId, e)
      );
      if (res.status === 200) {
        setFiles((prev) => {
          const updated = prev.map((f) =>
            f.id === fileId
              ? { ...f, loading: false, url: res.data.url, progress: 100 }
              : f
          );
          updateParent(updated);
          return updated;
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      updateParent(files.filter((f) => f.id !== fileId));
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length + files.length > maxImages) return;

      const newFiles = acceptedFiles.map((file) => {
        const id = `${file.name}-${Date.now()}`;
        const newFile: FileState = {
          id,
          file,
          progress: 0,
          loading: true,
        };
        handleUpload(file, id);
        return newFile;
      });
      setFiles((prev) => [...prev, ...newFiles]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, maxImages]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    accept: { "image/*": [] },
  });

  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== fileId);
      updateParent(updated);
      return updated;
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    setFiles((prev) => {
      if (!result.destination) return prev;
      const reordered = Array.from(prev);
      const [moved] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, moved);
      updateParent(reordered);
      return reordered;
    });
  };

  return (
    <div className="space-y-3">
      <div {...getRootProps()} className="w-full">
        <label
          htmlFor="dropzone-files"
          className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 w-full"
        >
          <div className="text-center">
            <div className="border p-2 rounded-md max-w-min mx-auto">
              <IoCloudUploadOutline size="1.6em" />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              <span className="font-semibold">Drag images here</span>
            </p>
            <p className="text-xs text-gray-400">or click to select files</p>
          </div>
          <Input
            {...getInputProps()}
            id="dropzone-files"
            type="file"
            accept="image/png,image/jpeg"
            multiple
            className="hidden"
          />
        </label>
      </div>

      {/* Uploaded Files with drag & drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="files"
          direction="horizontal"
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-3 flex-wrap"
            >
              {files.map((file, index) => (
                <Draggable
                  key={file.id}
                  draggableId={file.id}
                  index={index}
                  isDragDisabled={file.loading}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="relative w-32 h-[120px] border rounded-md overflow-hidden bg-gray-100 flex items-center justify-center"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="absolute top-1 left-1 cursor-grab z-10 bg-white/70 p-1 rounded"
                      >
                        ☰
                      </div>

                      {file.url ? (
                        <Image
                          src={file.url}
                          alt="uploaded"
                          width={120}
                          height={120}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                          <RadialProgress progress={file.progress} />
                          <p className="text-xs mt-1">Uploading...</p>
                        </div>
                      )}

                      <div className="absolute top-1 right-1">
                        <Button
                          size="sm"
                          variant="destructive"
                          type="button"
                          className="h-7 w-7 p-0"
                          disabled={file.loading}
                          onClick={() => removeFile(file.id)}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default MultipleImageUpload;
