# pb-feedback — Product Brain feedback loop

A **two-way channel** between this FunCode workspace and the **Product Brain product agents**. Those agents read this folder **daily**, process and prioritise what's here, then **report back** with guidance, instructions, fixes, and decisions.

> **This is not the Chain.** The Chain (`pb capture`) is FunCode's own SSOT — community, content, decisions. This folder is **feedback about Product Brain itself**: the `pb` CLI, its agents, governance UX, and the daily experience of building with it. Anything we like, dislike, wish worked better, or any idea that would delight the agents or Randy goes here.

## How it works

1. **We write** new items to [`feedback-log.md`](./feedback-log.md) (newest on top) using the schema below.
2. **Product Brain agents read daily** — they triage, prioritise, and either fix, answer, or route each item.
3. **They report back** in [`pb-reports.md`](./pb-reports.md): guidance, instructions, links to shipped changes or Chain entries.
4. We update each item's **Status** as it moves. When an item resolves into a durable lesson, capture it to the Chain (`INS`) and mark the item `answered`.

## Item schema (`feedback-log.md`)

Each item is one section:

```
## FB-007 — <short title>
- **Date:** YYYY-MM-DD
- **Type:** like | dislike | wish | idea | bug
- **For:** agent | human | both
- **Status:** new | triaged | in-progress | answered | wont-do
- **Priority:** — (set by Product Brain) low | medium | high
- **Context:** what we were doing when this came up
- **Detail:** the like / dislike / wish / idea, with evidence (command, expected vs actual)
- **PB response:** — (filled by Product Brain — link to pb-reports.md or a Chain ID)
```

## Conventions

- **IDs are sequential** (`FB-001`, `FB-002`, …) and never reused.
- **Be specific:** include the command, the surprising behaviour, and what you expected.
- **One item per concern** so each can be prioritised independently.
- **Write it as it happens** — don't batch and forget.
