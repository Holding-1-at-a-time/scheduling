import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

const FileUploads: React.FC = () => {
  const { setValue } = useFormContext();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFile = useMutation(api.files.saveFile);
  const tenantConfig = useQuery(api.tenants.getTenantConfig);

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);

  useEffect(() => {
    setValue("images", uploadedImages);
    setValue("videos", uploadedVideos);
  }, [uploadedImages, uploadedVideos, setValue]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: "images" | "videos"
  ) => {
    const files = event.target.files;
    if (!files) return;

    setUploadError(null);
    setUploadProgress(0);

    const maxFiles =
      fileType === "images" ? tenantConfig?.maxImages : tenantConfig?.maxVideos;
    const currentFiles =
      fileType === "images" ? uploadedImages : uploadedVideos;

    if (currentFiles.length + files.length > maxFiles!) {
      setUploadError(`You can only upload up to ${maxFiles} ${fileType}.`);
      return;
    }

    const uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file size and type
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`File ${file.name} is too large. Max size is 10MB.`);
        continue;
      }

      const allowedTypes =
        fileType === "images" ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;
      if (!allowedTypes.includes(file.type)) {
        setUploadError(`File ${file.name} has an unsupported format.`);
        continue;
      }

      try {
        // Get a short-lived upload URL
        const uploadUrl = await generateUploadUrl();

        // Upload the file to the URL
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error(`Upload failed with status ${result.status}`);
        }

        // Save the file in Convex
        const fileId = await saveFile({
          storageId: result.headers.get("storageId")!,
          fileName: file.name,
          fileType: file.type,
        });

        uploadedFiles.push(fileId);

        // Update progress
        setUploadProgress((prevProgress) => prevProgress + 100 / files.length);
      } catch (error) {
        console.error("Upload error:", error);
        setUploadError(`Failed to upload ${file.name}. Please try again.`);
      }
    }

    // Update state with new uploaded files
    if (fileType === "images") {
      setUploadedImages((prev) => [...prev, ...uploadedFiles]);
    } else {
      setUploadedVideos((prev) => [...prev, ...uploadedFiles]);
    }

    toast({
      title: "Files uploaded successfully",
      description: `${uploadedFiles.length} ${fileType} have been uploaded.`,
    });
  };

  if (!tenantConfig) {
    return <div>Loading tenant configuration...</div>;
  }

  return (
    <div className="grid gap-4 rotate-in">
      <Label className="font-semibold text-foreground">
        Upload Images/Videos
      </Label>
      <p className="text-sm text-muted-foreground">
        Capture the current condition of your vehicle using your smartphone
        camera.
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => document.getElementById("image-upload")?.click()}
          className="text-foreground border-border hover:bg-muted"
          disabled={uploadedImages.length >= tenantConfig.maxImages}
        >
          Upload Images ({uploadedImages.length}/{tenantConfig.maxImages})
        </Button>
        <input
          id="image-upload"
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          multiple
          onChange={(e) => handleFileUpload(e, "images")}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById("video-upload")?.click()}
          className="text-foreground border-border hover:bg-muted"
          disabled={uploadedVideos.length >= tenantConfig.maxVideos}
        >
          Upload Videos ({uploadedVideos.length}/{tenantConfig.maxVideos})
        </Button>
        <input
          id="video-upload"
          type="file"
          accept={ALLOWED_VIDEO_TYPES.join(",")}
          multiple
          onChange={(e) => handleFileUpload(e, "videos")}
          className="hidden"
        />
      </div>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Progress value={uploadProgress} className="w-full" />
      )}
      {uploadError && <p className="text-destructive">{uploadError}</p>}
    </div>
  );
};

export default FileUploads;
