# 15. Blog (for the buyer's product)

> Fumadocs blog, MDX, SEO. Standard SaaS blog surface; nothing differentiated here, but it's a table-stakes feature for the marketing site.

| # | Feature | Status | Source | Note |
|---|---|---|---|---|
| 15.1 | MDX content | ✅ | C | Fumadocs blog |
| 15.2 | Categories / tags | ✅ | C | Standard taxonomy |
| 15.3 | Authors | ✅ | C | Per-post author with bio + avatar |
| 15.4 | Cover images | ✅ | C | R2, optimized |
| 15.5 | SEO (meta, OG, Twitter cards) | ✅ | C | Next.js metadata API |
| 15.6 | RSS / Atom feed | ✅ | C | Standard |
| 15.7 | Sitemap | ✅ | C | Includes posts and tags |
| 15.8 | Newsletter signup | ✅ | U | Buyer wires their own list (ConvertKit, Resend Audiences) |
| 15.9 | Related posts | 🟡 | U | Tag-based in v1; ML-based out of scope |
| 15.10 | Reading time | ✅ | C | Calculated from MDX |
| 15.11 | Series (multi-post) | 🟡 | U | v1 ships as tags; v2 ships first-class series |
| 15.12 | Drafts / scheduled posts | ✅ | C | Status field, visible to authors only |

**Notes:**
- Blog is intentionally table-stakes. The depth is in the docs and the product, not the blog.

## Cross-references

- Parent: [README.md](./README.md)
- Related: [14-documentation.md](./14-documentation.md) — shared MDX + Fumadocs
- Related: [05-mail.md](./05-mail.md) — newsletter signup delivery
- Related: [16-marketing-and-sales.md](./16-marketing-and-sales.md) — blog drives SEO for the marketing site
