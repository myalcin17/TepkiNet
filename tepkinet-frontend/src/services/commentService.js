import api from '@/services/api'
import { normalizeComment, sortCommentsByDate } from '@/utils/comment'

const COMMENTS_PATH = '/comments'

function normalizeCommentList(data) {
  if (!Array.isArray(data)) {
    return []
  }

  return sortCommentsByDate(
    data.map(normalizeComment).filter(Boolean),
  )
}

export async function fetchCommentsByComplaint(complaintId) {
  const { data } = await api.get(`${COMMENTS_PATH}/complaint/${complaintId}`)
  return normalizeCommentList(data)
}

export async function createComment(complaintId, content) {
  const { data } = await api.post(
    COMMENTS_PATH,
    { content },
    {
      params: { complaintId },
    },
  )

  return normalizeComment(data)
}

export async function deleteComment(commentId) {
  await api.delete(`${COMMENTS_PATH}/${commentId}`)
}
