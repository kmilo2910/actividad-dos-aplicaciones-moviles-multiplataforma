'use client';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);
  if (!message || typeof document === 'undefined') return null;
  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-end p-4 md:p-6"
      role="status"
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-white/40 bg-[#1f4f66]/85 px-4 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur-md">
        <span>{message}</span>
        <button
          onClick={onClose}
          aria-label="Cerrar notificación"
          className="text-lg leading-none opacity-80 hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>,
    document.body
  );
}
