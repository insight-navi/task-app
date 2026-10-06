export const STORAGE_KEY = 'task-board/tasks'

// ブラウザに保存したタスクを読み込む（読めない・壊れている場合は空で始める）
export function loadTasks(storage = globalThis.localStorage) {
  try {
    const saved = storage.getItem(STORAGE_KEY)
    const tasks = saved ? JSON.parse(saved) : []
    return Array.isArray(tasks) ? tasks : []
  } catch {
    return []
  }
}

// タスクをブラウザに保存する（保存できない環境では何もしない）
export function saveTasks(tasks, storage = globalThis.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // プライベートモードや容量超過などで保存できない場合は諦める
  }
}
