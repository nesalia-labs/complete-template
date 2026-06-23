---
name: reference-fresh-cli
description: fresh CLI — AI-powered web search and fetch tool (Exa.ai) available in the project environment
metadata:
  type: reference
---

Outil `fresh` disponible dans le terminal du projet. CLI de recherche/fetch web propulsée par Exa.ai.

**Sous-commandes :**
- `fresh auth` — gestion de l'authentification Exa.ai
- `fresh search [options]` — recherche web (Exa.ai)
- `fresh fetch [options] <url>` — fetch + extraction de contenu depuis une URL
- `fresh help [command]` — aide sur une sous-commande

**Quand utiliser `fresh` en priorité :**
- Recherche web ciblée (design, UI, tendances, competitors, articles)
- Récupération de contenu depuis une URL précise (docs, articles, design references)
- Benchmark de palettes de couleurs, typographies, composants

**Commandes clés :**
```bash
# Recherche web
fresh search -q "votre requête" -l 10 -t auto

# Fetch contenu depuis URL
fresh fetch https://example.com -p "prompt d'extraction"

# Status auth
fresh auth status
```

**Why:** Exa.ai (moteur de fresh) donne des résultats plus précis pour les requêtes design/tech spécifiques que les recherches génériques. L'outil est disponible directement dans le terminal — pas besoin de changer de contexte.

**How to apply:** Utiliser `fresh search` / `fresh fetch` comme **première option** pour toute recherche web ou extraction de contenu. Considérer WebSearch/WebFetch uniquement si fresh n'est pas disponible ou a échoué. Voir aussi [[tech-stack]] pour le contexte projet.