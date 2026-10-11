/*
  Placeholder topic page. It exists to prove the plug-in system works:
  this component is registered in src/topics/index.ts, and TopicPage finds it by id.
  Real, interactive content arrives from Phase 1 onwards.
*/
export default function WhatIsMachineLearning() {
  return (
    <div className="stack">
      <p>
        Normally a programmer writes rules: <em>"if the email contains 'free money', mark it as spam."</em>
      </p>
      <p>
        In machine learning we flip this around. We show the computer thousands of example emails that are already
        labelled, and it <strong>learns the rules itself</strong> by finding patterns in the data.
      </p>
      <p>The interactive version of this lesson is coming in a later phase.</p>
    </div>
  )
}
