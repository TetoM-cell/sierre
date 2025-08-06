import { supabase } from './client'
import type { 
  Profile, 
  ProfileInsert, 
  ProfileUpdate,
  Integration,
  IntegrationInsert,
  IntegrationUpdate,
  KpiData,
  KpiDataInsert,
  KpiDataUpdate,
  SyncLog,
  SyncLogInsert,
  DashboardData,
  KpiMetrics
} from '@/lib/types/database'

// Profile queries
export const profileQueries = {
  // Get current user's profile
  getProfile: async (): Promise<Profile | null> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return data
  },

  // Update user profile
  updateProfile: async (updates: ProfileUpdate): Promise<Profile> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Create profile (usually handled by trigger)
  createProfile: async (profile: ProfileInsert): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Integration queries
export const integrationQueries = {
  // Get all user integrations
  getIntegrations: async (): Promise<Integration[]> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get integration by ID
  getIntegration: async (id: string): Promise<Integration | null> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return data
  },

  // Create new integration
  createIntegration: async (integration: IntegrationInsert): Promise<Integration> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('integrations')
      .insert({ ...integration, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update integration
  updateIntegration: async (id: string, updates: IntegrationUpdate): Promise<Integration> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('integrations')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete integration
  deleteIntegration: async (id: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }
}

// KPI data queries
export const kpiQueries = {
  // Get all user KPIs
  getKpis: async (limit?: number): Promise<KpiData[]> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    let query = supabase
      .from('kpi_data')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  },

  // Get KPIs by category
  getKpisByCategory: async (category: string): Promise<KpiData[]> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('kpi_data')
      .select('*')
      .eq('user_id', user.id)
      .eq('category', category)
      .order('recorded_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get KPI by ID
  getKpi: async (id: string): Promise<KpiData | null> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('kpi_data')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return data
  },

  // Create new KPI
  createKpi: async (kpi: KpiDataInsert): Promise<KpiData> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('kpi_data')
      .insert({ ...kpi, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update KPI
  updateKpi: async (id: string, updates: KpiDataUpdate): Promise<KpiData> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('kpi_data')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete KPI
  deleteKpi: async (id: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('kpi_data')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },

  // Get KPI metrics for dashboard
  getKpiMetrics: async (): Promise<KpiMetrics> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: kpis, error } = await supabase
      .from('kpi_data')
      .select('value, target, trend')
      .eq('user_id', user.id)

    if (error) throw error

    const totalKpis = kpis?.length || 0
    const onTrackKpis = kpis?.filter(kpi => (kpi.value / kpi.target) >= 0.8).length || 0
    const averageProgress = totalKpis > 0 
      ? kpis!.reduce((sum, kpi) => sum + (kpi.value / kpi.target), 0) / totalKpis * 100
      : 0
    const trendsUp = kpis?.filter(kpi => kpi.trend === 'up').length || 0
    const trendsDown = kpis?.filter(kpi => kpi.trend === 'down').length || 0

    return {
      totalKpis,
      onTrackKpis,
      averageProgress: Math.round(averageProgress),
      trendsUp,
      trendsDown
    }
  }
}

// Sync log queries
export const syncLogQueries = {
  // Get sync logs for user
  getSyncLogs: async (limit = 50): Promise<SyncLog[]> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('sync_logs')
      .select(`
        *,
        integrations (
          platform,
          store_name
        )
      `)
      .eq('user_id', user.id)
      .order('synced_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  // Create sync log
  createSyncLog: async (log: SyncLogInsert): Promise<SyncLog> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('sync_logs')
      .insert({ ...log, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Dashboard data query
export const dashboardQueries = {
  // Get complete dashboard data
  getDashboardData: async (): Promise<DashboardData> => {
    const [metrics, recentKpis, integrations, syncLogs] = await Promise.all([
      kpiQueries.getKpiMetrics(),
      kpiQueries.getKpis(10),
      integrationQueries.getIntegrations(),
      syncLogQueries.getSyncLogs(10)
    ])

    return {
      metrics,
      recentKpis,
      integrations,
      syncLogs
    }
  }
}