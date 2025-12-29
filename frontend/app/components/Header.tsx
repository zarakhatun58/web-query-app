"use client"
import { Bot, Sparkles } from "lucide-react";

export function Header() {
  return (
  <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="h-8 w-8 text-teal-400" />
            <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              Website Q&A
              <span className="text-xs font-normal text-teal-400 bg-muted px-2 py-0.5 rounded-full">
                AI-Powered
              </span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Ask questions about any website content
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
