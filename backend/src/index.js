require("dotenv").config();

const express = require("express");
const { Queue } = require("bullmq");
const { db, tasks } = require("./db");

const app = express();
/* ✅ CORS — MUST be before routes */
app.use(
  cors({
    origin: [
      "http://localhost:3000",         
      "https://your-frontend.onrender.com", 
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const queue = new Queue("tasks", {
  connection: { url: process.env.REDIS_URL }
});

/**
 * CREATE TASK
 */
app.post("/tasks", async (req, res) => {
  const { url, question } = req.body;

  const [task] = await db
    .insert(tasks)
    .values({
      url,
      question,
      status: "pending",
    })
    .returning();

  await queue.add("process", { taskId: task.id });

  res.json(task);
});

/**
 * GET ALL TASKS
 */
app.get("/tasks", async (_req, res) => {
  const allTasks = await db.query.tasks.findMany({
    orderBy: (t, { desc }) => [desc(t.created_at)],
  });

  res.json(allTasks);
});

/**
 * GET SINGLE TASK
 */
app.get("/tasks/:id", async (req, res) => {
  const task = await db.query.tasks.findFirst({
    where: (t, { eq }) => eq(t.id, Number(req.params.id)),
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
});

app.listen(4000, () => {
  console.log("🚀 API running on http://localhost:4000");
});
