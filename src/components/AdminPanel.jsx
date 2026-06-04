import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Trash2,
  ImagePlus,
  CheckCircle,
  AlertCircle,
  Loader2,
  LogOut,
  Camera,
  FileImage,
} from "lucide-react";
import imageCompression from "browser-image-compression";
import { supabase } from "../lib/supabase";
import { requireAdminSession } from "../lib/adminSession";

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png"];
const BUCKET = "works";

export function AdminPanel({ works, onClose, onLogout, onRefresh }) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleFile = (f) => {
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      showToast("Only JPG, JPEG, and PNG files are supported.", "error");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleUpload = async () => {
    if (!file || !form.name.trim()) {
      showToast("Please select an image and enter a project name.", "error");
      return;
    }

    setUploading(true);
    try {
      await requireAdminSession();

      // Compress to max 1MB
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type,
      });

      const ext = file.name.split(".").pop().toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, compressed, { contentType: file.type });

      if (uploadError) {
        throw new Error(
          uploadError.message?.includes("row-level security")
            ? "Storage blocked by RLS. Run supabase/fix-rls-policies.sql in the SQL Editor, then log out and back in."
            : uploadError.message
        );
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

      // Save to DB
      const { error: dbError } = await supabase.from("projects").insert([
        {
          name: form.name.trim(),
          description: form.description.trim() || null,
          image_url: urlData.publicUrl,
          file_name: fileName,
        },
      ]);

      if (dbError) {
        throw new Error(
          dbError.message?.includes("row-level security")
            ? "Database blocked by RLS. Run supabase/fix-rls-policies.sql in the SQL Editor, then log out and back in."
            : dbError.message
        );
      }

      showToast("Work uploaded successfully!");
      setFile(null);
      setPreview(null);
      setForm({ name: "", description: "" });
      onRefresh();
    } catch (err) {
      const msg = err.message || "Upload failed.";
      showToast(msg, "error");
      if (msg.includes("Not authenticated")) onLogout();
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (work) => {
    if (!confirm(`Delete "${work.name}"? This cannot be undone.`)) return;
    setDeleting(work.id);
    try {
      await requireAdminSession();
      // Delete from storage
      if (work.file_name) {
        await supabase.storage.from(BUCKET).remove([work.file_name]);
      }
      // Delete from DB
      const { error } = await supabase.from("projects").delete().eq("id", work.id);
      if (error) throw error;
      showToast("Work deleted.");
      onRefresh();
    } catch (err) {
      const msg = err.message || "Delete failed.";
      showToast(msg, "error");
      if (msg.includes("Not authenticated")) onLogout();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative z-10 mx-auto my-8 max-w-3xl rounded-3xl border border-white/10 bg-neutral-900/95 shadow-2xl backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-blue-500/30 border border-white/10">
              <Camera className="h-4 w-4 text-fuchsia-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
              <p className="text-xs text-white/40">Manage your photography works</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-white/50 transition hover:border-white/20 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Upload Section */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-white/40">
              <ImagePlus className="h-3.5 w-3.5" />
              Upload New Work
            </h3>

            {/* Drop Zone */}
            <div
              className={`relative mb-4 cursor-pointer rounded-2xl border-2 border-dashed transition-all ${dragOver
                ? "border-fuchsia-400/60 bg-fuchsia-500/10"
                : preview
                  ? "border-white/20 bg-white/5"
                  : "border-white/15 bg-white/3 hover:border-fuchsia-400/40 hover:bg-white/5"
                }`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-56 w-full rounded-2xl object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition hover:opacity-100">
                    <p className="text-sm text-white">Click to change image</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                    className="absolute right-3 top-3 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center gap-3 text-white/30">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <FileImage className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/50">
                      Drop image here or click to browse
                    </p>
                    <p className="mt-1 text-xs text-white/25">
                      JPG, JPEG, PNG supported · Auto-compressed to 1MB
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>

            {/* Form Fields */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-white/30">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Wedding at Sunset"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-white/30">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20"
                />
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading || !file || !form.name.trim()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:from-fuchsia-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Compressing & Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload to Supabase
                </>
              )}
            </button>
          </div>

          {/* Works List */}
          <div>
            <h3 className="mb-4 flex items-center justify-between text-sm font-medium uppercase tracking-widest text-white/40">
              <span className="flex items-center gap-2">
                <Camera className="h-3.5 w-3.5" />
                Published Works
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-normal text-white/40">
                {works.length} items
              </span>
            </h3>

            {works.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-white/3 py-10 text-center text-sm text-white/25">
                No works uploaded yet. Upload your first photography above.
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {works.map((work) => (
                  <div
                    key={work.id}
                    className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/5 p-3 transition hover:border-white/15"
                  >
                    <img
                      src={work.image_url}
                      alt={work.name}
                      className="h-14 w-14 flex-shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm text-white">{work.name}</p>
                      {work.description && (
                        <p className="mt-0.5 truncate text-xs text-white/40">{work.description}</p>
                      )}
                      <p className="mt-0.5 text-xs text-white/25">
                        {new Date(work.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(work)}
                      disabled={deleting === work.id}
                      className="flex-shrink-0 rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:border-red-500/40 hover:bg-red-500/20 disabled:opacity-50"
                    >
                      {deleting === work.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 flex items-center gap-2.5 rounded-2xl border px-5 py-3 text-sm font-medium shadow-2xl backdrop-blur-xl ${toast.type === "error"
              ? "border-red-500/30 bg-red-950/80 text-red-200"
              : "border-fuchsia-500/30 bg-fuchsia-950/80 text-fuchsia-200"
              }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
