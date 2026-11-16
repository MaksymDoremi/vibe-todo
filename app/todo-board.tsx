"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Check, ClipboardList, Plus, Pencil, Trash2, X } from "lucide-react"
import { CrudLesson } from "./crud-lesson"

type TaskStatus = "todo" | "in-progress" | "done"
type TodoTask = { id: string; title: string; body: string; status: TaskStatus }
type TaskDraft = Pick<TodoTask, "title" | "body" | "status">
type CrudAction = "create" | "read" | "update" | "delete"

const STORAGE_KEY = "vibe-todo-tasks-v1"
const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Up next",
  "in-progress": "In progress",
  done: "Done",
}
const COLUMNS: TaskStatus[] = ["todo", "in-progress", "done"]
const STARTER_TASKS: TodoTask[] = [
  { id: "starter-idea", title: "Sketch a tiny app", body: "Start with a title, a short description, and one small thing you want your app to do.", status: "todo" },
  { id: "starter-crud", title: "Name the four CRUD moves", body: "Create, Read, Update, Delete. Say them out loud, then spot where they show up on this board.", status: "in-progress" },
  { id: "starter-ship", title: "Ship your first change", body: "Edit this card or move it to Done. You just changed real app data.", status: "done" },
]

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function isTodoTask(value: unknown): value is TodoTask {
  if (!value || typeof value !== "object") return false
  const task = value as Record<string, unknown>
  return typeof task.id === "string" && typeof task.title === "string" &&
    typeof task.body === "string" && COLUMNS.includes(task.status as TaskStatus)
}

function getNextStatus(status: TaskStatus): TaskStatus {
  const next: Record<TaskStatus, TaskStatus> = { todo: "in-progress", "in-progress": "done", done: "todo" }
  return next[status]
}

