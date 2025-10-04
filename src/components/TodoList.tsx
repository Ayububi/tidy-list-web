import { Todo } from "@/types/todo";
import { TodoItem } from "./TodoItem";
import { CheckCircle2 } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoList = ({ todos, onToggle, onDelete }: TodoListProps) => {
  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground text-lg">No tasks yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeTodos.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Active ({activeTodos.length})
          </h3>
          <div className="space-y-2">
            {activeTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {completedTodos.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Completed ({completedTodos.length})
          </h3>
          <div className="space-y-2">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
