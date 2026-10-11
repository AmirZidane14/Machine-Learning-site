# ML Explorer — Project Context

Persistent memory for this project. Read this first in every new session. Update it after every completed phase.

## 1. Project vision

**ML Explorer** is an interactive machine-learning laboratory for beginners. Instead of reading formulas, the learner drags points, turns sliders and watches the model and its metrics change, then reads *why*.

- **Slogan: "Move the model, see the math."** (The original blueprint said "See the math. Move the model."; the owner changed it. See Important decisions.)
- **Audience:** a beginner who knows very little ML. Every symbol should eventually be explained.
- **Problem solved:** textbooks show formulas; learners can't feel them. Here every concept is manipulable, visual, and tied to a real-world example.
- **Learning loop:** Concept -> Intuition -> Interaction -> Mathematics -> Visual consequence -> Real-world example -> Exam understanding.
- **Principle:** depth over breadth. A few excellent interactive topics beat many shallow ones.

## 2. Current architecture

- **Stack:** Vite + React 19 + TypeScript, React Router (`react-router-dom`), plain CSS with CSS variables, Vitest for tests, oxlint for linting. Client-only (no backend); all math runs in the browser.
- **State management:** React local state (`useState`) only, for now.
- **Visualization system:** hand-rolled SVG (decided Phase 2). `InteractiveGraph` draws axes and passes scales to its children via a render prop; `ScatterPlot` adds draggable points. The graph measures its container (`useElementWidth`) and draws at real pixel size so text stays readable on phones.
- **Formulas:** KaTeX (`katex` 0.19) via `FormulaDisplay`. Highlightable symbols use `\htmlData{var=w}{w}`; only that one command is trusted.
- **Data flow pattern:** the parent owns the state (points, w, b); children are "controlled": they receive values + `onChange`. Derived values (predictions, MSE) are recomputed each render, never stored.

```text
src/
├── main.tsx                  entry point; mounts <App/> inside <BrowserRouter>
├── app/
│   ├── App.tsx               route table (URL -> page)
│   └── Layout.tsx            shell: sidebar nav (built from the registry) + mobile drawer + <Outlet/>
├── pages/
│   ├── HomePage.tsx          landing page with slogan + category cards
│   └── TopicPage.tsx         ONE page that serves every topic (/topic/:topicId)
├── components/
│   ├── TopicTemplate/        TopicTemplate.tsx (header + jump-nav + 10 sections), sections.ts (the 10 definitions)
│   ├── Graph/                InteractiveGraph.tsx (axes, scales, clipping, toData), ScatterPlot.tsx (draggable points)
│   ├── Slider/               ParameterSlider.tsx (labelled, controlled, hover/focus highlight callback)
│   ├── Formula/              FormulaDisplay.tsx (KaTeX + variable highlighting)
│   └── MetricCard/           MetricCard.tsx (one live number)
├── components/FloatingShapes/   FloatingShapes.tsx (hero decoration: drift + dodge/wobble), shapes.ts (shape data)
├── pages/ComponentLabPage.tsx   /lab: developer test bench wiring all components together (not a lesson)
├── lib/
│   ├── graph/scale.ts        linearScale (+invert), ticks, clamp (pure, tested)
│   ├── motion/dodge.ts       dodgeOffset: pointer + shape position -> push vector (pure, tested)
│   ├── hooks/useElementWidth.ts   custom hook: measures an element with ResizeObserver
│   └── format.ts             formatNumber (NaN/Infinity -> "—")
├── data/topics/
│   ├── topics.ts             TOPIC REGISTRY: categories -> topics (id, title, summary, status)
│   └── topics.test.ts        registry + template-structure tests
├── topics/
│   ├── types.ts              TopicContent: the shape of one lesson (10 fields)
│   ├── index.ts              maps topic id -> TopicContent
│   └── what-is-machine-learning/content.tsx   first real lesson (data only, no layout code)
├── lib/math/
│   ├── stats.ts              pure math (currently just mean)
│   └── stats.test.ts         unit tests
└── styles/
    ├── global.css            reset, base elements, .button
    ├── theme/tokens.css      ALL colors/fonts/spacing/shadows/motion as CSS variables
    └── components/           layout.css, card.css, topic.css
```

