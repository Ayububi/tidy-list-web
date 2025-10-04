import { useState, useEffect } from "react";
import { CheckSquare } from "lucide-react";
import { AddTodo } from "@/components/AddTodo";
import { TodoList } from "@/components/TodoList";
import { Todo } from "@/types/todo";
import { toast } from "sonner";

const STORAGE_KEY = "todos";

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
    toast.success("Task added!");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.success("Task deleted");
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-lg">
            <CheckSquare className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Todo List
          </h1>
          <p className="text-muted-foreground">
            {totalCount === 0
              ? "Stay organized and productive"
              : `${completedCount} of ${totalCount} tasks completed`}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl border border-border p-6 space-y-6">
          <AddTodo onAdd={addTodo} />
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>
      </div>
    </div>
  );
};

export default Index;
