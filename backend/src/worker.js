require("dotenv").config();

const { Worker } = require("bullmq");
const cheerio = require("cheerio");
const { db, tasks } = require("./db");
const { eq } = require("drizzle-orm");

console.log("🚀 Worker started and waiting for jobs...");

new Worker(
  "tasks",
  async (job) => {
    console.log("📥 Job received:", job.data);

    try {
      const task = await db.query.tasks.findFirst({
        where: (t, { eq }) => eq(t.id, job.data.taskId),
      });

      if (!task) throw new Error("Task not found");

      // 🔄 mark processing
      await db
        .update(tasks)
        .set({
          status: "processing",
          updated_at: new Date(),
        })
        .where(eq(tasks.id, task.id));

      console.log("🌐 Scraping:", task.url);

      const html = await (await fetch(task.url)).text();
      const $ = cheerio.load(html);
      const scrapedContent = $("body").text().slice(0, 4000);

      console.log("🤖 Calling AI");

      const res = await fetch(process.env.AI_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: scrapedContent + "\nQ:" + task.question,
        }),
      });

      const data = await res.json();
      const aiAnswer = data?.[0]?.generated_text || "No answer";

      // ✅ success update
      await db
        .update(tasks)
        .set({
          status: "done",
          scraped_content: scrapedContent,
          ai_answer: aiAnswer,
          updated_at: new Date(),
        })
        .where(eq(tasks.id, task.id));

      console.log("✅ Job completed:", task.id);
    } catch (err) {
      console.error("❌ Worker error:", err);

      await db
        .update(tasks)
        .set({
          status: "failed",
          error_message: err.message ?? "Unknown error",
          updated_at: new Date(),
        })
        .where(eq(tasks.id, job.data.taskId));
    }
  },
  {
    connection: { url: process.env.REDIS_URL },
  }
);
