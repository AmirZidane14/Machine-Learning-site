import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { categories } from '../data/topics/topics'

/*
  The app shell: sidebar navigation + the area where the current page appears (<Outlet />).
  The sidebar is built by looping over the topic registry, so it never needs manual edits.
*/
export default function Layout() {
  // State: remembers whether the mobile drawer is open. Changing it redraws this component.
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  // Effect: while the menu is open, listen for the Escape key. The returned function is the
  // "cleanup": React runs it when the menu closes, so we never leave listeners behind.
  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="topbar__menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="sidebar"
        >
          ☰ Menu
        </button>
        <span>ML Explorer</span>
      </header>

      {/* Backdrop: dim layer behind the open drawer. Tapping outside the menu closes it. */}
      {menuOpen && <div className="backdrop" onClick={closeMenu} aria-hidden="true" />}

      <nav id="sidebar" className={`sidebar ${menuOpen ? 'sidebar--open' : ''}`} aria-label="Topics">
        <button className="sidebar__close" onClick={closeMenu}>
          ✕ Close
        </button>
        <Link className="sidebar__brand" to="/" onClick={closeMenu}>
          ML Explorer
        </Link>
        {categories.map((category) => (
          <section key={category.id}>
            <h2 className="sidebar__category">{category.title}</h2>
            {category.topics.map((topic) => (
              <NavLink
                key={topic.id}
                to={`/topic/${topic.id}`}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''} ${topic.status === 'coming-soon' ? 'nav-link--soon' : ''}`
                }
                onClick={closeMenu}
              >
                {topic.title}
                {topic.status === 'coming-soon' && <span className="badge">soon</span>}
              </NavLink>
            ))}
          </section>
        ))}
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
