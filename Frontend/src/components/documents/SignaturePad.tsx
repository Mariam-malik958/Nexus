import React, { useRef, useState } from 'react';

interface Props {
  onSave: (signatureDataUrl: string) => void;
  onCancel: () => void;
}

export const SignaturePad: React.FC<Props> = ({ onSave, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const save = () => {
    if (canvasRef.current) {
      onSave(canvasRef.current.toDataURL());
    }
  };

  return (
    <div className="border rounded p-4 bg-gray-50">
      <p className="text-sm font-medium mb-2">Draw your signature below:</p>
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border bg-white rounded cursor-crosshair w-full"
      />
      <div className="mt-3 flex justify-end gap-2">
        <button onClick={clear} className="px-3 py-1 text-sm border rounded hover:bg-gray-100">Clear</button>
        <button onClick={onCancel} className="px-3 py-1 text-sm border rounded hover:bg-gray-100">Cancel</button>
        <button onClick={save} className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">Apply</button>
      </div>
    </div>
  );
};