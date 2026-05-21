import { useState, useCallback } from 'react'
import type { CreateCalendarEventRequest, UpdateCalendarEventRequest, CalendarEvent } from '../models/calendar.model'

const getDefaultFormData = (date?: string): Partial<CreateCalendarEventRequest> => ({
  title: '',
  description: '',
  event_date: date || new Date().toISOString().split('T')[0],
  start_time: '10:00:00',
  end_time: '12:00:00',
  location: '',
})

export const useCalendarForm = () => {
  const [formData, setFormData] = useState<Partial<CreateCalendarEventRequest>>(getDefaultFormData())
  const [isFormValid, setIsFormValid] = useState(false)

  const validateForm = useCallback((data: Partial<CreateCalendarEventRequest>) => {
    return !!(data.title && data.title.trim() && data.event_date)
  }, [])

  const updateForm = useCallback((data: Partial<CreateCalendarEventRequest>) => {
    setFormData(data)
    setIsFormValid(validateForm(data))
  }, [validateForm])

  const resetForm = useCallback((date?: string) => {
    const newData = getDefaultFormData(date)
    setFormData(newData)
    setIsFormValid(validateForm(newData))
  }, [validateForm])

  const setEventToForm = useCallback((event: CalendarEvent) => {
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.location,
    })
    setIsFormValid(true)
  }, [])

  const getCreatePayload = useCallback((): CreateCalendarEventRequest | null => {
    if (!isFormValid) return null
    return {
      title: formData.title!,
      description: formData.description || '',
      event_date: formData.event_date!,
      start_time: formData.start_time!,
      end_time: formData.end_time!,
      location: formData.location || '',
    }
  }, [formData, isFormValid])

  const getUpdatePayload = useCallback((): UpdateCalendarEventRequest => {
    const payload: UpdateCalendarEventRequest = {}
    if (formData.title !== undefined) payload.title = formData.title
    if (formData.description !== undefined) payload.description = formData.description
    if (formData.event_date !== undefined) payload.event_date = formData.event_date
    if (formData.start_time !== undefined) payload.start_time = formData.start_time
    if (formData.end_time !== undefined) payload.end_time = formData.end_time
    if (formData.location !== undefined) payload.location = formData.location
    return payload
  }, [formData])

  return {
    formData,
    isFormValid,
    updateForm,
    resetForm,
    setEventToForm,
    getCreatePayload,
    getUpdatePayload,
  }
}