Empty folders from the blueprint (`components/Graph`, `Slider`, etc.) are intentionally **not** created yet; they are added in Phase 2 when there is something to put in them.

**How a topic plugs in:** (1) add it to `topics.ts` and set `status: 'available'` (sidebar + URL appear automatically); (2) write `src/topics/<id>/content.tsx` exporting a `TopicContent`; (3) register it in `src/topics/index.ts`. `TopicPage` hands the content to `TopicTemplate`. Topics without content show a "Coming soon" card. A test enforces that "available" topics and registered lessons match.

**Template rules:** all 10 sections always render. A field a lesson omits shows a "Coming in a later phase" placeholder. `mistakes` / `examFacts` are string arrays (bulleted); `related` is a list of topic ids (links; unknown ids are dropped, and a test fails on them). Everything else is `ReactNode`, so from Phase 2 a section can hold an interactive component.

## 3. Completed phases

### Phase 0 — Foundation & architecture (complete, pending owner review)
- Scaffolded Vite React-TS in the project root; removed starter demo files.
- Theme tokens (purple/lavender), global styles, card/badge/button base styles.
- App shell: responsive sidebar (drawer under 800px), Home page, generic TopicPage, 404 fallback.
- Topic registry covering the **entire target topic tree** (8 categories, 52 topics); only "What is Machine Learning?" is `available` (placeholder text).
- Vitest + first math function (`mean`) with 3 tests.
- Decisions: see section 10. Files: everything under `src/`, config files, this file.
- **Follow-up fix (owner-reported):** the open mobile drawer covered the Menu button, so it could only be dismissed by tapping a link. Added a "Close" button inside the drawer, a tap-to-close backdrop (`--color-backdrop` token), and Escape-key closing via `useEffect`. Files: `Layout.tsx`, `layout.css`, `tokens.css`. z-index order: topbar 10 < backdrop 15 < sidebar 20.

### Phase 1 — Learning experience / topic template (complete)
- `TopicContent` type + `TopicTemplate` component render the blueprint's 10 sections: What problem does this solve? / Intuition / Interactive simulation / Mathematics / Move the parameters / Watch the model change / Real-world example / Common mistakes / Exam-interview facts / Related topics.
- Numbered section cards, a "jump to section" chip bar (in-page anchors), and `scroll-margin-top` so anchor targets clear the sticky mobile top bar.
- Replaced the Phase 0 placeholder component with `what-is-machine-learning/content.tsx` (real text for sections 01, 02, 07, 08, 09, 10; 03-06 are placeholders until interactive components exist).
- `topics/index.ts` now maps id -> `TopicContent` (was id -> component). `TopicPage` uses the template.
- 5 new tests (registry id uniqueness, slugify, available-topics <-> lessons match, related ids valid, 10 unique sections). 8 tests total.
- Not yet covered: the blueprint's What/Why/When/How/Math/Intuition/Tradeoffs "quick answers" idea. Section 01 currently carries what/why/when in prose. Decide in a later phase whether it needs its own component.

### Phase 2 — Interactive mathematics engine (core set, complete)
- Owner chose: hand-written SVG, KaTeX, and the **core component set** only (not all ~17 blueprint components).
- Built: `InteractiveGraph`, `ScatterPlot` (drag with mouse/touch/arrow keys, clamped to the axes), `ParameterSlider`, `FormulaDisplay` (symbol highlighting), `MetricCard`; pure `linearScale`/`ticks`/`clamp`; `mse`; `formatNumber`; `useElementWidth`.
- `/lab` page proves them together: drag dots or move w/b, the line, formula highlight and MSE all update.
- Responsive fix found in testing: a fixed-size SVG scaled down made phone axis text ~6px. Graph now draws at container width (min 260, max 760, height = 0.62 x width).
- Lint-driven design change: `toData(element, clientX, clientY)` finds the parent `<svg>` from the dragged element, so no ref is read during render.
- Tests: 20 unit tests. Browser (emulated Edge via DevTools protocol): 19 checks incl. hand-calculated MSE for two (w,b) settings, line pixel position vs scale math, mouse + touch drag, keyboard nudge, clamping, hover highlight, no console warnings.
- Not built (deferred until a topic needs them): DistributionPlot, DecisionBoundary, ConfusionMatrix, Heatmap, VectorVisualizer, AnimationController, Timeline, StepVisualizer, DataPoint/PredictionLine/ResidualLine as separate components (Phase 3 will decide whether residuals are an overlay or a component).

