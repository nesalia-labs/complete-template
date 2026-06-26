import { Calendar, Clock } from "lucide-react";

import { Separator } from "@workspace/ui/components/ui/separator";

import type { Post } from "@/lib/blog/types";
import { AuthorBadge } from "./author-badge";
import { TagList } from "./tag-list";

/**
 * PostMeta — header strip for a post page.
 *
 * Layout: author badge | date · reading time | tags
 * Used above the MDX body in `blog/[slug]/page.tsx`.
 */
export function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <AuthorBadge author={post.author} />
        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" />
            <time dateTime={post.date}>{post.date}</time>
          </span>
          <Separator orientation="vertical" className="h-3" />
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {post.readingTime} min read
          </span>
        </div>
      </div>
      {post.tags.length > 0 ? (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Tags
          </span>
          <TagList tags={post.tags} />
        </div>
      ) : null}
    </div>
  );
}