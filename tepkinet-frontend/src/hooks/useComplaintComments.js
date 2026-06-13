import { useCallback, useEffect, useState } from 'react'
import {
  createComment,
  deleteComment as deleteCommentRequest,
  fetchCommentsByComplaint,
} from '@/services/commentService'
import { getApiErrorMessage } from '@/utils/apiError'

export function useComplaintComments(complaintId, { enabled = true } = {}) {
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(Boolean(enabled && complaintId))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const loadComments = useCallback(async () => {
    if (!enabled || !complaintId) {
      setComments([])
      setIsLoading(false)
      setError('')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const data = await fetchCommentsByComplaint(complaintId)
      setComments(data)
    } catch (err) {
      setComments([])
      setError(getApiErrorMessage(err, 'Yorumlar yüklenemedi.'))
    } finally {
      setIsLoading(false)
    }
  }, [complaintId, enabled])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const addComment = useCallback(
    async (content) => {
      const trimmed = content.trim()

      if (!trimmed || !complaintId || !enabled) {
        return false
      }

      setIsSubmitting(true)
      setSubmitError('')

      try {
        const created = await createComment(complaintId, trimmed)

        if (!created) {
          setSubmitError('Yorumunuz kaydedilemedi. Lütfen tekrar deneyin.')
          return false
        }

        setComments((current) => [...current, created])
        return true
      } catch (err) {
        setSubmitError(getApiErrorMessage(err, 'Yorumunuz gönderilemedi. Lütfen tekrar deneyin.'))
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [complaintId, enabled],
  )

  const removeComment = useCallback(async (commentId) => {
    if (!commentId) {
      return false
    }

    setDeletingId(commentId)
    setDeleteError('')

    try {
      await deleteCommentRequest(commentId)
      setComments((current) => current.filter((item) => item.id !== commentId))
      return true
    } catch (err) {
      setDeleteError(getApiErrorMessage(err, 'Bu yorum silinemedi.'))
      return false
    } finally {
      setDeletingId(null)
    }
  }, [])

  return {
    comments,
    isLoading,
    isSubmitting,
    deletingId,
    error,
    submitError,
    deleteError,
    loadComments,
    addComment,
    removeComment,
    clearDeleteError: () => setDeleteError(''),
  }
}
