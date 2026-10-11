import type { TopicContent } from './types'
import whatIsMachineLearning from './what-is-machine-learning/content'

/*
  Maps a topic id (from src/data/topics/topics.ts) to its lesson content.
  Topics missing from this map show the "coming soon" card, so adding a new lesson =
  write its content file + add one line here + set its status to 'available' in topics.ts.
*/
export const topicContents: Record<string, TopicContent> = {
  'what-is-machine-learning': whatIsMachineLearning,
}
