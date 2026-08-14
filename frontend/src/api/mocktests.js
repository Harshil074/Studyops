import apiClient from './client'

export async function getMockTests() {
  const response = await apiClient.get('/mock-tests')
  return response.data
}

export async function getMockTest(testId) {
  const response = await apiClient.get(`/mock-tests/${testId}`)
  return response.data
}

export async function submitMockTest(testId, answers) {
  const response = await apiClient.post(`/mock-tests/${testId}/submit`, { answers })
  return response.data
}
