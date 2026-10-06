export const STORAGE_KEY = 'task-board/tasks'

// 以前の版（task-app）の保存キー。項目名が done / due だった
export const LEGACY_STORAGE_KEY = 'task-app.tasks'

function readArray(storage, key) {
  const saved = storage.getItem(key)
  if (saved === null) return null
  const tasks = JSON.parse(saved)
  return Array.isArray(tasks) ? tasks : []
}

// ブラウザに保存したタスクを読み込む（読めない・壊れている場合は空で始める）
// まだ保存がなければ、以前の版のデータを今の形式に変換して引き継ぐ
export function loadTasks(storage = globalThis.localStorage) {
  try {
    const tasks = readArray(storage, STORAGE_KEY)
    if (tasks) return tasks
    const legacy = readArray(storage, LEGACY_STORAGE_KEY) ?? []
    return legacy.map(({ done, due, ...rest }) => ({
      ...rest,
      completed: Boolean(done),
      dueDate: due ?? '',
    }))
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
