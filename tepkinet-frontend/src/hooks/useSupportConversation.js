import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchSupportMessages,
  sendSupportMessage,
} from '@/services/supportMessageService'
import { getApiErrorMessage } from '@/utils/apiError'

export function useSupportConversation(complaintId) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [sendError, setSendError] = useState('')
  const messagesEndRef = useRef(null)
  const listRef = useRef(null)

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' })
  }, [])

  const loadMessages = useCallback(async () => {
    if (!complaintId) {
      setMessages([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const data = await fetchSupportMessages(complaintId)
      setMessages(data)
    } catch (err) {
      setMessages([])
      setError(getApiErrorMessage(err, 'Destek mesajları yüklenemedi.'))
    } finally {
      setIsLoading(false)
    }
  }, [complaintId])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  useEffect(() => {
  if (!isLoading && messages.length > 0 && listRef.current) {
    listRef.current.scrollTop = listRef.current.scrollHeight
  }
}, [isLoading, messages])

  const sendMessage = useCallback(
    async (messageText) => {
      const trimmed = messageText.trim()

      if (!trimmed || !complaintId) {
        return false
      }

      setIsSending(true)
      setSendError('')

      try {
        const created = await sendSupportMessage(complaintId, trimmed)

        if (!created?.id) {
          setSendError('Bu şikayette mesaj gönderme yetkiniz yok.')
          return false
        }

        setMessages((current) => [...current, created])
        return true
      } catch (err) {
        setSendError(getApiErrorMessage(err, 'Mesajınız gönderilemedi. Lütfen tekrar deneyin.'))
        return false
      } finally {
        setIsSending(false)
      }
    },
    [complaintId],
  )

  return {
    messages,
    isLoading,
    isSending,
    error,
    sendError,
    loadMessages,
    sendMessage,
    messagesEndRef,
    listRef,
    scrollToBottom,
  }
}
