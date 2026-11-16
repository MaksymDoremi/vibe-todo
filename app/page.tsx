import { BookOpen, Sparkles } from "lucide-react"
import { TodoBoard } from "./todo-board"

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Vibe Todo home">
          <span className="brand-mark" aria-hidden="true"><Sparkles /></span>
          <span>tiny<span className="brand-accent">builds</span></span>
        </a>
        <a className="topbar-link" href="#teacher-notes">
          <BookOpen aria-hidden="true" />
          <span>Teacher notes [toto je moje zmena, a abcdef]</span>
        </a>
      </header>

      <section className="hero" id="top" aria-labelledby="page-title">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> TODAY&apos;S MINI LESSON <span className="eyebrow-divider">/</span> CRUD
          </div>
          <h1 id="page-title">A little task.<br /><span>A lot of building.</span></h1>
          <p className="hero-description">Make a task, move it along, and see how four simple actions power the apps you use every day.</p>
          <div className="hero-note"><Sparkles aria-hidden="true" /><span>No setup. Just try things.</span></div>
        </div>
        <div className="hero-doodle" aria-hidden="true">
          <span className="doodle-sun" />
          <span className="doodle-card doodle-card-one"><i /><i /><i /></span>
          <span className="doodle-card doodle-card-two"><i /><i /></span>
          <span className="doodle-spark"><Sparkles /></span>
        </div>
      </section>

      <TodoBoard />

      <footer className="page-footer">
        <span>Made for curious minds and brave first clicks.</span>
        <a href="#top">Back to the board ↑</a>
      </footer>
    </main>
  )
}
