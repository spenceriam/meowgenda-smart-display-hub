
import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ColorSelectorProps {
  value: string;
  onChange: (color: string) => void;
  colors: string[];
}

export default function ColorSelector({ value, onChange, colors }: ColorSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            value === color && "ring-2 ring-offset-2 ring-primary"
          )}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        >
          {value === color && (
            <Check className="h-4 w-4 text-white drop-shadow-md" />
          )}
        </button>
      ))}
    </div>
  );
}
