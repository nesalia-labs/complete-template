import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card";

import type { Post } from "@/lib/blog/types";
import { TagList } from "./tag-list";

/**
 * PostCard — grid cell on the blog index.
 *
 * The title is the link (clear focus target, accessibility-friendly). Tags
 * have their own links to /blog/tag/<tag>. The card itself is NOT wrapped in
 * a Link because that would nest <a> inside <a> (hydration error).
 *
 * For "click anywhere to navigate" UX, see shadcn/ui's pattern of an
 * absolutely-positioned overlay Link — we deliberately avoid that here for
 * accessibility (single focus target per card).
 */
export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="group h-full transition-colors hover:border-foreground/30 hover:bg-muted/30">
      <CardHeader>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" />
            <time dateTime={post.date}>{post.date}</time>
          </span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {post.readingTime} min read
          </span>
        </div>
        <CardTitle className="text-balance text-xl tracking-tight">
          <Link
            href={post.url}
            className="transition-colors hover:text-foreground"
          >
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3 text-pretty text-sm text-muted-foreground">
          {post.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            by{" "}
            <span className="font-medium text-foreground/80">
              {post.author.name}
            </span>
          </span>
          {post.tags.length > 0 ? <TagList tags={post.tags} size="sm" /> : null}
        </div>
      </CardContent>
    </Card>
  );
}