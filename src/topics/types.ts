import type { ReactNode } from 'react'

/*
  The SHAPE of a topic's lesson. Every topic supplies an object like this and the
  TopicTemplate turns it into a page. ReactNode means "anything React can show":
  text, JSX, or (from Phase 2 on) an interactive component such as <RegressionPlayground />.

  A field marked `?` is optional. If a topic leaves it out, the template shows a
  "coming in a later phase" box instead of hiding the section.
*/
export interface TopicContent {
  /** 01 — What problem does this solve? (What? Why? When?) */
  problem: ReactNode
  /** 02 — Intuition: the idea in plain words, before any formula */
  intuition: ReactNode
  /** 03 — Interactive simulation */
  simulation?: ReactNode
  /** 04 — Mathematics: formulas and what every symbol means */
  mathematics?: ReactNode
  /** 05 — Move the parameters: controls and their effects */
  parameters?: ReactNode
  /** 06 — Watch the model change: the cause-and-effect chain */
  modelChange?: ReactNode
  /** 07 — Real-world example */
  realWorld?: ReactNode
  /** 08 — Common mistakes, one short sentence each */
  mistakes?: string[]
  /** 09 — Exam / interview facts, one short sentence each */
  examFacts?: string[]
  /** 10 — Related topics, as topic ids from the registry */
  related?: string[]
}
