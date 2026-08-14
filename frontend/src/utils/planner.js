function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  return cells
}

export function buildWeekGrid(baseDate) {
  const start = new Date(baseDate)
  start.setDate(start.getDate() - start.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

export function groupTasksByDate(tasks) {
  const map = new Map()
  for (const task of tasks) {
    if (!task.due_date) continue
    // due_date already arrives as 'YYYY-MM-DD' from the backend/date input.
    const key = task.due_date
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(task)
  }
  return map
}

export function dateKey(date) {
  return toDateKey(date)
}

export function isSameDay(a, b) {
  return toDateKey(a) === toDateKey(b)
}
