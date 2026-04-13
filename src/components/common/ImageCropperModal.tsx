"use client";

import React, { useState, useCallback } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { motion } from "framer-motion";
import { X, ZoomIn, ZoomOut, Check } from "lucide-react";
import getCroppedImg from "@/lib/imageUtils";

interface ImageCropperModalProps {
  image: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export default function ImageCropperModal({
  image,
  onCropComplete,
  onCancel,
  aspectRatio = 0.8, // Architectural vertical ratio (4:5)
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    try {
      if (!croppedAreaPixels) return;
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      if (croppedBlob) {
        const file = new File([croppedBlob], "avatar.jpg", {
          type: "image/jpeg",
        });
        onCropComplete(file);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white shadow-[0_30px_90px_rgba(0,0,0,0.3)] w-full max-w-lg flex flex-col max-h-[90vh] border border-slate-100"
      >
        {/* Header */}
        <div className="p-8 flex items-center justify-between border-b border-slate-50">
          <div>
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">
              Ajuste de Identidad Visual
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
              Formato Arquitectónico
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-50 text-slate-300 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 min-h-[350px] bg-slate-50">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            cropShape="rect"
            showGrid={true}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
            style={{
                containerStyle: { background: '#f8fafc' },
                cropAreaStyle: { border: '2px solid #000' }
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-8 space-y-8 bg-white">
          <div className="flex items-center gap-6">
            <ZoomOut className="w-4 h-4 text-slate-400" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-1.5 bg-slate-100 rounded-none appearance-none cursor-pointer accent-slate-900"
            />
            <ZoomIn className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-5 border border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-50 transition-all"
            >
              Descartar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-5 bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.3em] hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-amber-500" />
              Confirmar Identidad
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
