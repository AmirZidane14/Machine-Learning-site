import type { TopicContent } from '../../topics/types'

/*
  The 10 sections every topic page has, in order. The template loops over this list,
  so renaming, reordering or adding a section is a change in this one file.
  `key` must match a field of TopicContent (TypeScript enforces that).
*/
export interface SectionDefinition {
  key: keyof TopicContent
  title: string
}

export const sections: SectionDefinition[] = [
  { key: 'problem', title: 'What problem does this solve?' },
  { key: 'intuition', title: 'Intuition' },
  { key: 'simulation', title: 'Interactive simulation' },
  { key: 'mathematics', title: 'Mathematics' },
  { key: 'parameters', title: 'Move the parameters' },
  { key: 'modelChange', title: 'Watch the model change' },
  { key: 'realWorld', title: 'Real-world example' },
  { key: 'mistakes', title: 'Common mistakes' },
  { key: 'examFacts', title: 'Exam / interview facts' },
  { key: 'related', title: 'Related topics' },
]

/** "01", "02", ... for display. */
export function sectionNumber(index: number): string {
  return String(index + 1).padStart(2, '0')
}
