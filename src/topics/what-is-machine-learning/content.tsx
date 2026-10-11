import type { TopicContent } from '../types'

/*
  Lesson content for "What is Machine Learning?". Notice there is no layout code here:
  this file only says WHAT to teach. TopicTemplate decides how it looks.
  Sections 03, 05 and 06 are left out on purpose: the interactive parts arrive in later phases,
  and the template shows a placeholder for them.
*/
const content: TopicContent = {
  problem: (
    <>
      <p>
        Some problems are too messy to solve with hand-written rules. Try writing exact rules for "is this email spam?"
        or "what will this house sell for?": there are too many cases, and spammers change tactics all the time.
      </p>
      <p>
        <strong>Machine learning (ML)</strong> solves this by letting the computer <em>learn the rules from examples</em>{' '}
        instead of being told them. The term was popularised by Arthur Samuel in 1959, who taught a program to improve
        at checkers by playing it.
      </p>
    </>
  ),
  intuition: (
    <>
      <p>
        Think of teaching a child to recognise dogs. You don't hand over a rulebook; you point at many dogs and say
        "dog". After enough examples, the child spots new dogs they have never seen.
      </p>
      <p>
        ML works the same way: <strong>data in, pattern learned, predictions out.</strong> Then we check how good the
        predictions are on examples the model hasn't seen.
      </p>
    </>
  ),
  realWorld: (
    <>
      <p>
        <strong>Spam filter:</strong> show the model thousands of emails labelled "spam" or "not spam". It learns which
        words and patterns go with spam, then sorts your new mail automatically.
      </p>
      <p>
        <strong>House prices:</strong> show it past sales (size, bedrooms, location, price). It learns how those
        features relate to price and can estimate the price of a house that hasn't sold yet.
      </p>
    </>
  ),
  mistakes: [
    'Thinking ML is magic: a model can only find patterns that exist in its data.',
    'Assuming more data always helps: wrong or biased data teaches wrong or biased lessons.',
    'Judging a model only on the examples it learned from instead of on new, unseen ones.',
  ],
  examFacts: [
    'Machine learning = algorithms that improve at a task by learning patterns from data.',
    'Supervised learning uses labelled examples (inputs with known answers); unsupervised learning finds structure in unlabelled data.',
    'Training data is what the model learns from; test data is held back to check how well it generalises.',
  ],
  related: ['data-features', 'linear-regression', 'logistic-regression'],
}

export default content