### Owner-requested UI addition (between Phase 2 and Phase 3): hero floating shapes
- Owner feedback: "the UI feels bland and has no movement." Chose: shapes on the **Home hero only**, behavior **drift gently, then dodge/wobble on hover** (not draggable, not cursor-following).
- `FloatingShapes` (8 shapes: circle, ring, triangle, square, plus) sits beside the hero text (stacked below it under 800px). Shape list is pure data in `shapes.ts`.
- Each shape = 4 nested layers so transforms don't fight: `.shape` (position) > `.shape__dodge` (JS-set `--dx/--dy` + springy transition) > `.shape__drift` (CSS keyframes) > `.shape__body` (visual + wobble when `.shape--near`).
- Dodge math is a pure tested function: `lib/motion/dodge.ts` (`dodgeOffset`; radius 130px, max push 70px, linear falloff).
- JS writes CSS variables directly (not React state) because pointer-move fires dozens of times per second.
- Accessibility: field is `aria-hidden`; `prefers-reduced-motion` disables drift, wobble, and dodge.
- Touch: `pointerleave` fires the instant a finger lifts, so only mouse resets on leave; touch shapes settle via a 700ms timer. (Found by a failing browser test.)
- Tokens added: `--color-shape-1..4`, `--duration-slow`, `--ease-spring`.
- Tests: 6 new unit tests (26 total); 17 browser checks (drift, dodge direction/magnitude, far shape unaffected, settle-back, reduced motion, layout/no overlap/button not blocked, touch tap, no console warnings).
- Revisit in Phase 19 (design personalization): more motion elsewhere (card hover lift, page transitions) was NOT added; only the hero got movement.

## 4. Current phase

- **Phase 2 done.** Waiting for the owner's go-ahead for **Phase 3 (Linear Regression, the first flagship interactive lesson)**.
- Remaining before Phase 3: nothing.

## 5. Interactive components

**Built (Phase 2):**
| Component | Props (main) | Notes |
|---|---|---|
| `InteractiveGraph` | `xDomain`, `yDomain`, `xLabel`, `yLabel`, `ariaLabel`, `children(ctx)` | ctx = `{xScale, yScale, toData, innerWidth, innerHeight}`; clips children to the plot area |
| `ScatterPlot` | `points`, `onPointsChange?`, domains, labels, `overlay?(ctx)` | draggable only if `onPointsChange` given; `role="slider"` + arrow keys |
| `ParameterSlider` | `label`, `value`, `min`, `max`, `step`, `onChange`, `onHighlightChange?` | controlled; highlight fires on hover/focus |
| `FormulaDisplay` | `tex`, `activeVariable?`, `ariaLabel?` | wrap symbols as `\htmlData{var=w}{w}` |
| `MetricCard` | `label`, `value`, `hint?`, `digits?` | shows "—" for NaN |

**Planned, not built:** DistributionPlot, DecisionBoundary, ConfusionMatrix, Heatmap, AnimationController, Timeline, VectorVisualizer, StepVisualizer, residual/prediction-line helpers.

## 6. Mathematical formulas

| Formula | Meaning | Variables | Where |
|---|---|---|---|
| mean = (x1 + ... + xn) / n | average value | xi = values, n = count; empty list returns NaN | `src/lib/math/stats.ts` |
| MSE = (1/n) * sum((y - yhat)^2) | average squared prediction error | y = actual, yhat = predicted, n = count; NaN for empty or mismatched lengths | `src/lib/math/stats.ts` (used by `/lab`) |
| yhat = w*x + b | straight-line prediction | w = slope, b = intercept | `ComponentLabPage.tsx` (full lesson in Phase 3) |
| pixel = r0 + (v - d0)/(d1 - d0) * (r1 - r0) | linear scale: data value to screen position | domain [d0,d1], range [r0,r1]; inverse for dragging | `src/lib/graph/scale.ts` |

