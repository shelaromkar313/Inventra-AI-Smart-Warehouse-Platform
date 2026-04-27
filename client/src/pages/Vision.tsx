import React, { useState, useRef } from 'react';
import { useAI } from '../hooks/useAI';
import { 
  Camera, 
  Upload, 
  ScanSearch, 
  Info, 
  Loader2, 
  Target,
  Maximize,
  RefreshCcw,
  MousePointer2
} from 'lucide-react';
import { clsx } from 'clsx';

const Vision = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { analyzeImage, cvResponse, isAnalyzing } = useAI();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      analyzeImage(selectedFile);
    }
  };

  // Note: CV detection boxes are mock represented here as overlay elements
  // Actual coordinates would need scaling to image container

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            Computer Vision Platform
            <Target className="w-6 h-6 text-indigo-500" />
          </h1>
          <p className="text-slate-500 mt-1">Upload images for real-time object detection and inventory tracking.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setImagePreview(null)}
            className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-rose-500 transition-all shadow-sm"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Upload className="w-4 h-4" />
            Upload Feed
          </button>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-0 overflow-hidden min-h-[500px] flex items-center justify-center relative bg-slate-900 border-none group">
            {!imagePreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer text-center space-y-4 hover:scale-105 transition-transform duration-300"
              >
                <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto ring-1 ring-slate-700">
                  <Camera className="w-10 h-10 text-slate-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-300 font-bold">Select Warehouse Feed</p>
                  <p className="text-slate-500 text-xs">Supports CCTV screenshots, JPG, PNG</p>
                </div>
              </div>
            ) : (
              <>
                <img 
                  src={imagePreview} 
                  alt="Warehouse feed" 
                  className={clsx(
                    "w-full h-full object-contain transition-all duration-700",
                    isAnalyzing ? "blur-sm opacity-50 scale-95" : "opacity-100"
                  )}
                />
                
                {/* Detection Box Overlays */}
                {cvResponse?.detections.map((det, i) => (
                  <div 
                    key={i}
                    className="absolute border-2 border-indigo-500 bg-indigo-500/10 rounded-sm cursor-help transition-all duration-500 animate-in zoom-in-50"
                    style={{
                      left: `${det.box[0] / 5}%`,
                      top: `${det.box[1] / 6}%`,
                      width: `${(det.box[2] - det.box[0]) / 5}%`,
                      height: `${(det.box[3] - det.box[1]) / 6}%`,
                    }}
                  >
                    <div className="absolute -top-6 left-0 bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-bold shadow-lg">
                      <ScanSearch className="w-3 h-3" />
                      {det.label.toUpperCase()} {Math.round(det.confidence * 100)}%
                    </div>
                  </div>
                ))}

                {isAnalyzing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
                      <p className="text-white font-bold tracking-widest text-xs uppercase animate-pulse">Running Neural Engine...</p>
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-3 bg-white rounded-xl shadow-2xl text-slate-900">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {imagePreview && !isAnalyzing && !cvResponse && (
            <button 
              onClick={handleAnalyze}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              <ScanSearch className="w-5 h-5" />
              Perform Deep Scan
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">
              <Info className="w-5 h-5 text-indigo-500" />
              Scan Intelligence
            </h3>
            
            {!cvResponse ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <MousePointer2 className="w-5 h-5 text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm">Upload and scan an image to extract structured data.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Model Status</p>
                    <p className="text-emerald-700 font-bold">Optimization Success</p>
                  </div>
                  <CheckIcon className="w-5 h-5 text-emerald-500" />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detected Objects</p>
                  <div className="space-y-2">
                    {cvResponse.detections.map((det, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <span className="font-bold text-slate-700 capitalize">{det.label}</span>
                        <span className="text-xs font-mono bg-white px-2 py-1 rounded text-indigo-600 border border-slate-200">
                          {Math.round(det.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium">SCAN TIMESTAMP</p>
                  <p className="text-xs font-bold text-slate-600">{new Date().toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          <div className="card bg-indigo-600 text-white">
            <h3 className="font-bold flex items-center gap-2 mb-2">
              <SparklesIcon className="w-4 h-4" />
              Pro Tip
            </h3>
            <p className="text-xs leading-relaxed text-indigo-100">
              For better object recognition in low-light warehouse conditions, enable the "Infrared mode" in your camera settings before uploading the feed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const SparklesIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
  </svg>
);

export default Vision;
