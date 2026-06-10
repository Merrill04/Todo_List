import { useState } from "react";
import api from "../api/axios";
import type { Todo } from "../types";

interface Props {
  todo: Todo;
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo) => void;
}

export default function TodoItem({ todo, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await api.put<Todo>(`/todos/${todo.id}`, {
        completed: !todo.completed,
      });
      onUpdate(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put<Todo>(`/todos/${todo.id}`, {
        title,
        description,
      });
      onUpdate(res.data);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/todos/${todo.id}`);
      onDelete(todo.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-xl mb-3 flex gap-3 items-start group">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`mt-1 w-5 h-5 rounded-full border-2 shrink-0 transition-colors ${
          todo.completed
            ? "bg-indigo-600 border-indigo-600"
            : "border-zinc-500 hover:border-indigo-400"
        }`}
      />
      <div className="flex-1">
        {editing ? (
          <div className="space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1 bg-zinc-700 text-white rounded border border-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description..."
              className="w-full px-3 py-1 bg-zinc-700 text-zinc-300 rounded border border-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p
              className={`font-medium ${todo.completed ? "line-through text-zinc-500" : "text-white"}`}
            >
              {todo.title}
            </p>
            {todo.description && (
              <p className="text-zinc-400 text-sm mt-0.5">{todo.description}</p>
            )}
          </>
        )}
      </div>
      {!editing && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="text-zinc-400 hover:text-indigo-400 text-sm transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-zinc-400 hover:text-red-400 text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}