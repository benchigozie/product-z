# Product Z — Intelligence Layer Design

Last updated: 2026-10-24
Supersedes: nothing (first formal design)

This document captures the design decisions made after implementing
POWER, WATER, and FLOODING categories. It defines the shape of the
intelligence layer as it will exist across all future categories,
and the work items that follow from these decisions.

The three implemented categories have proven that the pipeline
accommodates both availability-shaped categories (power, water) and
occurrence-shaped categories (flooding). The remaining design
questions concern cross-cutting concerns that affect all categories
equally: conclusion unification, confidence calibration, numerical
weighting, persistence, and the shape of analysis results.

---

## 1. Conclusion unification

### Decision

Define a shared `ConclusionState` enum used across all categories
for cross-category reasoning and persistence.

```ts
export enum ConclusionState {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    MIXED = 'MIXED',
    UNRESOLVED = 'UNRESOLVED',
}