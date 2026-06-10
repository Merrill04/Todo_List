import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";
import type { Todo } from "../types";

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<Todo[]>("/todos")
      .then((res) => setTodos(res.data))
      .catch(() => {
        logout();
        navigate("/login");
      })
      .finally(() => setLoading(false));
  });

  const handleAdd = (todo: Todo) => setTodos((prev) => [todo, ...prev]);

  const handleDelete = (id: number) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  const handleUpdate = (updated: Todo) =>
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

  const completed = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              My Todos
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              {user?.email} &mdash; {completed}/{todos.length} done
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-4 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        <TodoForm onAdd={handleAdd} />

        {loading ? (
          <div className="text-center text-zinc-500 py-12">Loading...</div>
        ) : todos.length === 0 ? (
          <div className="text-center text-zinc-600 py-12 border border-dashed border-zinc-800 rounded-xl">
            No todos yet. Add one above!
          </div>
        ) : (
          <div>
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}