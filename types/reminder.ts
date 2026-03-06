export interface HannaReminder {
  id: string
  user_id: string
  session_id: string | null
  task: string
  strategic_context: string | null
  approach_suggestion: string | null
  due_at: string
  status: 'pending' | 'completed' | 'dismissed'
  email_sent: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface ReminderSuggestion {
  task: string
  due: string
  due_iso: string
  why: string
  approach: string
}

export interface CreateReminderInput {
  task: string
  strategic_context?: string
  approach_suggestion?: string
  due_iso: string
  timezone?: string
  session_id?: string
}

export interface PendingRemindersResponse {
  overdue: HannaReminder[]
  today: HannaReminder[]
  upcoming: HannaReminder[]
}
