import { describe, it, expect } from 'vitest'
import { daysUntil, isDueSoon } from './date.js'

const today = '2026-10-07'

describe('daysUntil', () => {
  it('期限までの日数を返す', () => {
    expect(daysUntil('2026-10-07', today)).toBe(0)
    expect(daysUntil('2026-10-10', today)).toBe(3)
    expect(daysUntil('2026-10-06', today)).toBe(-1)
  })

  it('月またぎでも正しく数える', () => {
    expect(daysUntil('2026-11-01', '2026-10-30')).toBe(2)
  })
})

describe('isDueSoon', () => {
  const task = (dueDate, completed = false) => ({ dueDate, completed })

  it('期限まで3日以内なら true', () => {
    expect(isDueSoon(task('2026-10-07'), today)).toBe(true)
    expect(isDueSoon(task('2026-10-10'), today)).toBe(true)
  })

  it('期限まで4日以上なら false', () => {
    expect(isDueSoon(task('2026-10-11'), today)).toBe(false)
  })

  it('期限切れも true', () => {
    expect(isDueSoon(task('2026-10-01'), today)).toBe(true)
  })

  it('完了済み・期限なしは false', () => {
    expect(isDueSoon(task('2026-10-08', true), today)).toBe(false)
    expect(isDueSoon(task(''), today)).toBe(false)
  })
})
