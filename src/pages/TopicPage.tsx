import { Link, useParams } from 'react-router-dom'
import TopicTemplate from '../components/TopicTemplate/TopicTemplate'
import { getTopicById } from '../data/topics/topics'
import { topicContents } from '../topics'

/*
  One page component serves EVERY topic. useParams() reads the :topicId part of the URL,
  we look the topic up in the registry, then hand its content to the shared template.
*/
export default function TopicPage() {
  const { topicId } = useParams()
  const topic = topicId ? getTopicById(topicId) : undefined

  if (!topic) {
    return (
      <div className="page">
        <h1>Topic not found</h1>
        <p>We couldn't find that topic.</p>
        <Link to="/">Back to home</Link>
      </div>
    )
  }

  const content = topicContents[topic.id]

  if (!content) {
    return (
      <div className="page">
        <h1>{topic.title}</h1>
        <div className="card">
          <span className="badge">Coming soon</span>
          <p>{topic.summary}</p>
        </div>
      </div>
    )
  }

  return <TopicTemplate topic={topic} content={content} />
}
