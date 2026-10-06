// 期限が近いとみなす日数（今日から何日後までを「期限間近」とするか）
export const DUE_SOON_DAYS = 3

// Date をローカル時刻の 'YYYY-MM-DD' 文字列にする（toISOString は UTC になるため使わない）
export function toDateString(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 'YYYY-MM-DD' 同士の日数差（due - today）。正なら期限まで残り日数、負なら期限切れ
export function daysUntil(dueDate, today = toDateString(new Date())) {
  const toUtc = (s) => {
    const [y, m, d] = s.split('-').map(Number)
    return Date.UTC(y, m - 1, d)
  }
  return Math.round((toUtc(dueDate) - toUtc(today)) / 86400000)
}

// 未完了で、期限まで3日以内（期限切れを含む）のタスクなら true
export function isDueSoon(task, today) {
  if (task.completed || !task.dueDate) return false
  return daysUntil(task.dueDate, today) <= DUE_SOON_DAYS
}
