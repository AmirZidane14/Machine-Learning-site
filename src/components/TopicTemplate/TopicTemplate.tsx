import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { getTopicById, type Topic } from '../../data/topics/topics'
import type { TopicContent } from '../../topics/types'
import { sectionNumber, sections } from './sections'

interface TopicTemplateProps {
  topic: Topic // from the registry: title + summary
  content: TopicContent // the lesson itself
}

/*
  Turns (topic + content) into a full lesson page:
    header -> "jump to section" links -> the 10 numbered sections.
  Props are the inputs a parent passes in, like arguments to a function.
*/
export default function TopicTemplate({ topic, content }: TopicTemplateProps) {
  return (
    <article className="page topic">
      <header className="topic__header">
        <h1>{topic.title}</h1>
        <p className="topic__summary">{topic.summary}</p>
      </header>

      <nav className="topic__nav" aria-label="Sections on this page">
        {sections.map((section, index) => (
          <a key={section.key} href={`#section-${section.key}`}>
            {sectionNumber(index)} {section.title}
          </a>
        ))}
      </nav>

      {sections.map((section, index) => (
        <section key={section.key} id={`section-${section.key}`} className="topic-section">
          <h2 className="topic-section__title">
            <span className="topic-section__number">{sectionNumber(index)}</span>
            {section.title}
          </h2>
          {renderBody(section.key, content)}
        </section>
      ))}
    </article>
  )
}

/** Decides how each kind of section is shown. Empty sections get a placeholder box. */
function renderBody(key: keyof TopicContent, content: TopicContent): ReactNode {
  switch (key) {
    case 'mistakes':
    case 'examFacts': {
      const items = content[key]
      if (!items || items.length === 0) return <Placeholder />
      return (
        <ul className="topic-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    }
    case 'related': {
      // Keep only ids that exist in the registry, so a typo can't create a dead link.
      const topics = (content.related ?? []).map(getTopicById).filter((t): t is Topic => t !== undefined)
      if (topics.length === 0) return <Placeholder />
      return (
        <ul className="topic-list">
          {topics.map((t) => (
            <li key={t.id}>
              <Link to={`/topic/${t.id}`}>{t.title}</Link>
            </li>
          ))}
        </ul>
      )
    }
    default:
      // Remaining keys all hold ReactNode content (text or JSX).
      return content[key] ?? <Placeholder />
  }
}

function Placeholder() {
  return <p className="topic-placeholder">Coming in a later phase.</p>
}
