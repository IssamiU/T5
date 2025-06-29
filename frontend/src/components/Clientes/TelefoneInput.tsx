import React from 'react';
import { Telefone } from '../../services/types';

interface TelefoneInputProps {
  telefone: Telefone;
  index: number;
  onChange: (index: number, field: keyof Telefone, value: string) => void;
  onRemove: (index: number) => void;
  showRemove: boolean;
}

const TelefoneInput: React.FC<TelefoneInputProps> = ({
  telefone,
  index,
  onChange,
  onRemove,
  showRemove
}) => {
  return (
    <div className="flex items-end space-x-2 mb-2">
      <div className="flex-1">
        <label className="block mb-1">DDD *</label>
        <input
          type="text"
          value={telefone.ddd}
          onChange={(e) => onChange(index, 'ddd', e.target.value)}
          className="w-full p-2 border rounded"
          required
          maxLength={2}
        />
      </div>
      
      <div className="flex-1">
        <label className="block mb-1">Número *</label>
        <input
          type="text"
          value={telefone.numero}
          onChange={(e) => onChange(index, 'numero', e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      {showRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="bg-red-500 text-white px-3 py-2 rounded"
        >
          Remover
        </button>
      )}
    </div>
  );
};

export default TelefoneInput;
