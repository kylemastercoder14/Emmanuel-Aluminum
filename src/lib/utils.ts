import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper function to ensure the file is a Blob
 * @param file The file to convert to Blob if needed
 * @returns Promise that resolves with the Blob
 */
export const ensureBlob = async (file: File | Blob): Promise<Blob> => {
  // If it's already a Blob, return it directly
  if (file instanceof Blob) {
    return file;
  }

  // Convert File to Blob
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const blob = new Blob([reader.result as ArrayBuffer], {
        type: (file as File).type,
      });
      resolve(blob);
    };
    reader.readAsArrayBuffer(file);
  });
};

export const formatDateTimeLocal = (selectedDate: Date) => {
  // Get current time (hours/minutes in local timezone)
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Clone the selected date and set the current time
  const merged = new Date(selectedDate);
  merged.setHours(hours, minutes, 0, 0);

  // Adjust to local time (Asia/Manila or browser local)
  const tzOffset = merged.getTimezoneOffset() * 60000; // offset in ms
  const localISOTime = new Date(merged.getTime() - tzOffset)
    .toISOString()
    .slice(0, 16); // "YYYY-MM-DDTHH:mm"

  return localISOTime;
};
