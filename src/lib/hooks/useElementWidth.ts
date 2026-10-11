import { useEffect, useRef, useState } from 'react'

/*
  A custom hook: a reusable function that bundles React features (state + effect).

  Attach the returned `ref` to an element and `width` always holds that element's current
  width in pixels, updating whenever the element is resized (window resized, phone rotated...).
  `fallback` is used for the very first draw, before the element has been measured.
*/
export function useElementWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(fallback)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    // ResizeObserver is a browser feature that calls us whenever the element's size changes.
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    observer.observe(element)
    return () => observer.disconnect() // cleanup when the component disappears
  }, [])

  return { ref, width }
}
