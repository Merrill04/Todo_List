import type { Response } from "express";
import { pool } from "../config/db.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import type { Todo } from "../types/index.js";

export async function getTodos(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId;
  try {
    const result = await pool.query<Todo>(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function createTodo(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const userId = req.user?.userId;
  const { title, description } = req.body as {
    title: string;
    description?: string;
  };

  if (!title) {
    res.status(400).json({ message: "Title is required" });
    return;
  }

  try {
    const result = await pool.query<Todo>(
      "INSERT INTO todos (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
      [userId, title, description ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateTodo(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const userId = req.user?.userId;
  const { id } = req.params as { id: string };
  const { title, description, completed } = req.body as {
    title?: string;
    description?: string;
    completed?: boolean;
  };

  try {
    const existing = await pool.query<Todo>(
      "SELECT * FROM todos WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if ((existing.rowCount ?? 0) === 0) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    const todo = existing.rows[0];

    const result = await pool.query<Todo>(
      "UPDATE todos SET title=$1, description=$2, completed=$3 WHERE id=$4 AND user_id=$5 RETURNING *",
      [
        title ?? todo?.title,
        description ?? todo?.description,
        completed ?? todo?.completed,
        id,
        userId,
      ]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteTodo(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const userId = req.user?.userId;
  const { id } = req.params as { id: string };

  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if ((result.rowCount ?? 0) === 0) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.json({ message: "Todo deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}