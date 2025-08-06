// TypeScript types generated from Supabase schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          first_name: string
          last_name: string
          email: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          first_name: string
          last_name: string
          email: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          first_name?: string
          last_name?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          platform: 'shopify' | 'etsy' | 'woocommerce' | 'squarespace'
          status: 'connected' | 'disconnected' | 'error'
          api_key: string | null
          store_name: string
          sync_frequency: 'realtime' | 'hourly' | 'daily' | 'weekly'
          last_sync: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: 'shopify' | 'etsy' | 'woocommerce' | 'squarespace'
          status?: 'connected' | 'disconnected' | 'error'
          api_key?: string | null
          store_name: string
          sync_frequency?: 'realtime' | 'hourly' | 'daily' | 'weekly'
          last_sync?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: 'shopify' | 'etsy' | 'woocommerce' | 'squarespace'
          status?: 'connected' | 'disconnected' | 'error'
          api_key?: string | null
          store_name?: string
          sync_frequency?: 'realtime' | 'hourly' | 'daily' | 'weekly'
          last_sync?: string | null
          created_at?: string
        }
      }
      kpi_data: {
        Row: {
          id: string
          user_id: string
          metric_name: string
          value: number
          target: number
          unit: 'currency' | 'percentage' | 'count' | 'ratio'
          category: string
          change_percent: number
          trend: 'up' | 'down' | 'neutral'
          recorded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          metric_name: string
          value: number
          target: number
          unit: 'currency' | 'percentage' | 'count' | 'ratio'
          category: string
          change_percent?: number
          trend?: 'up' | 'down' | 'neutral'
          recorded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          metric_name?: string
          value?: number
          target?: number
          unit?: 'currency' | 'percentage' | 'count' | 'ratio'
          category?: string
          change_percent?: number
          trend?: 'up' | 'down' | 'neutral'
          recorded_at?: string
        }
      }
      sync_logs: {
        Row: {
          id: string
          user_id: string
          integration_id: string
          status: 'success' | 'error' | 'in_progress'
          error_message: string | null
          synced_at: string
        }
        Insert: {
          id?: string
          user_id: string
          integration_id: string
          status: 'success' | 'error' | 'in_progress'
          error_message?: string | null
          synced_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          integration_id?: string
          status?: 'success' | 'error' | 'in_progress'
          error_message?: string | null
          synced_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Integration = Database['public']['Tables']['integrations']['Row']
export type IntegrationInsert = Database['public']['Tables']['integrations']['Insert']
export type IntegrationUpdate = Database['public']['Tables']['integrations']['Update']

export type KpiData = Database['public']['Tables']['kpi_data']['Row']
export type KpiDataInsert = Database['public']['Tables']['kpi_data']['Insert']
export type KpiDataUpdate = Database['public']['Tables']['kpi_data']['Update']

export type SyncLog = Database['public']['Tables']['sync_logs']['Row']
export type SyncLogInsert = Database['public']['Tables']['sync_logs']['Insert']
export type SyncLogUpdate = Database['public']['Tables']['sync_logs']['Update']

// Enum types for better type safety
export type Platform = 'shopify' | 'etsy' | 'woocommerce' | 'squarespace'
export type IntegrationStatus = 'connected' | 'disconnected' | 'error'
export type SyncFrequency = 'realtime' | 'hourly' | 'daily' | 'weekly'
export type KpiUnit = 'currency' | 'percentage' | 'count' | 'ratio'
export type Trend = 'up' | 'down' | 'neutral'
export type SyncStatus = 'success' | 'error' | 'in_progress'

// Extended types with computed fields for UI
export interface KpiDataWithProgress extends KpiData {
  progress: number
  isOnTrack: boolean
  unitSymbol: string
}

export interface IntegrationWithLastSync extends Integration {
  lastSyncFormatted: string
  isHealthy: boolean
}

// API response types
export interface KpiMetrics {
  totalKpis: number
  onTrackKpis: number
  averageProgress: number
  trendsUp: number
  trendsDown: number
}

export interface DashboardData {
  metrics: KpiMetrics
  recentKpis: KpiData[]
  integrations: Integration[]
  syncLogs: SyncLog[]
}

// Real-time subscription types
export interface RealtimePayload<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T
  old: T
  schema: string
  table: string
}

export type KpiDataPayload = RealtimePayload<KpiData>
export type IntegrationPayload = RealtimePayload<Integration>
export type SyncLogPayload = RealtimePayload<SyncLog>