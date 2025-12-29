"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Globe,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  FileText,
  Bot,
  LucideIcon,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Task } from "../lib/api";

interface TaskDetailProps {
  task: Task | null;
}

type StatusConfig = {
  label: string;
  icon: LucideIcon;
  className: string;
  iconClassName?: string;
};

const statusConfig: Record<Task["status"], StatusConfig> = {
  queued: {
    label: "Queued",
    icon: Clock,
    className: "bg-warning/20 text-warning border-warning/30",
  },
  processing: {
    label: "Processing",
    icon: Loader2,
    className: "bg-primary/20 text-primary border-primary/30",
    iconClassName: "animate-spin",
  },
  done: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-success/20 text-success border-success/30",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
};

export function TaskDetail({ task }: TaskDetailProps) {
  if (!task) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-16">
          <Bot className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-muted-foreground">
            Select a task to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  const status = statusConfig[task.status];
  const StatusIcon = status.icon;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b pb-4">
        <div className="flex justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2 mb-2">
              <Globe className="h-5 w-5" />
              <a
                href={task.url.startsWith("http") ? task.url : `https://${task.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-mono"
              >
                {task.url}
                <ExternalLink className="inline ml-2 h-4 w-4" />
              </a>
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Created {format(new Date(task.createdAt), "PPp")} • Updated{" "}
              {formatDistanceToNow(new Date(task.updatedAt), {
                addSuffix: true,
              })}
            </p>
          </div>

          <Badge className={status.className}>
            <StatusIcon
              className={`h-3 w-3 mr-1 ${status.iconClassName ?? ""}`}
            />
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1">
        <CardContent className="py-6 space-y-6">
          {/* Question */}
          <section>
            <h3 className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Question
            </h3>
            <p className="mt-2 p-4 rounded-lg bg-muted/30">
              {task.question}
            </p>
          </section>

          {/* Processing */}
          {(task.status === "queued" || task.status === "processing") && (
            <div className="flex gap-3 p-4 rounded-lg bg-primary/5">
              <StatusIcon
                className={`h-5 w-5 ${status.iconClassName ?? ""}`}
              />
              <p className="text-sm">
                Your task is being processed…
              </p>
            </div>
          )}

          {/* Error */}
          {task.status === "failed" && task.error_message && (
            <section>
              <h3 className="text-sm font-medium text-destructive flex gap-2">
                <XCircle className="h-4 w-4" />
                Error
              </h3>
              <p className="mt-2 p-4 rounded-lg bg-destructive/10">
                {task.error_message}
              </p>
            </section>
          )}

          {/* AI Answer */}
          {task.status === "done" && task.answer && (
            <section>
              <h3 className="text-sm font-medium flex gap-2">
                <Bot className="h-4 w-4" />
                AI Answer
              </h3>
              <div className="mt-2 p-4 rounded-lg bg-success/5">
                <p className="whitespace-pre-wrap">
                  {task.answer}
                </p>
              </div>
            </section>
          )}

          {/* Scraped Content */}
          {task.scraped_content && task.status === "done" && (
            <section>
              <h3 className="text-sm font-medium flex gap-2">
                <FileText className="h-4 w-4" />
                Scraped Content Preview
              </h3>
              <pre className="mt-2 p-4 text-xs rounded-lg bg-muted/20 max-h-48 overflow-hidden">
                {task.scraped_content.slice(0, 500)}...
              </pre>
            </section>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
