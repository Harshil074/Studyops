import { useState, useEffect, useMemo, useCallback } from 'react'
import { getMockTests, getMockTest, submitMockTest } from '../api/mocktests'
import AppShell from '../components/layout/AppShell'
import Spinner from '../components/ui/Spinner'
import Alert from '../components/ui/Alert'
import TestFilters from '../components/mocktests/TestFilters'
import TestCard from '../components/mocktests/TestCard'
import TestRunner from '../components/mocktests/TestRunner'
import ResultCard from '../components/mocktests/ResultCard'
import { StaggerContainer, StaggerItem } from '../components/ui/Stagger'
import { filterTests, uniqueTestSubjects } from '../utils/mocktests'

function MockTests() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTest, setActiveTest] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // Session-only "last attempt" scores — real, but not persisted anywhere
  // (the backend has no attempt-history endpoint), so this resets on reload.
  const [sessionScores, setSessionScores] = useState({})

  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')

  useEffect(() => {
    getMockTests()
      .then(setTests)
      .catch(() => setError('Failed to load tests.'))
      .finally(() => setLoading(false))
  }, [])

  const openTest = useCallback(async (testId) => {
    setResult(null)
    setAnswers({})
    try {
      const data = await getMockTest(testId)
      setActiveTest(data)
    } catch {
      setError('Failed to load test.')
    }
  }, [])

  function selectAnswer(questionId, optionIndex) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  async function handleSubmit() {
    try {
      const data = await submitMockTest(activeTest.id, answers)
      setResult(data)
      const pct = data.total_questions ? Math.round((data.score / data.total_questions) * 100) : 0
      setSessionScores((prev) => ({ ...prev, [activeTest.id]: pct }))
    } catch {
      setError('Failed to submit test.')
    }
  }

  function backToTests() {
    setActiveTest(null)
    setResult(null)
  }

  const subjects = useMemo(() => uniqueTestSubjects(tests), [tests])
  const visibleTests = useMemo(
    () => filterTests(tests, { search, subject: subjectFilter }),
    [tests, search, subjectFilter]
  )

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner label="Loading mock tests..." />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-6xl">
        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-text mb-6">Mock Tests</h1>

        {error && (
          <Alert tone="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {!activeTest && (
          <>
            <TestFilters
              search={search}
              onSearchChange={setSearch}
              subject={subjectFilter}
              onSubjectChange={setSubjectFilter}
              subjects={subjects}
            />

            {visibleTests.length === 0 ? (
              <p className="font-body text-sm text-muted text-center py-12">
                {tests.length === 0 ? 'No mock tests available yet.' : 'No tests match your filters.'}
              </p>
            ) : (
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleTests.map((t) => (
                  <StaggerItem key={t.id}>
                    <TestCard test={t} lastScorePct={sessionScores[t.id]} onStart={openTest} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </>
        )}

        {activeTest && !result && (
          <TestRunner
            test={activeTest}
            answers={answers}
            onSelectAnswer={selectAnswer}
            onSubmit={handleSubmit}
            onCancel={backToTests}
          />
        )}

        {result && <ResultCard result={result} onBack={backToTests} />}
      </div>
    </AppShell>
  )
}

export default MockTests
