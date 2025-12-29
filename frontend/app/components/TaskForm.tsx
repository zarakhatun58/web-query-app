"use client";

import { useState } from "react";
import { Globe, MessageSquare, Sparkles, Loader2 } from "lucide-react";
import { z } from "zod";
import { useCreateTask } from "../hooks/useTasks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

/**
 * Validation schema (frontend-safe)
 */
const taskSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .max(2000, "URL is too long")
    .refine((val) => {
      try {
        const finalUrl = val.startsWith("http")
          ? val
          : `https://${val}`;
        new URL(finalUrl);
        return true;
      } catch {
        return false;
      }
    }, "Please enter a valid URL"),

  question: z
    .string()
    .trim()
    .min(1, "Question is required")
    .max(1000, "Question must be less than 1000 characters"),
});

type FormErrors = {
  url?: string;
  question?: string;
};

export function TaskForm() {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const createTask = useCreateTask();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const parsed = taskSchema.safeParse({ url, question });

    if (!parsed.success) {
      const fieldErrors: FormErrors = {};

      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field === "url") fieldErrors.url = issue.message;
        if (field === "question") fieldErrors.question = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    createTask.mutate(
      {
        url: parsed.data.url,
        question: parsed.data.question,
      },
      {
        onSuccess: () => {
          setUrl("");
          setQuestion("");
        },
      }
    );
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-primary" />
          Ask a Question
        </CardTitle>
        <CardDescription>
          Enter a website URL and ask any question about its content
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Website URL */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Website URL
            </label>

            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className={errors.url ? "border-destructive" : ""}
              disabled={createTask.isPending}
            />

            {errors.url && (
              <p className="text-sm text-destructive">{errors.url}</p>
            )}
          </div>

          {/* Question */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Your Question
            </label>

            <Textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What is this website about?"
              className={errors.question ? "border-destructive" : ""}
              disabled={createTask.isPending}
            />

            {errors.question && (
              <p className="text-sm text-destructive">
                {errors.question}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={createTask.isPending}
            className="w-full bg-gray-800 text-teal-400 hover:bg-gray-900"
          >
            {createTask.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Website
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
