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
- **Visualization system:** not built yet. Planned: hand-rolled SVG (Phase 2).
- **Formulas:** KaTeX planned for Phase 2 (not installed yet).

```text
src/
├── main.tsx                  entry point; mounts <App/> inside <BrowserRouter>
├── app/
│   ├── App.tsx               route table (URL -> page)
│   └── Layout.tsx            shell: sidebar nav (built from the registry) + mobile drawer + <Outlet/>
├── pages/
│   ├── HomePage.tsx          landing page with slogan + category cards
│   └── TopicPage.tsx         ONE page that serves every topic (/topic/:topicId)
├── components/TopicTemplate/
│   ├── TopicTemplate.tsx     renders header + jump-nav + the 10 numbered sections from a TopicContent
│   └── sections.ts           the 10 section definitions (key + title); loop source for the template
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

## 4. Current phase

- **Phase 1 done.** Waiting for the owner's go-ahead for **Phase 2 (interactive mathematics engine: reusable graph, slider, formula components)**.
- Remaining before Phase 2: nothing.

## 5. Interactive components

None yet (Phase 2). Planned reusable set: InteractiveGraph, ParameterSlider, FormulaDisplay, FormulaVariableHighlight, ScatterPlot, DistributionPlot, DecisionBoundary, ConfusionMatrix, Heatmap, MetricCard, AnimationController, Timeline, VectorVisualizer, StepVisualizer.

## 6. Mathematical formulas

| Formula | Meaning | Variables | Where |
|---|---|---|---|
| mean = (x1 + ... + xn) / n | average value | xi = values, n = count; empty list returns NaN | `src/lib/math/stats.ts` |

## 7. Design system

- **Colors:** purple scale `--purple-50` (#f7f4ff) to `--purple-900` (#2e1c5c) in `src/styles/theme/tokens.css`. Components use only semantic tokens (`--color-bg`, `--color-surface`, `--color-text`, `--color-accent`, `--color-heading`, ...).
- **Typography:** system font stack (no web fonts yet); mono stack for code. Sizes `--text-sm` .. `--text-hero`.
- **Spacing:** `--space-1` (4px) .. `--space-12` (48px).
- **Cards:** white surface, 1px lavender border, `--radius-md`, soft purple shadow (`.card`). Badges: `.badge`.
- **Buttons:** `.button`, solid accent purple, darker on hover.
- **Motion:** `--duration-fast` 150ms, `--duration-normal` 300ms.
- **Focus:** visible 3px focus ring on all interactive elements.
- Graph styles: not defined yet.
- Dark mode: not implemented (Phase 19 candidate).

## 8. Future work

Phases 1-20 per the master blueprint: topic template, interactive math engine, Linear Regression, Gradient Descent, Statistics lab, Bayes, Classification, Evaluation, Decision Trees, K-Means, Hierarchical, DBSCAN, PCA, Neural Networks, Case studies, Learning path, "Explain this" mode, Exam mode, Design personalization, Final polish.
Backlog: choose graph tech (hand-rolled SVG vs library) in Phase 2; add KaTeX; dark mode.

## 9. Known bugs / unverified items

- Mobile layout and drawer were click-tested in an emulated 390px Edge viewport (14 checks passed). Not yet tried on a physical phone or in Safari/Firefox.
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

Concepts the owner asked to revisit: none yet.
