const { pgTable, serial, text, timestamp } = require("drizzle-orm/pg-core");

exports.tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),

  url: text("url").notNull(),
  question: text("question").notNull(),

  status: text("status").default("queued"),

  scraped_content: text("scraped_content"),
  ai_answer: text("ai_answer"),
  error_message: text("error_message"),

  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
