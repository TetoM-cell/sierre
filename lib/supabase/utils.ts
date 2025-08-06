import type { 
  KpiData, 
  KpiDataWithProgress, 
  Integration, 
  IntegrationWithLastSync,
  KpiUnit 
} from '@/lib/types/database'

// Utility functions for working with Supabase data

// KPI utilities
export const kpiUtils = {
  // Calculate progress percentage
  calculateProgress: (value: number, target: number): number => {
    if (target === 0) return 0
    return Math.round((value / target) * 100)
  },

  // Check if KPI is on track (>= 80% of target)
  isOnTrack: (value: number, target: number): boolean => {
    return (value / target) >= 0.8
  },

  // Get unit symbol for display
  getUnitSymbol: (unit: KpiUnit): string => {
    const symbols = {
      currency: '$',
      percentage: '%',
      count: '',
      ratio: ':'
    }
    return symbols[unit] || ''
  },

  // Format KPI value for display
  formatValue: (value: number, unit: KpiUnit): string => {
    const symbol = kpiUtils.getUnitSymbol(unit)
    
    switch (unit) {
      case 'currency':
        return `${symbol}${value.toLocaleString()}`
      case 'percentage':
        return `${value}${symbol}`
      case 'count':
        return value.toLocaleString()
      case 'ratio':
        return `${value}${symbol}1`
      default:
        return value.toString()
    }
  },

  // Enhance KPI data with computed fields
  enhanceKpiData: (kpi: KpiData): KpiDataWithProgress => {
    const progress = kpiUtils.calculateProgress(kpi.value, kpi.target)
    const isOnTrack = kpiUtils.isOnTrack(kpi.value, kpi.target)
    const unitSymbol = kpiUtils.getUnitSymbol(kpi.unit)

    return {
      ...kpi,
      progress,
      isOnTrack,
      unitSymbol
    }
  },

  // Calculate trend based on change percentage
  calculateTrend: (changePercent: number): 'up' | 'down' | 'neutral' => {
    if (changePercent > 0.5) return 'up'
    if (changePercent < -0.5) return 'down'
    return 'neutral'
  }
}

// Integration utilities
export const integrationUtils = {
  // Format last sync time
  formatLastSync: (lastSync: string | null): string => {
    if (!lastSync) return 'Never synced'
    
    const syncDate = new Date(lastSync)
    const now = new Date()
    const diffMs = now.getTime() - syncDate.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    
    return syncDate.toLocaleDateString()
  },

  // Check if integration is healthy (synced within expected frequency)
  isHealthy: (integration: Integration): boolean => {
    if (!integration.last_sync) return false
    
    const lastSync = new Date(integration.last_sync)
    const now = new Date()
    const diffHours = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60)

    const thresholds = {
      realtime: 1,    // 1 hour
      hourly: 2,      // 2 hours
      daily: 25,      // 25 hours
      weekly: 168     // 7 days + 1 day buffer
    }

    return diffHours <= thresholds[integration.sync_frequency]
  },

  // Enhance integration data with computed fields
  enhanceIntegrationData: (integration: Integration): IntegrationWithLastSync => {
    const lastSyncFormatted = integrationUtils.formatLastSync(integration.last_sync)
    const isHealthy = integrationUtils.isHealthy(integration)

    return {
      ...integration,
      lastSyncFormatted,
      isHealthy
    }
  },

  // Get platform display name
  getPlatformDisplayName: (platform: string): string => {
    const names = {
      shopify: 'Shopify',
      etsy: 'Etsy',
      woocommerce: 'WooCommerce',
      squarespace: 'Squarespace'
    }
    return names[platform as keyof typeof names] || platform
  },

  // Get platform color for UI
  getPlatformColor: (platform: string): string => {
    const colors = {
      shopify: 'bg-green-600',
      etsy: 'bg-orange-500',
      woocommerce: 'bg-purple-600',
      squarespace: 'bg-black'
    }
    return colors[platform as keyof typeof colors] || 'bg-gray-600'
  }
}

// Date utilities
export const dateUtils = {
  // Format date for display
  formatDate: (date: string): string => {
    return new Date(date).toLocaleDateString()
  },

  // Format datetime for display
  formatDateTime: (date: string): string => {
    return new Date(date).toLocaleString()
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (date: string): string => {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now.getTime() - past.getTime()
    
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSeconds < 60) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return past.toLocaleDateString()
  },

  // Get date range for queries
  getDateRange: (period: 'week' | 'month' | 'quarter' | 'year') => {
    const now = new Date()
    const start = new Date()

    switch (period) {
      case 'week':
        start.setDate(now.getDate() - 7)
        break
      case 'month':
        start.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        start.setMonth(now.getMonth() - 3)
        break
      case 'year':
        start.setFullYear(now.getFullYear() - 1)
        break
    }

    return {
      start: start.toISOString(),
      end: now.toISOString()
    }
  }
}

// Error handling utilities
export const errorUtils = {
  // Parse Supabase error
  parseSupabaseError: (error: any): string => {
    if (error?.message) {
      // Handle common Supabase errors
      if (error.message.includes('duplicate key')) {
        return 'This record already exists'
      }
      if (error.message.includes('foreign key')) {
        return 'Invalid reference to related data'
      }
      if (error.message.includes('not null')) {
        return 'Required field is missing'
      }
      if (error.message.includes('check constraint')) {
        return 'Invalid value provided'
      }
      
      return error.message
    }
    
    return 'An unexpected error occurred'
  },

  // Check if error is authentication related
  isAuthError: (error: any): boolean => {
    return error?.message?.includes('JWT') || 
           error?.message?.includes('auth') ||
           error?.status === 401
  },

  // Check if error is permission related
  isPermissionError: (error: any): boolean => {
    return error?.message?.includes('permission') ||
           error?.message?.includes('RLS') ||
           error?.status === 403
  }
}

// Validation utilities
export const validationUtils = {
  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validate KPI data
  validateKpiData: (data: Partial<KpiData>): string[] => {
    const errors: string[] = []

    if (!data.metric_name?.trim()) {
      errors.push('Metric name is required')
    }

    if (data.value === undefined || data.value === null) {
      errors.push('Value is required')
    } else if (isNaN(Number(data.value))) {
      errors.push('Value must be a number')
    }

    if (data.target === undefined || data.target === null) {
      errors.push('Target is required')
    } else if (isNaN(Number(data.target))) {
      errors.push('Target must be a number')
    }

    if (!data.category?.trim()) {
      errors.push('Category is required')
    }

    if (!data.unit) {
      errors.push('Unit is required')
    }

    return errors
  }
}