import { supabase } from './client'
import type { 
  KpiDataPayload, 
  IntegrationPayload, 
  SyncLogPayload,
  RealtimePayload 
} from '@/lib/types/database'

// Real-time subscription manager
export class RealtimeManager {
  private subscriptions: Map<string, any> = new Map()

  // Subscribe to KPI data changes
  subscribeToKpiData(
    userId: string,
    callbacks: {
      onInsert?: (payload: KpiDataPayload) => void
      onUpdate?: (payload: KpiDataPayload) => void
      onDelete?: (payload: KpiDataPayload) => void
    }
  ) {
    const subscription = supabase
      .channel('kpi_data_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kpi_data',
          filter: `user_id=eq.${userId}`
        },
        (payload: any) => {
          const typedPayload = payload as KpiDataPayload
          
          switch (typedPayload.eventType) {
            case 'INSERT':
              callbacks.onInsert?.(typedPayload)
              break
            case 'UPDATE':
              callbacks.onUpdate?.(typedPayload)
              break
            case 'DELETE':
              callbacks.onDelete?.(typedPayload)
              break
          }
        }
      )
      .subscribe()

    this.subscriptions.set('kpi_data', subscription)
    return subscription
  }

  // Subscribe to integration changes
  subscribeToIntegrations(
    userId: string,
    callbacks: {
      onInsert?: (payload: IntegrationPayload) => void
      onUpdate?: (payload: IntegrationPayload) => void
      onDelete?: (payload: IntegrationPayload) => void
    }
  ) {
    const subscription = supabase
      .channel('integration_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'integrations',
          filter: `user_id=eq.${userId}`
        },
        (payload: any) => {
          const typedPayload = payload as IntegrationPayload
          
          switch (typedPayload.eventType) {
            case 'INSERT':
              callbacks.onInsert?.(typedPayload)
              break
            case 'UPDATE':
              callbacks.onUpdate?.(typedPayload)
              break
            case 'DELETE':
              callbacks.onDelete?.(typedPayload)
              break
          }
        }
      )
      .subscribe()

    this.subscriptions.set('integrations', subscription)
    return subscription
  }

  // Subscribe to sync log changes
  subscribeToSyncLogs(
    userId: string,
    callbacks: {
      onInsert?: (payload: SyncLogPayload) => void
      onUpdate?: (payload: SyncLogPayload) => void
    }
  ) {
    const subscription = supabase
      .channel('sync_log_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sync_logs',
          filter: `user_id=eq.${userId}`
        },
        (payload: any) => {
          const typedPayload = payload as SyncLogPayload
          
          switch (typedPayload.eventType) {
            case 'INSERT':
              callbacks.onInsert?.(typedPayload)
              break
            case 'UPDATE':
              callbacks.onUpdate?.(typedPayload)
              break
          }
        }
      )
      .subscribe()

    this.subscriptions.set('sync_logs', subscription)
    return subscription
  }

  // Unsubscribe from a specific channel
  unsubscribe(channelName: string) {
    const subscription = this.subscriptions.get(channelName)
    if (subscription) {
      supabase.removeChannel(subscription)
      this.subscriptions.delete(channelName)
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    this.subscriptions.forEach((subscription, channelName) => {
      supabase.removeChannel(subscription)
    })
    this.subscriptions.clear()
  }

  // Get subscription status
  getSubscriptionStatus(channelName: string) {
    const subscription = this.subscriptions.get(channelName)
    return subscription?.state || 'closed'
  }
}

// Create a singleton instance
export const realtimeManager = new RealtimeManager()

// Utility hooks for React components
export const useRealtimeKpiData = (
  userId: string,
  callbacks: {
    onInsert?: (payload: KpiDataPayload) => void
    onUpdate?: (payload: KpiDataPayload) => void
    onDelete?: (payload: KpiDataPayload) => void
  }
) => {
  React.useEffect(() => {
    if (!userId) return

    const subscription = realtimeManager.subscribeToKpiData(userId, callbacks)

    return () => {
      realtimeManager.unsubscribe('kpi_data')
    }
  }, [userId, callbacks])
}

export const useRealtimeIntegrations = (
  userId: string,
  callbacks: {
    onInsert?: (payload: IntegrationPayload) => void
    onUpdate?: (payload: IntegrationPayload) => void
    onDelete?: (payload: IntegrationPayload) => void
  }
) => {
  React.useEffect(() => {
    if (!userId) return

    const subscription = realtimeManager.subscribeToIntegrations(userId, callbacks)

    return () => {
      realtimeManager.unsubscribe('integrations')
    }
  }, [userId, callbacks])
}

// Import React for hooks
import React from 'react'