"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmationModal({ 
  isOpen, 
  title, 
  message, 
  onCancel, 
  onConfirm 
}: ConfirmationModalProps) {
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header / Icon Area */}
        <div className="flex items-start justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {title}
              </h2>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors rounded-lg p-1 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="px-6 pb-6">
          <p className="text-slate-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 flex flex-col sm:flex-row-reverse gap-3 border-t">
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-200"
          >
            Confirm Action
          </button>
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}