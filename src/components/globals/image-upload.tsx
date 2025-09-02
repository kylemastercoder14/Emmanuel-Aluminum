/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import { AxiosProgressEvent } from "axios";
import { useCallback, useState } from "react";
import RadialProgress from "@/components/globals/radial-progress";
import { uploadImageToCloudinary } from "@/lib/upload";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

interface ImageUploadProps {
  onUploadComplete?: (url: string) => void;
  defaultValue: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadComplete, defaultValue }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(
    null
  );

  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    if (progressEvent.total) {
      const percentage = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setProgress(percentage);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const image = event.target.files[0];
      setSelectedImage(image);
      handleImageUpload(image);
    }
  };

  const removeSelectedImage = () => {
    setLoading(false);
    setUploadedImagePath(null);
    setSelectedImage(null);
  };

  const handleImageUpload = async (image: File) => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", uploadPreset as string);
    formData.append("api_key", apiKey as string);

    try {
      const res = await uploadImageToCloudinary(formData, onUploadProgress);
      if (res.status === 200) {
        setLoading(false);
        setUploadedImagePath(res.data.url);
        if (onUploadComplete) {
          onUploadComplete(res.data.url);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error uploading image:", error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const image = acceptedFiles[0];
      setSelectedImage(image);
      handleImageUpload(image);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <div className="space-y-3 h-full">
      <div {...getRootProps()} className="h-full">
        <label
          htmlFor="dropzone-file"
          className="relative flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 w-full visually-hidden-focusable h-full"
        >
          {loading && (
            <div className="text-center max-w-md">
              <RadialProgress progress={progress} />
              <p className="text-sm font-semibold">Uploading Picture</p>
              <p className="text-xs text-gray-400">
                Do not refresh or perform any other action while the picture is
                being uploaded
              </p>
            </div>
          )}

          {!loading && !uploadedImagePath && !defaultValue && (
            <div className="text-center">
              <div className="border p-2 rounded-md max-w-min mx-auto">
                <IoCloudUploadOutline size="1.6em" />
              </div>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Drag an image</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-400">
                Select a image or drag here to upload directly
              </p>
            </div>
          )}

          {(uploadedImagePath || defaultValue) && !loading && (
            <div className="text-center space-y-2">
              <Image
                width={1200}
                height={1200}
                src={uploadedImagePath || defaultValue}
                className="w-full object-contain max-h-40"
                alt="uploaded image"
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold">Image Uploaded</p>
                <p className="text-xs text-gray-400">
                  Click here to upload another image
                </p>
              </div>
            </div>
          )}

          {!!uploadedImagePath && (
            <div className="flex items-center mt-2 justify-center">
              <Button
                onClick={removeSelectedImage}
                type="button"
                variant="destructive"
                size="sm"
              >
                {uploadedImagePath ? "Remove" : "Close"}
              </Button>
            </div>
          )}
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/png, image/jpeg"
          type="file"
          className="hidden"
          disabled={loading || uploadedImagePath !== null}
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
