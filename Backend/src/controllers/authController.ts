import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import type { User } from "../types/index.js";

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const existing = await pool.query<User>(// pool.query returns an object in which there is array which contains the requested
      "SELECT id FROM users WHERE email = $1",// parameter and the rowcount. in this case the rowcount is 0 or 1.
      [email]
    );

    if ((existing.rowCount ?? 0) > 0) {// here the rowcount is checked to see the email already exists or not. 
      res.status(409).json({ message: "Email already registered" });//(existing.rowCount ?? 0) means if rowcount is null or undefined the rowcount is 0.
      return; // here 409 status code is used as it detects conflicting users.
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query<User>(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
      [email, password_hash]
    );

    const user = result.rows[0];// result is { [ {email, id} ] } so the result is a object which contains array of objects and the 
    const secret = process.env["JWT_SECRET"] ?? "secret";// other variables. so rows[0] means the object at idx 0.
    const token = jwt.sign({ userId: user?.id, email: user?.email }, secret, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, user: { id: user?.id, email: user?.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const secret = process.env["JWT_SECRET"] ?? "secret";
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
      expiresIn: "7d",
    });

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
/*
pool.query returns 
{
  rows: [
    {
      id: 5
    }
  ],
  rowCount: 1
}
*/