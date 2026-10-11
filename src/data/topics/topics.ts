/*
  TOPIC REGISTRY — the list of everything ML Explorer will teach.

  The sidebar, the router and the topic pages all read from this one list.
  To add a new topic: add a line here, then (when its page is built) register
  its component in src/topics/index.ts. Nothing else needs to change.
*/

/** 'available' = built and clickable. 'coming-soon' = planned, shown greyed out. */
export type TopicStatus = 'available' | 'coming-soon'

export interface Topic {
  id: string // used in the URL: /topic/<id>
  title: string
  summary: string
  status: TopicStatus
}

export interface Category {
  id: string
  title: string
  topics: Topic[]
}

/** "Bayes' Theorem" -> "bayes-theorem" (so every title gets a URL-safe id). */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Small helper so the list below stays easy to read. */
function topic(title: string, options: { id?: string; status?: TopicStatus; summary?: string } = {}): Topic {
  return {
    id: options.id ?? slugify(title),
    title,
    status: options.status ?? 'coming-soon',
    summary: options.summary ?? 'This topic is planned and will be built in a later phase.',
  }
}

export const categories: Category[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    topics: [
      topic('What is Machine Learning?', {
        status: 'available',
        summary: 'The big idea: computers learning patterns from data instead of following hand-written rules.',
      }),
      topic('Data & Features'),
      topic('Vectors'),
      topic('Functions'),
      topic('Basic Mathematics'),
    ],
  },
  {
    id: 'statistics-probability',
    title: 'Statistics & Probability',
    topics: [
      topic('Mean'),
      topic('Median'),
      topic('Variance'),
      topic('Standard Deviation'),
      topic('Probability'),
      topic('Probability Distributions'),
      topic('Conditional Probability'),
      topic("Bayes' Theorem"),
      topic('Covariance'),
      topic('Correlation'),
    ],
  },
  {
    id: 'supervised-learning',
    title: 'Supervised Learning',
    topics: [
      topic('Linear Regression'),
      topic('Multiple Regression'),
      topic('Logistic Regression'),
      topic('KNN'),
      topic('Decision Trees'),
      topic('Random Forest'),
      topic('Naive Bayes'),
    ],
  },
  {
    id: 'optimization',
    title: 'Optimization',
    topics: [
      topic('Loss Functions'),
      topic('Gradient Descent'),
      topic('Learning Rate'),
      topic('Local / Global Minimum'),
      topic('Regularization'),
    ],
  },
  {
    id: 'unsupervised-learning',
    title: 'Unsupervised Learning',
    topics: [
      topic('K-Means'),
      topic('Hierarchical Clustering'),
      topic('DBSCAN'),
      topic('PCA'),
      topic('Gaussian Mixture Models'),
    ],
  },
  {
    id: 'model-evaluation',
    title: 'Model Evaluation',
    topics: [
      topic('Confusion Matrix'),
      topic('Accuracy'),
      topic('Precision'),
      topic('Recall'),
      topic('F1'),
      topic('ROC'),
      topic('Precision-Recall'),
      topic('Cross Validation'),
    ],
  },
  {
    id: 'neural-networks',
    title: 'Neural Networks',
    topics: [
      topic('Perceptron'),
      topic('Activation Functions'),
      topic('Forward Propagation'),
      topic('Loss', { id: 'nn-loss' }),
      topic('Backpropagation'),
      // Same title as the Optimization topic, so it needs its own id.
      topic('Gradient Descent', { id: 'nn-gradient-descent' }),
    ],
  },
  {
    id: 'case-studies',
    title: 'Real-World Case Studies',
    topics: [
      topic('Spam Detection'),
      topic('House Prices'),
      topic('Medical Diagnosis'),
      topic('Recommendation Systems'),
      topic('Fraud Detection'),
      topic('Image Classification'),
    ],
  },
]

/** Every topic in a flat list. */
export const allTopics: Topic[] = categories.flatMap((category) => category.topics)

/** Look a topic up by its URL id. Returns undefined if there is no such topic. */
export function getTopicById(id: string): Topic | undefined {
  return allTopics.find((t) => t.id === id)
}
