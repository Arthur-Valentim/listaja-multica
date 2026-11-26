import { useState, type FormEvent } from 'react'
import './App.css'

type Task = {
  id: string
  title: string
  status: 'pending' | 'completed'
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
    } catch (error) {
      console.error('Erro ao carregar tarefas do localStorage:', error)
      return []
    }
  })
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editError, setEditError] = useState('')

  const saveTasks = (nextTasks: Task[]) => {
    setTasks(nextTasks)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks))
  }

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

    saveTasks(nextTasks)
    setTitle('')
    setError('')
  }

  const toggleTask = (taskId: string) => {
    const nextTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            status: task.status === 'completed' ? ('pending' as const) : ('completed' as const),
          }
        : task,
    )
    saveTasks(nextTasks)
  }

  const startEditing = (task: Task) => {
    setEditingId(task.id)
    setEditingTitle(task.title)
    setEditError('')
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingTitle('')
    setEditError('')
  }

  const saveEditing = (event: FormEvent<HTMLFormElement>, taskId: string) => {
    event.preventDefault()
    const trimmedTitle = editingTitle.trim()

    if (!trimmedTitle) {
      setEditError('Digite o título da tarefa.')
      return
    }

    const nextTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, title: trimmedTitle } : task,
    )
    saveTasks(nextTasks)
    cancelEditing()
  }

  const removeTask = (task: Task) => {
    if (!window.confirm(`Remover a tarefa "${task.title}"?`)) {
      return
    }

    const nextTasks = tasks.filter((item) => item.id !== task.id)
    saveTasks(nextTasks)

    if (editingId === task.id) {
      cancelEditing()
    }
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
            <li
              className={`task-item${task.status === 'completed' ? ' task-item--completed' : ''}`}
              key={task.id}
            >
              {editingId === task.id ? (
                <form
                  className="task-edit-form"
                  onSubmit={(event) => saveEditing(event, task.id)}
                >
                  <input
                    aria-label={`Editar tarefa ${task.title}`}
                    type="text"
                    value={editingTitle}
                    onChange={(event) => {
                      setEditingTitle(event.target.value)
                      if (editError) setEditError('')
                    }}
                    autoFocus
                  />
                  <div className="task-actions">
                    <button type="submit" className="task-action task-action--primary">
                      Salvar
                    </button>
                    <button type="button" className="task-action" onClick={cancelEditing}>
                      Cancelar
                    </button>
                  </div>
                  {editError && (
                    <p className="task-error" role="alert">
                      {editError}
                    </p>
                  )}
                </form>
              ) : (
                <>
                  <label className="task-content">
                    <input
                      className="task-checkbox"
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => toggleTask(task.id)}
                      aria-label={
                        task.status === 'completed'
                          ? `Marcar ${task.title} como pendente`
                          : `Concluir ${task.title}`
                      }
                    />
                    <span className="task-title">{task.title}</span>
                  </label>
                  <div className="task-actions">
                    <span
                      className={`task-status${task.status === 'completed' ? ' task-status--completed' : ''}`}
                    >
                      {task.status === 'completed' ? 'Concluída' : 'Pendente'}
                    </span>
                    <button
                      type="button"
                      className="task-action"
                      onClick={() => startEditing(task)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="task-action task-action--remove"
                      onClick={() => removeTask(task)}
                    >
                      Remover
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
