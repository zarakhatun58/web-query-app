"use client";

import { useAllTasks } from "../hooks/useTasks";
import { Task } from "../lib/api";
import { TaskCard } from "./TaskCard";

import { History, Inbox } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";

interface TaskListProps {
  selectedTaskId: number | null;
  onSelectTask: (taskId: number) => void;
}

export function TaskList({ selectedTaskId, onSelectTask }: TaskListProps) {
  const { data: tasks, isLoading, error } = useAllTasks();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">
            Task History
          </h2>
        </div>

        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading tasks</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">
          Task History
        </h2>
        {tasks && tasks.length > 0 && (
          <span className="text-sm text-muted-foreground">
            ({tasks.length})
          </span>
        )}
      </div>

      {!tasks || tasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <Inbox className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No tasks yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Submit a URL and question to get started
            </p>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1 -mr-4 pr-4">
          <div className="space-y-3">
            {tasks.map((task: Task) => (
              <TaskCard
                key={task.id}
                task={task}
                isSelected={task.id === selectedTaskId}
                onClick={() => onSelectTask(task.id)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
