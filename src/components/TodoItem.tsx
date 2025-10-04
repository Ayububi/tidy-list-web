import { Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <div className="group flex items-center gap-3 p-4 bg-card rounded-lg border border-border transition-all hover:shadow-md animate-in fade-in slide-in-from-left-2 duration-300">
      <Checkbox
        id={todo.id}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="h-5 w-5"
      />
      <label
        htmlFor={todo.id}
        className={`flex-1 cursor-pointer select-none text-base transition-all ${
          todo.completed
            ? "line-through text-muted-foreground"
            : "text-foreground"
        }`}
      >
        {todo.text}
      </label>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
