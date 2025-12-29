const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Task status (must match backend)
 */
export type TaskStatus =
  | "queued"
  | "processing"
  | "done"
  | "failed";

/**
 * Task type (matches DB schema)
 */
export interface Task {
  id: number;
  url: string;
  question: string;
  status: TaskStatus;
  scraped_content: string | null;
  answer: string | null;
  error_message: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Helper
 */
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API request failed");
  }
  return res.json();
}

/**
 * Create task (this already triggers BullMQ)
 */
export async function createTask(
  url: string,
  question: string
): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, question }),
  });

  return handleResponse<Task>(res);
}

/**
 * Get single task
 */
export async function getTask(id: string): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`);
  return handleResponse<Task>(res);
}

/**
 * Get all tasks
 */
export async function getAllTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    cache: "no-store",
  });
  return handleResponse<Task[]>(res);
}
