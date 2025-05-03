
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";

interface CustomColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function CustomColorPicker({ value, onChange }: CustomColorPickerProps) {
  const [customColor, setCustomColor] = useState(value);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
  };

  const applyCustomColor = () => {
    onChange(customColor);
  };

  const isValidHexColor = (color: string) => {
    return /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full flex justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Custom Color</span>
          </div>
          <div 
            className="h-4 w-4 rounded-full border" 
            style={{ backgroundColor: value || "#FFFFFF" }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <input
              type="color"
              value={customColor}
              onChange={handleColorChange}
              className="w-full h-40 cursor-pointer rounded-md mb-3"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hex-color">Hex Color Code</Label>
            <div className="flex gap-2">
              <Input
                id="hex-color"
                value={customColor}
                onChange={handleColorChange}
                placeholder="#FFFFFF"
              />
              <div 
                className="h-10 w-10 rounded-md border" 
                style={{ backgroundColor: isValidHexColor(customColor) ? customColor : "#FFFFFF" }}
              />
            </div>
          </div>
          
          <Button 
            onClick={applyCustomColor} 
            className="w-full"
            disabled={!isValidHexColor(customColor)}
          >
            Apply Color
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
