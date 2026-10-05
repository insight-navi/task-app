import { useEffect, useState } from "react";

const STORAGE_KEY = "task-app.tasks";

// 保存済みのタスクを読み込む（読み込めない場合は空で始める）
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [text, setText] = useState("");

  // タスクが変わるたびにブラウザへ保存する
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // 保存できない環境では何もしない
    }
  }, [tasks]);

  function addTask(event) {
    event.preventDefault();
    const title = text.trim();
    if (!title) return;
    setTasks([...tasks, { id: crypto.randomUUID(), title, done: false }]);
    setText("");
  }

  function toggleTask(id) {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  const doneCount = tasks.filter((task) => task.done).length;

  return (
    <main className="board">
      <h1>タスクボード</h1>

      <form className="add-form" onSubmit={addTask}>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="新しいタスクを入力"
          aria-label="新しいタスク"
        />
        <button type="submit" disabled={!text.trim()}>
          追加
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="empty">タスクはまだありません</p>
      ) : (
        <>
          <p className="summary">
            {tasks.length}件中 {doneCount}件完了
          </p>
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={task.done ? "task done" : "task"}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span>{task.title}</span>
                </label>
                <button
                  type="button"
                  className="delete"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`「${task.title}」を削除`}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
