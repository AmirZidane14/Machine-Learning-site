import { Link } from 'react-router-dom'
import FloatingShapes from '../components/FloatingShapes/FloatingShapes'
import { categories } from '../data/topics/topics'

export default function HomePage() {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero__text">
          <h1 className="hero__title">ML Explorer</h1>
          <p className="hero__slogan">Move the model, see the math.</p>
          <p>
            An interactive lab for learning machine learning. Instead of only reading formulas, you will drag points,
            turn sliders and watch the model change.
          </p>
          <Link className="button" to="/topic/what-is-machine-learning">
            Start learning
          </Link>
        </div>
        <FloatingShapes />
      </section>

      <h2>What you will explore</h2>
      <div className="card-grid">
        {categories.map((category) => (
          <div className="card" key={category.id}>
            <h3>{category.title}</h3>
            <p>{category.topics.length} topics</p>
          </div>
        ))}
      </div>
    </div>
  )
}
