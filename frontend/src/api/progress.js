import apiClient from './client'

export async function getProgressSummary() {
  const response = await apiClient.get('/progress/summary')
  return response.data
}
