---
name: feedback-pierre-web-components-side-effect
description: Pierre Trees/Diffs custom elements register AUTOMATICALLY via transitive imports — no explicit web-components side-effect import needed
metadata:
  type: feedback
---

**Correction of earlier wrong entry.** When importing from `@pierre/trees/react` or `@pierre/diffs/react`, the `<file-tree-container>` and `<diffs-container>` custom elements register **automatically** via transitive side-effect imports. The explicit `import "@pierre/trees/web-components"` is **NOT needed** in React usage.

**The mechanism** (verified by reading `dist/` in node_modules):

For trees:
- `@pierre/trees/react` → `react/useFileTree.js`
- `react/useFileTree.js` → `import { FileTree } from "../render/FileTree.js"` (vanilla class)
- `render/FileTree.js` → `import { FileTreeContainerLoaded, prepareFileTreeShadowRoot } from "../components/web-components.js"`
- `components/web-components.js` → top-level `customElements.define(FILE_TREE_TAG_NAME, FileTreeContainer)`

For diffs:
- `@pierre/diffs/react` → `react/File.js` (React wrapper)
- `react/File.js` → `react/utils/useFileInstance.js`
- `react/utils/useFileInstance.js` → `import { File } from "../../components/File.js"` (vanilla class)
- `components/File.js` → `import { DiffsContainerLoaded } from "./web-components.js"`
- `components/web-components.js` → top-level `customElements.define(DIFFS_TAG_NAME, FileDiffContainer)`

**The earlier "memory" entry was wrong.** It said you need an explicit `import "@pierre/trees/web-components"`. That's only needed if you DON'T use the React or vanilla classes — e.g., SSR pre-render or another framework that just needs the custom element.

**When to use the explicit `./web-components` subpath:**
- SSR-only setups using `@pierre/trees/ssr` (server doesn't need the model classes)
- Non-React / non-vanilla usage (you want to use `<file-tree-container>` directly in another framework)
- See the trees README in node_modules: *"Import the web-components entry point only when you need the custom element registration side effect."*

**Diagnostic check for "nothing renders"**:
1. Open DevTools → Elements panel → look for `<file-tree-container>` or `<diffs-container>`
2. If the element has a `shadowroot` (open), registration worked — bug is elsewhere (height, layout, options)
3. If the element has NO shadow root → custom element not registered → missing transitive import → check the import chain

**Most likely actual bug sources** (when applying docs literally):
- `useFileTree` options not matching the actual API (e.g., `density: "compact"` may not be a valid value)
- `<File>` props not matching the API (e.g., `options.theme: "pierre-light"` may not exist)
- Wrong height container (see [[feedback-pierre-grid-layout]])
