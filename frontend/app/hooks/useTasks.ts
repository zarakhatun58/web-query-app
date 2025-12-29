"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, getTask, getAllTasks, Task } from "../lib/api";
import { useToast } from "./use-toast";

/**
 * All tasks (poll every 5s)
 */
export function useAllTasks() {
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getAllTasks,
    refetchInterval: 5000,
  });
}

/**
 * Single task (poll while queued/processing)
 */
export function useTask(taskId: number | null) {
  return useQuery<Task | null>({
    queryKey: ["task", taskId],
    queryFn: () =>
      taskId !== null ? getTask(taskId.toString()) : null,
    enabled: taskId !== null,
    refetchInterval: (query: any) => {
      const task = query.state.data;
      if (!task) return false;

      if (task.status === "queued" || task.status === "processing") {
        return 2000;
      }

      return false;
    },
  });
}


/**
 * Create task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      url,
      question,
    }: {
      url: string;
      question: string;
    }) => createTask(url, question),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task submitted",
        description: "Website is being analyzed.",
      });
    },

    onError: (err: any) => {
      toast({
        title: "Error",
        description: err?.message || "Failed to create task",
        variant: "destructive",
      });
    },
  });
}
