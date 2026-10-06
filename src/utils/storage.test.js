import { describe, it, expect } from 'vitest'
import { STORAGE_KEY, loadTasks, saveTasks } from './storage.js'

// localStorage と同じ getItem / setItem を持つテスト用の入れ物
function createStorage(initial = {}) {
  const data = { ...initial }
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value)
    },
  }
}

const tasks = [
  { id: '1', title: '資料作成', dueDate: '2026-10-09', completed: false },
  { id: '2', title: '会議', dueDate: '', completed: true },
]

describe('saveTasks / loadTasks', () => {
  it('保存したタスクを読み込める（リロード後に復元できる）', () => {
    const storage = createStorage()
    saveTasks(tasks, storage)
    expect(loadTasks(storage)).toEqual(tasks)
  })

  it('何も保存されていなければ空配列', () => {
    expect(loadTasks(createStorage())).toEqual([])
  })

  it('保存データが壊れていても空配列で始める', () => {
    expect(loadTasks(createStorage({ [STORAGE_KEY]: '{壊れたJSON' }))).toEqual([])
    expect(loadTasks(createStorage({ [STORAGE_KEY]: '"文字列"' }))).toEqual([])
  })

  it('ストレージが使えなくてもエラーにならない', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    }
    expect(loadTasks(broken)).toEqual([])
    expect(() => saveTasks(tasks, broken)).not.toThrow()
  })
})
