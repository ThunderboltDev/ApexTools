"use client";

import {
  Bookmark02Icon,
  Fire03Icon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import type { Tool } from "@/lib/types";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="group relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-md transition-colors hover:bg-white/10 hover:border-primary/50">
        {tool.score > 80 && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-orange-500/20 px-2 py-0.5 text-xs font-medium text-orange-400 border border-orange-500/30">
            <HugeiconsIcon
              icon={Fire03Icon}
              className="h-3 w-3 animate-pulse"
            />
            <span>Hot</span>
          </div>
        )}

        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-black/20">
            <Image
              src={tool.logo}
              alt={tool.name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-1">
            <CardTitle className="text-lg font-bold text-white group-hover:text-primary transition-colors">
              {tool.name}
            </CardTitle>
            <div className="flex flex-wrap gap-1">
              {tool.tags?.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-white/5 text-xs text-muted-foreground hover:bg-white/10"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <CardDescription className="line-clamp-2 text-sm text-gray-400">
            {tool.description}
          </CardDescription>
        </CardContent>

        <CardFooter className="flex justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-white hover:bg-white/10"
          >
            <HugeiconsIcon icon={Bookmark02Icon} />
            Save
          </Button>
          <LinkButton
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="sm"
          >
            Visit <HugeiconsIcon icon={LinkSquare02Icon} />
          </LinkButton>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
