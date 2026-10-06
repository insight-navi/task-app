import { useEffect, useState } from 'react'
import { daysUntil, isDueSoon, toDateString } from './utils/date.js'
import { loadTasks, saveTasks } from './utils/storage.js'

function formatDue(dueDate, today) {
  const days = daysUntil(dueDate, today)
  if (days < 0) return `${-days}日超過`
  if (days === 0) return '今日まで'
  return `あと${days}日`
}

export default function App() {
  // 初回表示時に保存済みのタスクを読み込み、変更のたびに保存する
  const [tasks, setTasks] = useState(() => loadTasks())
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const today = toDateString(new Date())

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = (e) => {
    e.preventDefault()
    const text = title.trim()
    if (!text) return
    setTasks([
      ...tasks,
      { id: crypto.randomUUID(), title: text, dueDate, completed: false },
    ])
    setTitle('')
    setDueDate('')
  }

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const updateDueDate = (id, value) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, dueDate: value } : t)))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const remaining = tasks.filter((t) => !t.completed).length

  return (
    <main className="board">
      <h1>タスクボード</h1>

      <form className="add-form" onSubmit={addTask}>
        <input
          type="text"
          className="add-title"
          placeholder="新しいタスクを入力"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="タスク名"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="期限日"
        />
        <button type="submit" disabled={!title.trim()}>
          追加
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="empty">タスクはまだありません。</p>
      ) : (
        <>
          <p className="summary">
            未完了 {remaining} 件 / 全 {tasks.length} 件
          </p>
          <ul className="task-list">
            {tasks.map((task) => {
              const classes = ['task']
              if (task.completed) classes.push('completed')
              if (isDueSoon(task, today)) classes.push('due-soon')
              return (
                <li key={task.id} className={classes.join(' ')}>
                  <label className="task-main">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span className="task-title">{task.title}</span>
                  </label>
                  <div className="task-due">
                    <input
                      type="date"
                      value={task.dueDate}
                      onChange={(e) => updateDueDate(task.id, e.target.value)}
                      aria-label={`「${task.title}」の期限日`}
                    />
                    {task.dueDate && (
                      <span className="due-label">{formatDue(task.dueDate, today)}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="delete"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`「${task.title}」を削除`}
                  >
                    削除
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </main>
  )
}
