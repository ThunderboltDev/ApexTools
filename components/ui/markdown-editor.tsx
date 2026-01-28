"use client";

import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  label,
  placeholder = "Write your description using Markdown...",
  rows = 8,
  maxLength,
  disabled = false,
  invalid = false,
  className,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const handleTabChange = useCallback((tab: null | "write" | "preview") => {
    if (tab) setActiveTab(tab);
  }, []);

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="write" disabled={disabled}>
            Write
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={disabled}>
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="mt-3">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            aria-invalid={invalid}
          />
          {maxLength && (
            <div className="mt-1 text-xs text-muted-foreground text-right">
              {value.length} / {maxLength}
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="mt-3">
          <div
            className={cn(
              "prose prose-neutral dark:prose-invert max-w-none",
              "prose-headings:font-bold prose-headings:tracking-tight",
              "prose-h1:text-3xl prose-h1:font-extrabold prose-h1:lg:text-4xl prose-h1:mb-4 prose-h1:mt-8 prose-h1:first:mt-0",
              "prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-3",
              "prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2",
              "prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-2",
              "prose-p:leading-7 prose-p:text-muted-foreground prose-p:mb-4 last:prose-p:mb-0",
              "prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:my-6",
              "prose-ul:my-4 prose-ul:ml-4 prose-ul:list-disc [&>li]:mt-1",
              "prose-ol:my-4 prose-ol:ml-4 prose-ol:list-decimal [&>li]:mt-1",
              "prose-code:relative prose-code:rounded prose-code:bg-secondary prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono prose-code:text-sm prose-code:font-semibold",
              "prose-pre:p-4 prose-pre:rounded-lg prose-pre:bg-muted prose-pre:overflow-x-auto prose-pre:my-6",
              "prose-img:rounded-lg prose-img:border prose-img:my-6",
              "prose-hr:my-8 prose-hr:border-muted",
              "prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary/80"
            )}
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {value}
              </ReactMarkdown>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col justify-center items-center text-muted-foreground gap-2">
                <p className="text-sm">Nothing to preview yet.</p>
                <p className="text-xs">
                  Start writing in the Write tab to see your changes here.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
