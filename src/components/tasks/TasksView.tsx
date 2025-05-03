
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/types";
import { Check, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function TasksView() {
  const [tasks, setTasks] = React.useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [
      {
        id: "1",
        text: "Welcome to your task list!",
        completed: false,
        createdAt: Date.now()
      }
    ];
  });
  
  const [newTask, setNewTask] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      createdAt: Date.now()
    };
    
    setTasks([...tasks, task]);
    setNewTask("");
    inputRef.current?.focus();
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
      </div>

      <div className="bg-card rounded-lg shadow-sm p-6">
        <form onSubmit={addTask} className="flex gap-2 mb-6">
          <Input
            ref={inputRef}
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow"
          />
          <Button type="submit" disabled={!newTask.trim()}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </form>

        {tasks.length === 0 ? (
          <div className="text-center py-8 bg-meow-pink/50 rounded-lg">
            <p className="text-muted-foreground">No tasks yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-medium mb-3">Pending Tasks</h2>
                <div className="space-y-2">
                  {pendingTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 p-3 bg-background rounded-lg"
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="h-5 w-5"
                      />
                      <span className="flex-grow">{task.text}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedTasks.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium">Completed</h2>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Clear completed
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear completed tasks?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove all completed tasks. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={clearCompletedTasks}>
                          Clear
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="space-y-2">
                  {completedTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 p-3 bg-background rounded-lg opacity-70"
                    >
                      <div className="h-5 w-5 rounded-sm bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <span className="flex-grow line-through text-muted-foreground">{task.text}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleTask(task.id)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
