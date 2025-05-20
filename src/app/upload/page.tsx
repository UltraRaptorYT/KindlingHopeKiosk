"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleUpload = async () => {
    if (loading) return;

    if (!file || loading) {
      toast.error("No file found!");
      return;
    } // 🔒 Prevent duplicate clicks

    setLoading(true); // 🔐 Lock the button

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data.url) {
        setUrl(data.url);
      } else {
        toast.error("Upload failed!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    } finally {
      toast.success("File uploaded!");
      setLoading(false); // 🔓 Unlock regardless of success/failure
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-3xl font-bold">Upload an Image to Supabase</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
      {url && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Image URL:</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <input
              type="text"
              value={url}
              readOnly
              className="border rounded px-2 py-1 w-full max-w-md text-sm"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Copy
            </button>
          </div>
          <div className="mt-4 relative w-full max-w-sm aspect-[4/3] rounded border overflow-hidden">
            <Image
              src={url}
              alt="Uploaded image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
