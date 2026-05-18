# viz-ard

Interactive blog-style explainers for statistics and AI topics. The index groups articles into Regression and LLM Systems, and each article uses an interaction that matches the concept being taught.

Regression posts:
- Gaussian Regression
- Logistic Regression
- Poisson Regression
- Ridge Regression
- Quantile Regression

LLM posts:
- LLM Basics
- Attention
- GRPO
- RAG
- Mamba / State Space Models

Each post is a static HTML page with a short explanation, rendered formulas, and a topic-specific interactive section.

## Quick Start

Open `index.html` directly in a browser, or run the Vite dev server:

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Files

- `index.html` - blog index
- `gaussian.html` - Gaussian regression article
- `logistic.html` - Logistic regression article
- `poisson.html` - Poisson regression article
- `ridge.html` - Ridge regression article
- `quantile.html` - Quantile regression article
- `llm.html` - LLM basics article
- `attention.html` - Attention article
- `grpo.html` - GRPO article
- `rag.html` - RAG article
- `mamba.html` - Mamba and state-space models article
- `assets/css/main.css` - shared layout and visual styling
- `assets/js/*.js` - interactive demos and shared utilities
