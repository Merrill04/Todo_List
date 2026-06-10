export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface Todo {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: Date;
}

export interface JwtPayload {
  userId: number;
  email: string;
}