## 7. Design system

- **Colors:** purple scale `--purple-50` (#f7f4ff) to `--purple-900` (#2e1c5c) in `src/styles/theme/tokens.css`. Components use only semantic tokens (`--color-bg`, `--color-surface`, `--color-text`, `--color-accent`, `--color-heading`, ...).
- **Typography:** system font stack (no web fonts yet); mono stack for code. Sizes `--text-sm` .. `--text-hero`.
- **Spacing:** `--space-1` (4px) .. `--space-12` (48px).
- **Cards:** white surface, 1px lavender border, `--radius-md`, soft purple shadow (`.card`). Badges: `.badge`.
- **Buttons:** `.button`, solid accent purple, darker on hover.
- **Motion:** `--duration-fast` 150ms, `--duration-normal` 300ms, `--duration-slow` 700ms, `--ease-spring` (overshoots then settles). All animation must respect `prefers-reduced-motion`.
- **Decorative shapes:** `--color-shape-1..4` (lavender, mid purple, pale lavender, soft pink). Shapes are decoration only: `aria-hidden`, never block text or buttons.
- **Focus:** visible 3px focus ring on all interactive elements.
- **Graphs:** tokens `--color-graph-bg/grid/axis/text/point/line/highlight` in `tokens.css`; styles in `styles/components/graph.css`. Points purple, the line lighter purple, and pink (`--color-graph-highlight`) marks "the thing being explained" (highlighted line, active formula symbol). Axis text 13px, line 3px, dot radius 7 (hit area 18 for fingers).
- **Controls:** sliders use native `<input type="range">` with `accent-color`; metric cards use `--color-surface-soft`; styles in `controls.css`.
- Dark mode: not implemented (Phase 19 candidate).

## 8. Future work

Phases 1-20 per the master blueprint: topic template, interactive math engine, Linear Regression, Gradient Descent, Statistics lab, Bayes, Classification, Evaluation, Decision Trees, K-Means, Hierarchical, DBSCAN, PCA, Neural Networks, Case studies, Learning path, "Explain this" mode, Exam mode, Design personalization, Final polish.
Backlog: choose graph tech (hand-rolled SVG vs library) in Phase 2; add KaTeX; dark mode.

## 9. Known bugs / unverified items

- Mobile layout and drawer were click-tested in an emulated 390px Edge viewport (14 checks passed). Not yet tried on a physical phone or in Safari/Firefox.
- **Unexplained one-off:** a single `npm run test` run (right after editing `FloatingShapes.tsx`, with the dev server up) reported all 4 test files as failed with `TypeError: Cannot read properties of undefined (reading 'config')` thrown inside Vitest. Re-running (with and without the dev server) passed 26/26 each time, and it did not recur. Cause not identified; if it reappears, note the exact sequence.
- Shape motion can only be judged by eye; automated checks verify the mechanics (positions, classes, reset), not whether it *feels* good. Tune `DODGE_RADIUS` / `MAX_PUSH` in `FloatingShapes.tsx` and the keyframes in `shapes.css`.
- Browser tests (drag, touch, keyboard, hover) live in throwaway scripts outside the repo, so they are not re-run automatically. Consider adding Playwright or a component-test setup before the final polish phase.
- Graph minimum width is 260px; narrower containers would overflow. Not an issue on common phones (>=320px).
- The anchor-vs-sticky-header offset (`scroll-margin-top: 5rem`) could not be proven in tests because the current lesson page is short (the browser can't scroll the target to the top). Re-check once lessons are longer.
- Sidebar has no scroll-position memory and is long (52 entries); consider collapsible categories later.

## 10. Important decisions

- **Slogan changed** to "Move the model, see the math." per the owner.
- **Start fresh, React + Vite + TypeScript:** the "existing prototype" in the blueprint was not available; owner chose a rebuild. React gives reusable components; TypeScript catches mistakes early.
- **Single TopicPage + registry:** one route serves all topics from data, so adding a topic never touches the router or sidebar.
- **CSS variables for all styling:** so a full restyle (Phase 19) means editing `tokens.css`, not hunting through components.
- **Math in `src/lib/math`, UI-free:** pure functions are testable and reusable by every topic.
- **Two different topics share a title** ("Gradient Descent" in Optimization and Neural Networks), so the NN ones get explicit ids (`nn-gradient-descent`, `nn-loss`).
- **No AI attribution / co-author** anywhere in the repo or commits (owner's absolute rule). Commits use the owner's configured git identity.
- **Lessons are data, not pages (Phase 1):** a lesson is a typed `TopicContent` object; layout lives only in `TopicTemplate`. Why: every topic looks consistent, restyling touches one component, and content authors never write layout. Alternative rejected: one hand-built page component per topic (would duplicate structure 50 times).
- **Fixed 10 sections, optional content:** the structure is always visible even when a lesson is incomplete, so progress is easy to see.
- **Hand-written SVG over a charting library (Phase 2):** dragging points, residual lines and decision boundaries need full control, and writing it teaches the owner how interactive graphs work. Trade-off: more code per chart type.
- **Core component set only (Phase 2):** build other components when a topic needs them, so their design is driven by real use.
- **Render prop for graph content:** `InteractiveGraph` takes a function child so any topic can draw anything on shared axes/scales.
- **Lab page `/lab`:** a permanent developer test bench so components can be exercised outside lessons. Visible in the sidebar under "Developer"; revisit whether to hide it in the final polish phase.
- **Graph draws at real pixel size, not a scaled viewBox:** keeps text readable on phones.
- **Phase-by-phase workflow:** stop after each phase, report, ask before the next.

## Programming Concepts Learned

Status key: *introduced* = explained by Claude; *understood* = owner confirmed or demonstrated. Nothing is marked understood yet.

### Phase 0
| Concept | Short explanation | Where | Status |
|---|---|---|---|
| Component | A function that returns a piece of UI | every `.tsx` file | introduced |
| JSX | HTML-looking syntax inside JavaScript | `.tsx` files | introduced |
| State (`useState`) | Memory a component keeps; changing it redraws the component | `Layout.tsx` (drawer open/closed) | introduced |
| Props / URL params | Inputs to a component; `useParams` reads the URL | `TopicPage.tsx` | introduced |
| Routing | Mapping URLs to pages without reloading | `App.tsx`, `Layout.tsx` (`Outlet`, `NavLink`) | introduced |
| Data-driven UI (`.map`) | Build many elements by looping over a list | `Layout.tsx`, `HomePage.tsx` | introduced |
| TypeScript types/interfaces | Describe the shape of data so mistakes are caught early | `topics.ts` | introduced |
| Modules (`import`/`export`) | Splitting code across files | all files | introduced |
| CSS variables | Named values reused everywhere; change once, update all | `tokens.css` | introduced |
| Pure functions & unit tests | Same input -> same output; tests check it automatically | `stats.ts`, `stats.test.ts` | introduced |
| Responsive CSS (media query) | Different layout below a width | `layout.css` (800px) | introduced |
| `useEffect` + cleanup | Runs code after the screen draws; the returned function undoes it (here: add/remove the Escape-key listener) | `Layout.tsx` | introduced |
| Conditional rendering | `{menuOpen && <div/>}` only creates the element when the condition is true | `Layout.tsx` (backdrop) | introduced |
| Stacking order (`z-index`) | Higher number draws on top; a layer can hide controls beneath it | `layout.css` | introduced |

### Phase 1
| Concept | Short explanation | Where | Status |
|---|---|---|---|
| Props | Inputs a parent passes to a component, like function arguments | `TopicTemplate.tsx` (`topic`, `content`) | introduced |
| TypeScript `interface` as a contract | Declares what fields an object must have; optional fields use `?` | `topics/types.ts` | introduced |
| `ReactNode` | Type meaning "anything React can display" (text, JSX, components) | `types.ts` | introduced |
| Data-driven rendering, again | Loop over a list of definitions instead of writing 10 sections by hand | `sections.ts`, `TopicTemplate.tsx` | introduced |
| `switch` + type narrowing | Different handling per key; TypeScript knows each branch's type | `renderBody` in `TopicTemplate.tsx` | introduced |
| JSX fragments (`<>...</>`) | Group elements without adding an extra HTML tag | `content.tsx` | introduced |
| `key` prop in lists | Lets React tell list items apart when redrawing | `TopicTemplate.tsx` | introduced |
| In-page anchors | `href="#id"` jumps to the element with that id | `TopicTemplate.tsx`, `topic.css` | introduced |
| Tests that guard data | Tests that check the registry (unique ids, valid links), not just math | `topics.test.ts` | introduced |

### Phase 2
| Concept | Short explanation | Where | Status |
|---|---|---|---|
| Scales (data <-> pixels) | A function turning a data value into a screen position, plus its inverse for mouse input | `lib/graph/scale.ts` | introduced |
| Render props | Passing a *function* as a child so the receiver calls it with data | `InteractiveGraph.tsx` `children(ctx)` | introduced |
| Controlled components | Child stores nothing; parent passes `value` + `onChange` (single source of truth) | `ParameterSlider.tsx`, `ScatterPlot.tsx` | introduced |
| Derived state | Compute values (predictions, MSE) from state each render instead of storing them | `ComponentLabPage.tsx` | introduced |
| Pointer events + pointer capture | One event model for mouse/touch/pen; capture keeps events flowing while dragging | `ScatterPlot.tsx` | introduced |
| SVG coordinate system | Y grows downward; `viewBox`; `transform=translate`; clipPath | `InteractiveGraph.tsx` | introduced |
| Custom hook | A reusable function bundling `useState` + `useEffect` | `lib/hooks/useElementWidth.ts` | introduced |
| `useMemo` | Cache a computed value until its inputs change | `FormulaDisplay.tsx` | introduced |
| `useRef` | A handle to a real DOM element (read in effects/handlers, not during render) | `FormulaDisplay.tsx`, `useElementWidth.ts` | introduced |
| `dangerouslySetInnerHTML` | Insert raw HTML; safe only for trusted, self-generated content | `FormulaDisplay.tsx` | introduced |
| Accessibility basics | `aria-label`, `role="slider"`, keyboard arrows, visible focus | `ScatterPlot.tsx`, `ParameterSlider.tsx` | introduced |
| Testing in a real browser | Driving Edge via DevTools protocol to click/drag; verifying against hand-calculated numbers | scratch scripts (not in repo) | introduced |

### Floating shapes (hero)
| Concept | Short explanation | Where | Status |
|---|---|---|---|
| Layered transforms | Two animations can't share one `transform`, so each gets its own nested element | `FloatingShapes.tsx`, `shapes.css` | introduced |
| CSS keyframe animation | `@keyframes` + `animation` for endless motion with no JS | `shapes.css` (`shape-drift`, `shape-wobble`) | introduced |
| CSS custom properties as a JS-to-CSS channel | JS sets `--dx`; CSS reads it with `var()` and animates the change | `FloatingShapes.tsx`, `shapes.css` | introduced |
| Refs for direct DOM updates | Skip React state for high-frequency events; mutate the element's style directly | `FloatingShapes.tsx` (`shapeRefs`) | introduced |
| Easing curves (`cubic-bezier`) | Shapes the feel of motion; values >1 overshoot for a bouncy settle | `tokens.css` (`--ease-spring`) | introduced |
| `prefers-reduced-motion` | Honor the OS setting by turning animation off | `shapes.css`, `FloatingShapes.tsx` | introduced |
| Mouse vs touch pointer behavior | `pointerType`; touch fires `pointerleave` on lift, mouse has hover | `FloatingShapes.tsx` | introduced |
| Pure function for "feel" math | Isolating tunable math makes it testable without a browser | `lib/motion/dodge.ts` | introduced |

Concepts the owner asked to revisit: none yet.
