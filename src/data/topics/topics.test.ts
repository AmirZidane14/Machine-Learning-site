import { describe, expect, it } from 'vitest'
import { sections } from '../../components/TopicTemplate/sections'
import { topicContents } from '../../topics'
import { allTopics, getTopicById, slugify } from './topics'

describe('topic registry', () => {
  it('has a unique id for every topic (ids are used in URLs)', () => {
    const ids = allTopics.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('slugify makes URL-safe ids', () => {
    expect(slugify("Bayes' Theorem")).toBe('bayes-theorem')
    expect(slugify('Local / Global Minimum')).toBe('local-global-minimum')
  })

  it('every available topic has lesson content, and every lesson is registered as a topic', () => {
    const available = allTopics.filter((t) => t.status === 'available').map((t) => t.id)
    expect(Object.keys(topicContents).sort()).toEqual(available.sort())
  })

  it('every "related" link in a lesson points at a real topic', () => {
    for (const content of Object.values(topicContents)) {
      for (const id of content.related ?? []) {
        expect(getTopicById(id), `unknown related topic id: ${id}`).toBeDefined()
      }
    }
  })
})

describe('topic template sections', () => {
  it('defines the 10 sections from the blueprint, each with a unique key', () => {
    expect(sections).toHaveLength(10)
    expect(new Set(sections.map((s) => s.key)).size).toBe(10)
  })
})
