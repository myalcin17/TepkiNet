export function normalizeComment(raw) {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const id = raw.id ?? raw.Id ?? null

  if (id == null) {
    return null
  }

  return {
    id,
    content: typeof raw.content === 'string' ? raw.content : '',
    username: typeof raw.username === 'string' ? raw.username : '',
    createdAt: raw.createdAt ?? null,
    complaintId: raw.complaintId ?? raw.complaint_id ?? null,
  }
}

export function sortCommentsByDate(comments) {
  return [...comments].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return timeA - timeB
  })
}

export function canDeleteComment(comment, user) {
  if (!comment || !user) {
    return false
  }

  if (user.role === 'ADMIN') {
    return true
  }

  if (user.username && comment.username) {
    return user.username === comment.username
  }

  return false
}
