// File: components/assessment/ImageUpload.tsx

import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ImageUploadProps {
  onUpload: (fileIds: string[]) => void;
  maxPhotos: number;
  title: string;
  description: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  maxPhotos,
  title,
  description,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFile = useMutation(api.files.saveFile);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    if (files.length > maxPhotos) {
      toast({
        title: "Too many files",
        description: `You can only upload a maximum of ${maxPhotos} photos.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    const uploadedFileIds = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        });
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 5MB size limit.`,
          variant: "destructive",
        });
        continue;
      }

      try {
        const uploadUrl = await generateUploadUrl();
        await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        const fileId = await saveFile({
          storageId: uploadUrl,
          fileName: file.name,
        });
        uploadedFileIds.push(fileId);

        setProgress(((i + 1) / files.length) * 100);
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Upload Error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }

    setUploading(false);
    onUpload(uploadedFileIds);
  };

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={uploading}
        aria-label="Upload images"
      />
      {uploading && <Progress value={progress} className="mt-2" />}
      <Button
        onClick={() => document.querySelector('input[type="file"]')?.click()}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Select Images"}
      </Button>
    </div>
  );
};