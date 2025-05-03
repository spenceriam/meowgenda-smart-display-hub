
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2 } from "lucide-react";
import { Note } from "@/types";
import NoteForm from "./NoteForm";
import { cn } from "@/lib/utils";

export function NotesView() {
  const [notes, setNotes] = React.useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "1",
        title: "Welcome to Meowgenda",
        content: "This is your personal information hub. Add notes, track events, and stay organized!",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        color: "#E5DEFF"
      }
    ];
  });
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedNote, setSelectedNote] = React.useState<Note | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const filteredNotes = notes.filter(
    note => note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNote = () => {
    setSelectedNote(null);
    setIsFormOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsFormOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setIsFormOpen(false);
    }
  };

  const handleSaveNote = (note: Note) => {
    if (selectedNote) {
      // Edit existing note
      setNotes(notes.map(n => n.id === note.id ? note : n));
    } else {
      // Add new note
      setNotes([...notes, note]);
    }
    setIsFormOpen(false);
  };

  const colorMap: Record<string, string> = {
    "#50C2A7": "bg-meow-mint",
    "#E5DEFF": "bg-meow-purple",
    "#FEF7CD": "bg-meow-yellow",
    "#FFDEE2": "bg-meow-lightpink",
    "#FDE1D3": "bg-meow-peach",
    "#D3E4FD": "bg-meow-blue",
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Notes</h1>
        <Button onClick={handleAddNote}>
          <Plus className="mr-2 h-4 w-4" /> New Note
        </Button>
      </div>

      <div className="flex relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isFormOpen ? (
        <NoteForm
          note={selectedNote}
          onSave={handleSaveNote}
          onCancel={() => setIsFormOpen(false)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-meow-pink/50 rounded-lg">
              <p className="text-muted-foreground">No notes found</p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                className="bg-card border rounded-lg shadow-sm overflow-hidden h-64 flex flex-col"
              >
                <div 
                  className={cn("h-2", colorMap[note.color] || "bg-meow-mint")}
                />
                <div className="p-4 flex-1 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">{note.title}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive -mt-1 -mr-2"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-6">
                    {note.content}
                  </p>
                </div>
                <div className="mt-auto p-4 pt-2 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => handleEditNote(note)}
                  >
                    Edit Note
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
