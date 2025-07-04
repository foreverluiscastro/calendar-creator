'use client';
import React, { useState } from 'react';

interface Props {
  day: number;
  onClose: () => void;
  onSave: (eventText: string) => void;
}

export default function Event({ day, onClose, onSave }: Props) {
  const [input, setInput] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[300px]">
        <h2 className="text-xl font-semibold mb-4">Agregar evento para el día {day}</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border rounded p-2 mb-4 h-24 resize-none"
          placeholder="Escribe los detalles del evento..."
        />
        <div className="flex justify-between">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              onSave(input);
              onClose();
            }}
            disabled={!input.trim()}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
