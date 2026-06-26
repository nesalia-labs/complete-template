import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/ui/avatar";

import type { Author } from "@/lib/blog/types";

/**
 * AuthorBadge — compact author display (avatar + name).
 * Used in post-meta and release-meta.
 *
 * @author.name and @author.avatar come from the authors collection
 * (content/authors/*.md). The avatar field is optional.
 */
export function AuthorBadge({
  author,
  size = "md",
}: {
  author: Author;
  size?: "sm" | "md";
}) {
  const fallback = author.name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const dim = size === "sm" ? "size-6" : "size-8";

  return (
    <span className="inline-flex items-center gap-2">
      <Avatar className={dim}>
        {author.avatar ? <AvatarImage src={author.avatar} alt={author.name} /> : null}
        <AvatarFallback className="text-[10px]">{fallback || author.name[0]}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-foreground/90">{author.name}</span>
    </span>
  );
}