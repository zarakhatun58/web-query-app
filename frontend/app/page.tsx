"use client";

import { useState } from "react";
import { useTask } from "./hooks/useTasks";
import { Header } from "./components/Header";
import { TaskForm } from "./components/TaskForm";
import { TaskDetail } from "./components/TaskDetail";
import { TaskList } from "./components/TaskList";


export default function Page() {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const { data: selectedTask } = useTask(selectedTaskId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-12 gap-6 h-full">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6 flex flex-col">
            <TaskForm />

            <div className="flex-1 min-h-0">
              <TaskList
                selectedTaskId={selectedTaskId}
                onSelectTask={setSelectedTaskId}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 min-h-[500px]">
            <TaskDetail task={selectedTask || null} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            Powered by Firecrawl for web scraping & AI for intelligent answers
          </p>
        </div>
      </footer>
    </div>
  );
}
