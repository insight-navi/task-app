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

// 今日の日付を "YYYY-MM-DD" 形式で返す（端末のタイムゾーン基準）
function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// 期限の状態を判定する（完了済み・期限なしは対象外）
function getDueStatus(task, today) {
  if (task.done || !task.due) return "none";
  if (task.due < today) return "overdue";
  if (task.due === today) return "today";
  return "upcoming";
}

// "YYYY-MM-DD" を "M/D" 形式で表示する
function formatDue(due) {
  const [, month, day] = due.split("-");
  return `${Number(month)}/${Number(day)}`;
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [text, setText] = useState("");
  const [due, setDue] = useState("");

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
    setTasks([...tasks, { id: crypto.randomUUID(), title, done: false, due }]);
    setText("");
    setDue("");
  }

  function toggleTask(id) {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  function changeDue(id, newDue) {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, due: newDue } : task)));
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  const today = getToday();
  const doneCount = tasks.filter((task) => task.done).length;
  const overdueCount = tasks.filter((task) => getDueStatus(task, today) === "overdue").length;

  return (
    <main className="board">
      <h1>タスクボード</h1>

      <form className="add-form" onSubmit={addTask}>
        <input
          type="text"
          className="add-title"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="新しいタスクを入力"
          aria-label="新しいタスク"
        />
        <input
          type="date"
          className="add-due"
          value={due}
          onChange={(event) => setDue(event.target.value)}
          aria-label="期限（任意）"
          title="期限（任意）"
        />
        <button type="submit" disabled={!text.trim()}>
          追加
        </button>
      </form>

      {overdueCount > 0 && (
        <p className="alert" role="alert">
          ⚠ 期限切れのタスクが{overdueCount}件あります
        </p>
      )}

      {tasks.length === 0 ? (
        <p className="empty">タスクはまだありません</p>
      ) : (
        <>
          <p className="summary">
            {tasks.length}件中 {doneCount}件完了
          </p>
          <ul className="task-list">
            {tasks.map((task) => {
              const status = getDueStatus(task, today);
              return (
                <li key={task.id} className={`task ${task.done ? "done" : ""} ${status}`}>
                  <label className="task-main">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span className="task-title">{task.title}</span>
                  </label>
                  <div className="task-meta">
                    {status === "overdue" && (
                      <span className="badge badge-overdue">
                        期限切れ（{formatDue(task.due)}）
                      </span>
                    )}
                    {status === "today" && <span className="badge badge-today">今日まで</span>}
                    <input
                      type="date"
                      className="task-due"
                      value={task.due ?? ""}
                      onChange={(event) => changeDue(task.id, event.target.value)}
                      aria-label={`「${task.title}」の期限`}
                    />
                    <button
                      type="button"
                      className="delete"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`「${task.title}」を削除`}
                    >
                      削除
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}
