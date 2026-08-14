export function filterTests(tests, { search, subject }) {
  return tests.filter((t) => {
    if (search && !`${t.title} ${t.subject}`.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (subject && t.subject !== subject) return false
    return true
  })
}

export function uniqueTestSubjects(tests) {
  return Array.from(new Set(tests.map((t) => t.subject))).sort()
}
