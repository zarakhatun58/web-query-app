export type TaskStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface Task {
  id: number;
  url: string;
  question: string;
  status: TaskStatus;
  scraped_content: string | null;
  ai_answer: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}
