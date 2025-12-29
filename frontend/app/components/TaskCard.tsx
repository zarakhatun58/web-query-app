"use client";

import { Task } from "../lib/api";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Globe,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink, LucideIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TaskCardProps {
  task: Task;
  isSelected?: boolean;
  onClick?: () => void;
  
}
type StatusConfig = {
  label: string;
  icon: LucideIcon;
  className: string;
  iconClassName?: string; 
};

const statusConfig: Record<string, StatusConfig> = {
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

export function TaskCard({ task, isSelected, onClick }: TaskCardProps) {
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 hover:border-primary/50 ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border/50 bg-card/80 hover:bg-card"
      }`}
    >
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-muted-foreground min-w-0">
            <Globe className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-mono truncate">
              {formatUrl(task.url)}
            </span>
            <a
              href={task.url.startsWith("http") ? task.url : `https://${task.url}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hover:text-primary"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <Badge className={`${status.className} flex-shrink-0`}>
            <StatusIcon
              className={`h-3 w-3 mr-1 ${status.iconClassName || ""}`}
            />
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4 px-4">
        <div className="flex items-start gap-2 mb-3">
          <MessageSquare className="h-4 w-4 text-primary mt-0.5" />
          <p className="text-sm line-clamp-2">{task.question}</p>
        </div>

        {task.status === "done" && task.answer && (
          <div className="mt-3 p-3 bg-muted/30 rounded-md border">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.answer}
            </p>
          </div>
        )}

        {task.status === "failed" && task.error_message && (
          <div className="mt-3 p-3 bg-destructive/10 rounded-md border border-destructive/30">
            <p className="text-sm text-destructive line-clamp-2">
              {task.error_message}
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-3">
          {formatDistanceToNow(new Date(task.createdAt), {
            addSuffix: true,
          })}
        </p>
      </CardContent>
    </Card>
  );
}
