import type { ComponentType } from 'react'
import WhatIsMachineLearning from './what-is-machine-learning/WhatIsMachineLearning'

/*
  Maps a topic id (from src/data/topics/topics.ts) to the component that shows its lesson.
  Topics missing from this map simply show the "coming soon" placeholder,
  so adding a new lesson = build the component + add one line here.
*/
export const topicComponents: Record<string, ComponentType> = {
  'what-is-machine-learning': WhatIsMachineLearning,
}
