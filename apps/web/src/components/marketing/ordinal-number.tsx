/**
 * OrdinalNumber — small mono "01" / "02" / "03" marker for
 * enumerated list items.
 *
 * Inspired by Linear's "FIG 0.1" section labels
 * ([[reference-linear-home-css]]) but quieter — we don't need
 * the "FIG" prefix because we're already inside a section.
 *
 * Visual rules:
 *   - `font-mono` + `tabular-nums` so all ordinals line up
 *     vertically when stacked
 *   - `text-muted-foreground` so it sits behind the title
 *   - `text-sm` so it's noticeable but doesn't compete with the title
 *
 * Usage:
 *   <OrdinalNumber value="01" />
 *   <h3>Title of the first item</h3>
 */
export function OrdinalNumber({ value }: { value: string }) {
  return (
    <span className="font-mono text-sm font-medium tabular-nums text-muted-foreground">
      {value}
    </span>
  )
}
