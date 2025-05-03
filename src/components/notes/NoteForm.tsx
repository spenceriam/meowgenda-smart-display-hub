
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/types";
import { cn } from "@/lib/utils";

interface NoteFormProps {
  note: Note | null;
  onSave: (note: Note) => void;
  onCancel: () => void;
}

export default function NoteForm({ note, onSave, onCancel }: NoteFormProps) {
  const [title, setTitle] = React.useState(note?.title || "");
  const [content, setContent] = React.useState(note?.content || "");
  const [color, setColor] = React.useState(note?.color || "#50C2A7");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newNote: Note = {
      id: note?.id || Date.now().toString(),
      title: title.trim() || "Untitled Note",
      content,
      createdAt: note?.createdAt || Date.now(),
      updatedAt: Date.now(),
      color
    };
    
    onSave(newNote);
  };

  const colorOptions = [
    { value: "#50C2A7", label: "Mint" },
    { value: "#E5DEFF", label: "Purple" },
    { value: "#FEF7CD", label: "Yellow" },
    { value: "#FFDEE2", label: "Pink" },
    { value: "#FDE1D3", label: "Peach" },
    { value: "#D3E4FD", label: "Blue" }
  ];

  return (
    <div className="bg-card border rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">
        {note ? "Edit Note" : "Create New Note"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={8}
              className="resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {colorOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "h-8 flex-1 rounded-md",
                    color === option.value && "ring-2 ring-primary ring-offset-1"
                  )}
                  style={{ backgroundColor: option.value }}
                  onClick={() => setColor(option.value)}
                  title={option.label}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
