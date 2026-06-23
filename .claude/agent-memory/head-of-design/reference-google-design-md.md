---
name: reference-google-design-md
description: Google Labs DESIGN.md — open standard format for specifying UI in a human-readable + AI-readable way (powers Google Stitch)
metadata:
  type: reference
---

**Google DESIGN.md** est un format de spec textuel standardisé pour décrire une UI. Open-sourcé par Google Labs (équipe Stitch). C'est un *contrat* lisible par les humains ET par les modèles d'IA qui sert d'input à la génération d'UI (notamment via [Stitch](https://stitch.withgoogle.com/)).

**Sources canoniques :**
- Repo officiel : https://github.com/google-labs-code/design.md
- Annonce : https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/
- Docs Stitch : https://stitch.withgoogle.com/docs/design-md/overview/
- PHILOSOPHY.md : https://github.com/google-labs-code/design.md/blob/main/PHILOSOPHY.md
- Synthèse DeepWiki : https://deepwiki.com/google-labs-code/design.md/2-the-design.md-format
- Vulgarisation TypeUI : https://www.typeui.sh/design-md

**How to apply :**
- Quand l'utilisateur veut formaliser une spec UI (composants, layout, états, interactions), proposer DESIGN.md comme format par défaut — c'est output-agnostic (compatible avec n'importe quel stack d'implémentation, dont Tailwind + shadcn de notre projet).
- Quand on travaille avec des outils IA de génération d'UI (Stitch, mais aussi v0, Bolt, etc.), savoir que DESIGN.md est un format de référence qui peut servir de contrat d'entrée.
- Si l'utilisateur évoque "design doc", "UI spec", "design brief" sans format précis, mentionner l'existence de ce standard open plutôt que de réinventer un template.
- Voir [[tech-stack]] pour le contexte stack (Tailwind v4 + shadcn/ui) avec lequel DESIGN.md s'intègre naturellement.