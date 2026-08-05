import apiClient from './client'

export async function getHomework(onlyPending) {
  const response = await apiClient.get('/homework', {
    params: onlyPending ? { only_pending: true } : {},
  })
  return response.data
}

export async function createHomework({ subject, title, due_date }) {
  const response = await apiClient.post('/homework', { subject, title, due_date })
  return response.data
}

export async function updateHomework(taskId, updates) {
  const response = await apiClient.patch(`/homework/${taskId}`, updates)
  return response.data
}

export async function deleteHomework(taskId) {
  await apiClient.delete(`/homework/${taskId}`)
}