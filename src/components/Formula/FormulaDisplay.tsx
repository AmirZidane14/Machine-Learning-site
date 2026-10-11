import katex from 'katex'
import 'katex/dist/katex.min.css'
import { useEffect, useMemo, useRef } from 'react'

interface FormulaDisplayProps {
  /**
   * LaTeX for the formula. To make a symbol highlightable, wrap it:
   *   \htmlData{var=w}{w}      -> the "w" gets data-var="w"
   */
  tex: string
  /** Name of the variable to light up (matches the `var=` in the LaTeX), or undefined for none. */
  activeVariable?: string
  /** Plain-English reading of the formula, announced by screen readers. */
  ariaLabel?: string
}

/*
  Typesets a formula with KaTeX and can highlight one variable.

  Highlighting: KaTeX gives us an HTML string. After React puts it on the page, an effect
  walks the elements marked data-var and switches a CSS class on the matching one.
  The colors live in formula.css, not here.
*/
export default function FormulaDisplay({ tex, activeVariable, ariaLabel }: FormulaDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // useMemo: only re-run KaTeX when the LaTeX text changes, not on every redraw.
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: true,
        throwOnError: false, // a typo shows red text instead of crashing the page
        trust: (context) => context.command === '\\htmlData', // allow ONLY the command we need
        // \htmlData is a KaTeX extension (not plain LaTeX) and we use it on purpose, so silence
        // that one warning; every other strictness warning stays on.
        strict: (errorCode) => (errorCode === 'htmlExtension' ? 'ignore' : 'warn'),
      }),
    [tex],
  )

  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    root.querySelectorAll<HTMLElement>('[data-var]').forEach((el) => {
      el.classList.toggle('formula-var--active', el.dataset.var === activeVariable)
    })
  }, [html, activeVariable])

  return (
    <div
      ref={containerRef}
      className="formula"
      role={ariaLabel ? 'math' : undefined}
      aria-label={ariaLabel}
      // Safe here: the HTML is produced by KaTeX from OUR OWN formula strings, never from user input.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