export function TodoBoard() {
  const [tasks, setTasks] = useState<TodoTask[]>([])
  const [ready, setReady] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TodoTask | null>(null)
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null)
  const [lessonNotice, setLessonNotice] = useState("")
  const [storageWarning, setStorageWarning] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === null) {
        setTasks(STARTER_TASKS)
      } else {
        const parsed: unknown = JSON.parse(saved)
        setTasks(Array.isArray(parsed) ? parsed.filter(isTodoTask) : STARTER_TASKS)
      }
    } catch {
      setTasks(STARTER_TASKS)
      setStorageWarning(true)
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      setStorageWarning(true)
    }
  }, [ready, tasks])

  useEffect(() => {
    if (highlightedTaskId) {
      document.getElementById(`task-${highlightedTaskId}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [highlightedTaskId])

  const completedCount = useMemo(() => tasks.filter((task) => task.status === "done").length, [tasks])

  function saveTask(draft: TaskDraft) {
    const title = draft.title.trim()
    const body = draft.body.trim()
    if (!title) return

    if (editingTask) {
      setTasks((current) => current.map((task) => task.id === editingTask.id
        ? { ...task, title, body, status: draft.status }
        : task))
      setLessonNotice("Updated! Your changes are saved on this device.")
    } else {
      const task = { ...draft, title, body, id: makeId() }
      setTasks((current) => [task, ...current])
      setLessonNotice("Created! Your new task is on the board.")
    }
    setFormOpen(false)
    setEditingTask(null)
  }

  function openNewTask() {
    setEditingTask(null)
    setFormOpen(true)
  }

  function openEditTask(task: TodoTask) {
    setEditingTask(task)
    setFormOpen(true)
  }

  function deleteTask(task: TodoTask) {
    setTasks((current) => current.filter((item) => item.id !== task.id))
    if (highlightedTaskId === task.id) setHighlightedTaskId(null)
    setLessonNotice(`Deleted “${task.title}” from the board.`)
  }

  function changeStatus(taskId: string, status: TaskStatus) {
    setTasks((current) => current.map((task) => task.id === taskId ? { ...task, status } : task))
    setLessonNotice("Progress updated. That is an UPDATE operation.")
  }

  function tryCrud(action: CrudAction) {
    if (action === "create") {
      const task: TodoTask = {
        id: makeId(), title: "Try the CREATE button", body: "A new task was added by the lesson demo. Edit me or move me along!", status: "todo",
      }
      setTasks((current) => [task, ...current])
      setHighlightedTaskId(task.id)
      setLessonNotice("CREATE ran — a fresh task just appeared in Up next.")
      return
    }

    const exampleTask = tasks[0]
    if (!exampleTask) {
      setLessonNotice("The board is empty. Try CREATE first, then run this example again.")
      return
    }

    if (action === "read") {
      setHighlightedTaskId(exampleTask.id)
      setLessonNotice(`READ ran — take a look at “${exampleTask.title}” on the board.`)
    } else if (action === "update") {
      const nextStatus = getNextStatus(exampleTask.status)
      setTasks((current) => current.map((task) => task.id === exampleTask.id ? { ...task, status: nextStatus } : task))
      setHighlightedTaskId(exampleTask.id)
      setLessonNotice(`UPDATE ran — “${exampleTask.title}” moved to ${STATUS_LABELS[nextStatus]}.`)
    } else {
      setTasks((current) => current.filter((task) => task.id !== exampleTask.id))
      if (highlightedTaskId === exampleTask.id) setHighlightedTaskId(null)
      setLessonNotice(`DELETE ran — “${exampleTask.title}” was removed.`)
    }
  }

  return (
    <>
      <section className="board-section" aria-labelledby="board-title" aria-busy={!ready}>
        <div className="section-heading board-heading">
          <div>
            <div className="section-kicker"><ClipboardList aria-hidden="true" /> YOUR WORKBENCH</div>
            <h2 id="board-title">The task board<span className="heading-period">.</span></h2>
            <p className="section-subtitle">Every card is yours to change. Go on, give it a try.</p>
          </div>
          <button className="button-primary" type="button" onClick={openNewTask}>
            <Plus aria-hidden="true" /> New task
          </button>
        </div>

        <div className="board-stats" aria-label={`${tasks.length} tasks, ${completedCount} completed`}>
          <span><strong>{ready ? String(tasks.length).padStart(2, "0") : "—"}</strong> little tasks</span>
          <span className="stats-divider" aria-hidden="true" />
          <span><strong>{ready ? String(completedCount).padStart(2, "0") : "—"}</strong> all done</span>
          <span className="storage-label"><span className="storage-dot" /> SAVED IN THIS BROWSER</span>
        </div>

        {lessonNotice && <p className="board-notice" role="status">{lessonNotice}</p>}
        {storageWarning && <p className="storage-warning" role="status">Browser storage isn&apos;t available right now. Your tasks are still here until you leave this page.</p>}

        <div className="kanban-board">
          {COLUMNS.map((status, index) => {
            const columnTasks = tasks.filter((task) => task.status === status)
            return (
              <section className="kanban-column" data-status={status} key={status} aria-labelledby={`column-${status}`}>
                <header className="column-heading">
                  <span className="column-name"><span className="column-indicator" /> <h3 id={`column-${status}`}>{STATUS_LABELS[status]}</h3></span>
                  <span className="column-count" aria-label={`${columnTasks.length} tasks`}>{String(columnTasks.length).padStart(2, "0")}</span>
                </header>
                <div className="column-tasks">
                  {columnTasks.map((task) => (
                    <article className={`task-card${highlightedTaskId === task.id ? " is-highlighted" : ""}`} id={`task-${task.id}`} key={task.id}>
                      <div className="task-card-top">
                        <span className="task-label">{status === "done" ? "NICE WORK" : status === "todo" ? "ON THE LIST" : "IN THE MIX"}</span>
                        <span className="task-actions">
                          <button className="icon-button" type="button" onClick={() => openEditTask(task)} aria-label={`Edit task: ${task.title}`} title="Edit task"><Pencil aria-hidden="true" /></button>
                          <button className="icon-button delete-button" type="button" onClick={() => deleteTask(task)} aria-label={`Delete task: ${task.title}`} title="Delete task"><Trash2 aria-hidden="true" /></button>
                        </span>
                      </div>
                      <h4>{task.title}</h4>
                      <p className="task-body">{task.body}</p>
                      <div className="task-card-bottom">
                        <span className="task-status"><span className="status-check">{status === "done" ? <Check aria-hidden="true" /> : <span />}</span>{STATUS_LABELS[status]}</span>
                        <label className="sr-only" htmlFor={`progress-${task.id}`}>Progress for {task.title}</label>
                        <select id={`progress-${task.id}`} className="status-select" value={task.status} onChange={(event) => changeStatus(task.id, event.target.value as TaskStatus)}>
                          {COLUMNS.map((option) => <option key={option} value={option}>{STATUS_LABELS[option]}</option>)}
                        </select>
                      </div>
                    </article>
                  ))}
                  {columnTasks.length === 0 && <p className="column-empty">Nothing here yet. Move a task in or add a new one.</p>}
                </div>
                {index === 0 && <button className="column-add" type="button" onClick={openNewTask}><Plus aria-hidden="true" /> Add a task</button>}
              </section>
            )
          })}
        </div>
        <p className="board-footnote"><ArrowRight aria-hidden="true" /> Tip: use the little progress menu on a card to move it across the board.</p>
      </section>

      <CrudLesson onTry={tryCrud} />

      {formOpen && <TaskFormDialog task={editingTask} onClose={() => { setFormOpen(false); setEditingTask(null) }} onSave={saveTask} />}
    </>
  )
}

function TaskFormDialog({ task, onClose, onSave }: {
  task: TodoTask | null
  onClose: () => void
  onSave: (draft: TaskDraft) => void
}) {
  const [title, setTitle] = useState(task?.title ?? "")
  const [body, setBody] = useState(task?.body ?? "")
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "todo")

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [onClose])

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="task-dialog" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
        <div className="dialog-heading">
          <div>
            <span className="section-kicker">A LITTLE BIT OF {task ? "EDITING" : "CREATING"}</span>
            <h2 id="task-form-title">{task ? "Make it yours." : "What are you making?"}</h2>
          </div>
          <button className="icon-button dialog-close" type="button" onClick={onClose} aria-label="Close task form"><X aria-hidden="true" /></button>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); onSave({ title, body, status }) }}>
          <label className="form-field"><span>Task title</span><input autoFocus required maxLength={80} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Make the best todo app" /></label>
          <label className="form-field"><span>A few details <em>optional</em></span><textarea maxLength={220} rows={3} value={body} onChange={(event) => setBody(event.target.value)} placeholder="What is this task all about?" /></label>
          <label className="form-field"><span>Progress</span><select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>{COLUMNS.map((option) => <option key={option} value={option}>{STATUS_LABELS[option]}</option>)}</select></label>
          <div className="dialog-actions">
            <button className="button-quiet" type="button" onClick={onClose}>Never mind</button>
            <button className="button-primary" type="submit"><Check aria-hidden="true" /> {task ? "Save changes" : "Add to the board"}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
