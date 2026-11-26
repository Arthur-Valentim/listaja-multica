import { useState, type FormEvent } from 'react'
import './App.css'

type Task = {
  id: string
  title: string
  status: 'pending'
}

const STORAGE_KEY = 'listaja.tasks'

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY)

    if (!savedTasks) {
      return []
    }

    try {
      return JSON.parse(savedTasks) as Task[]
    } catch {
      return []
    }
  })
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setError('Digite o título da tarefa.')
      return
    }

    const nextTasks = [
      ...tasks,
      {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        status: 'pending' as const,
      },
    ]

    setTasks(nextTasks)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks))
    setTitle('')
    setError('')
  }

  return (
    <main className="todo-app">
      <h1>ListaJá</h1>

      <form className="task-form" onSubmit={addTask}>
        <label htmlFor="task-title">Nova tarefa</label>
        <div className="task-form__controls">
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              if (error) setError('')
            }}
            placeholder="O que você precisa fazer?"
          />
          <button type="submit">Adicionar</button>
        </div>
        {error && (
          <p className="task-error" role="alert">
            {error}
          </p>
        )}
      </form>

      {tasks.length === 0 ? (
        <p className="empty-state">Nenhuma tarefa adicionada.</p>
      ) : (
        <ul className="task-list" aria-label="Lista de tarefas">
          {tasks.map((task) => (
            <li className="task-item" key={task.id}>
              <span>{task.title}</span>
              <span className="task-status">Pendente</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
