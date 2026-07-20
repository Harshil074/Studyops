import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMockTests, getMockTest, submitMockTest } from '../api/mocktests'

function MockTests() {
  const [tests, setTests] = useState([])
  const [activeTest, setActiveTest] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getMockTests().then(setTests).catch(() => setError('Failed to load tests.'))
  }, [])

  async function openTest(testId) {
    setResult(null)
    setAnswers({})
    try {
      const data = await getMockTest(testId)
      setActiveTest(data)
    } catch {
      setError('Failed to load test.')
    }
  }

  function selectAnswer(questionId, optionIndex) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  async function handleSubmit() {
    try {
      const data = await submitMockTest(activeTest.id, answers)
      setResult(data)
    } catch {
      setError('Failed to submit test.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Mock Tests</h1>
          <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm">← Dashboard</Link>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">{error}</div>}

        {!activeTest && (
          <ul className="space-y-2">
            {tests.map((t) => (
              <li key={t.id} className="bg-slate-800 rounded-lg px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="text-white">{t.title}</p>
                  <p className="text-slate-400 text-xs">{t.subject}</p>
                </div>
                <button onClick={() => openTest(t.id)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
                  Take Test
                </button>
              </li>
            ))}
          </ul>
        )}

        {activeTest && !result && (
          <div className="bg-slate-800 rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-bold text-white">{activeTest.title}</h2>
            {activeTest.questions.map((q, i) => (
              <div key={q.id}>
                <p className="text-white mb-2">{i + 1}. {q.question_text}</p>
                <div className="space-y-1">
                  {q.options.map((opt, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-slate-300">
                      <input
                        type="radio"
                        name={q.id}
                        checked={answers[q.id] === idx}
                        onChange={() => selectAnswer(q.id, idx)}
                        className="accent-blue-500"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={handleSubmit} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg">
              Submit
            </button>
          </div>
        )}

        {result && (
          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Score: {result.score}/{result.total_questions}</h2>
            <button onClick={() => setActiveTest(null)} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
              Back to tests
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MockTests
