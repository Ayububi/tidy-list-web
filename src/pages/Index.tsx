import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { CheckSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTodo } from "@/components/AddTodo";
import { TodoList } from "@/components/TodoList";
import { Todo } from "@/types/todo";
import { toast } from "sonner";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setTodos((data || []).map((todo: any) => ({
        id: todo.id,
        text: todo.text,
        completed: todo.completed,
        createdAt: new Date(todo.created_at).getTime(),
      })));
    } catch (error: any) {
      toast.error("Failed to load todos");
    }
  };

  const addTodo = async (text: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await (supabase as any)
        .from("todos")
        .insert({
          user_id: user.id,
          text,
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) return;

      setTodos([
        {
          id: data.id,
          text: data.text,
          completed: data.completed,
          createdAt: new Date(data.created_at).getTime(),
        },
        ...todos,
      ]);
      toast.success("Task added!");
    } catch (error: any) {
      toast.error("Failed to add task");
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const { error } = await (supabase as any)
        .from("todos")
        .update({ completed: !todo.completed })
        .eq("id", id);

      if (error) throw error;

      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (error: any) {
      toast.error("Failed to update task");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from("todos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Task deleted");
    } catch (error: any) {
      toast.error("Failed to delete task");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

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
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
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