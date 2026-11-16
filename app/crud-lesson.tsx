import { ArrowUpRight, BookOpen, Code2, Play } from "lucide-react"

type CrudAction = "create" | "read" | "update" | "delete"

const LESSONS: {
  letter: string
  verb: string
  summary: string
  method: string
  route: string
  color: string
  code: string
  action: CrudAction
}[] = [
  {
    letter: "C", verb: "Create", summary: "Make something new and add it to your app.",
    method: "POST", route: "/tasks", color: "create",
    code: 'const next = [...tasks, newTask]\nlocalStorage.setItem("vibe-todo-tasks-v1", JSON.stringify(next))', action: "create",
  },
  {
    letter: "R", verb: "Read", summary: "Get the saved stuff and show it on screen.",
    method: "GET", route: "/tasks", color: "read",
    code: 'const tasks = JSON.parse(\n  localStorage.getItem("vibe-todo-tasks-v1") ?? "[]"\n)', action: "read",
  },
  {
    letter: "U", verb: "Update", summary: "Change something that already exists.",
    method: "PATCH", route: "/tasks/:id", color: "update",
    code: 'const next = tasks.map((task) =>\n  task.id === id ? { ...task, status: "done" } : task\n)', action: "update",
  },
  {
    letter: "D", verb: "Delete", summary: "Remove something you no longer need.",
    method: "DELETE", route: "/tasks/:id", color: "delete",
    code: 'const next = tasks.filter((task) => task.id !== id)\nlocalStorage.setItem("vibe-todo-tasks-v1", JSON.stringify(next))', action: "delete",
  },
]

export function CrudLesson({ onTry }: { onTry?: (action: CrudAction) => void }) {
  return (
    <section className="lesson-section" id="teacher-notes" aria-labelledby="lesson-title">
      <div className="lesson-intro">
        <div className="lesson-intro-copy">
          <div className="section-kicker"><BookOpen aria-hidden="true" /> THE TEACHER BIT</div>
          <h2 id="lesson-title">Four letters.<br /><span>Most of the internet.</span></h2>
        </div>
        <p>CRUD is a simple way to describe what an app does with information: it creates it, reads it, updates it, or deletes it. You&apos;ve already got all four moves in the board above.</p>
      </div>

      <div className="crud-grid">
        {LESSONS.map((lesson) => (
          <article className="crud-card" data-action={lesson.color} key={lesson.letter}>
            <div className="crud-card-heading">
              <span className="crud-letter" aria-hidden="true">{lesson.letter}</span>
              <div><span className="crud-method">{lesson.method}</span><span className="crud-route">{lesson.route}</span></div>
            </div>
            <h3>{lesson.verb}</h3>
            <p>{lesson.summary}</p>
            <div className="code-sample">
              <div className="code-label"><Code2 aria-hidden="true" /> THE IDEA</div>
              <pre><code>{lesson.code}</code></pre>
            </div>
            {onTry && <button className="try-button" type="button" onClick={() => onTry(lesson.action)}><Play aria-hidden="true" /> Try {lesson.verb.toLowerCase()} on the board</button>}
          </article>
        ))}
      </div>

      <div className="lesson-takeaway">
        <span className="takeaway-icon"><BookOpen aria-hidden="true" /></span>
        <div><strong>A helpful teacher note</strong><p>Those POST / GET / PATCH / DELETE labels are the HTTP versions you&apos;ll see in API tools like Swagger. This beginner demo has no server: the buttons perform the same CRUD ideas in your browser and keep the board in local storage.</p></div>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank" rel="noreferrer">Learn about local storage <ArrowUpRight aria-hidden="true" /></a>
      </div>
    </section>
  )
}
