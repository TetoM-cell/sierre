import React, { useState, useContext, createContext, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Plus, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, 
  Edit2, Trash2, Tag, X, Check, AlertCircle, Calendar, Target, Percent 
} from 'lucide-react';

// Types and Interfaces
interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: 'currency' | 'percentage' | 'count' | 'ratio';
  unitSymbol: string;
  category: string;
  tags: string[];
  trend: 'up' | 'down' | 'neutral';
  changePercent: number;
  createdAt: string;
  updatedAt: string;
  history: Array<{
    date: string;
    value: number;
  }>;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

interface Integration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  platform: 'shopify' | 'etsy' | 'woocommerce' | 'squarespace';
}

interface AppState {
  user: User;
  kpis: KPI[];
  integrations: Integration[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  addKPI: (kpi: Omit<KPI, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateKPI: (id: string, updates: Partial<KPI>) => void;
  deleteKPI: (id: string) => void;
  updateUser: (updates: Partial<User>) => void;
  addCategory: (category: string) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

// Initial mock data
const initialKPIs: KPI[] = [
  {
    id: '1',
    name: 'Monthly Revenue',
    value: 45000,
    target: 50000,
    unit: 'currency',
    unitSymbol: '$',
    category: 'Revenue',
    tags: ['monthly', 'primary'],
    trend: 'up',
    changePercent: 12.5,
    createdAt: '2024-01-01',
    updatedAt: '2024-08-01',
    history: [
      { date: '2024-01', value: 38000 },
      { date: '2024-02', value: 42000 },
      { date: '2024-03', value: 40000 },
      { date: '2024-04', value: 45000 }
    ]
  },
  {
    id: '2',
    name: 'Conversion Rate',
    value: 3.2,
    target: 4.0,
    unit: 'percentage',
    unitSymbol: '%',
    category: 'Marketing',
    tags: ['conversion', 'key'],
    trend: 'up',
    changePercent: 8.3,
    createdAt: '2024-01-01',
    updatedAt: '2024-08-01',
    history: [
      { date: '2024-01', value: 2.8 },
      { date: '2024-02', value: 3.0 },
      { date: '2024-03', value: 2.9 },
      { date: '2024-04', value: 3.2 }
    ]
  },
  {
    id: '3',
    name: 'Average Order Value',
    value: 85,
    target: 90,
    unit: 'currency',
    unitSymbol: '$',
    category: 'Sales',
    tags: ['aov', 'sales'],
    trend: 'down',
    changePercent: -2.1,
    createdAt: '2024-01-01',
    updatedAt: '2024-08-01',
    history: [
      { date: '2024-01', value: 88 },
      { date: '2024-02', value: 87 },
      { date: '2024-03', value: 89 },
      { date: '2024-04', value: 85 }
    ]
  }
];

const initialUser: User = {
  id: '1',
  firstName: 'Teto',
  lastName: 'Kasane',
  email: 'teto@example.com'
};

const initialIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Shopify',
    status: 'connected',
    lastSync: '2 hours ago',
    platform: 'shopify'
  },
  {
    id: '2',
    name: 'Etsy',
    status: 'connected',
    lastSync: '1 day ago',
    platform: 'etsy'
  }
];

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook to use the context
const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Form validation utilities
const validateKPIForm = (data: any) => {
  const errors: Record<string, string> = {};
  
  if (!data.name?.trim()) {
    errors.name = 'KPI name is required';
  }
  
  if (data.value === undefined || data.value === null || data.value === '') {
    errors.value = 'Current value is required';
  } else if (isNaN(Number(data.value))) {
    errors.value = 'Value must be a number';
  }
  
  if (data.target === undefined || data.target === null || data.target === '') {
    errors.target = 'Target value is required';
  } else if (isNaN(Number(data.target))) {
    errors.target = 'Target must be a number';
  }
  
  if (!data.category?.trim()) {
    errors.category = 'Category is required';
  }
  
  if (!data.unit) {
    errors.unit = 'Unit type is required';
  }
  
  return errors;
};

// KPI Form Component
const KPIForm = ({ 
  kpi, 
  onSubmit, 
  onCancel, 
  categories 
}: { 
  kpi?: KPI; 
  onSubmit: (data: any) => void; 
  onCancel: () => void;
  categories: string[];
}) => {
  const [formData, setFormData] = useState({
    name: kpi?.name || '',
    value: kpi?.value || '',
    target: kpi?.target || '',
    unit: kpi?.unit || 'currency',
    category: kpi?.category || '',
    tags: kpi?.tags?.join(', ') || ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newCategory, setNewCategory] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateKPIForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      const unitSymbols = {
        currency: '$',
        percentage: '%',
        count: '',
        ratio: ':'
      };
      
      onSubmit({
        ...formData,
        value: Number(formData.value),
        target: Number(formData.target),
        unitSymbol: unitSymbols[formData.unit as keyof typeof unitSymbols],
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        trend: 'neutral',
        changePercent: 0,
        history: kpi?.history || []
      });
    }
  };
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* KPI Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          KPI Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Monthly Revenue"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.name}
          </p>
        )}
      </div>
      
      {/* Current Value and Target */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Value *
          </label>
          <input
            type="number"
            step="any"
            value={formData.value}
            onChange={(e) => handleInputChange('value', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.value ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.value && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.value}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Value *
          </label>
          <input
            type="number"
            step="any"
            value={formData.target}
            onChange={(e) => handleInputChange('target', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.target ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.target && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.target}
            </p>
          )}
        </div>
      </div>
      
      {/* Unit Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Unit Type *
        </label>
        <select
          value={formData.unit}
          onChange={(e) => handleInputChange('unit', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.unit ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="currency">Currency ($)</option>
          <option value="percentage">Percentage (%)</option>
          <option value="count">Count (Number)</option>
          <option value="ratio">Ratio (:)</option>
        </select>
        {errors.unit && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.unit}
          </p>
        )}
      </div>
      
      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <div className="flex gap-2">
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value="__new__">+ Add New Category</option>
          </select>
        </div>
        
        {formData.category === '__new__' && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => {
                if (newCategory.trim()) {
                  handleInputChange('category', newCategory.trim());
                  setNewCategory('');
                }
              }}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {errors.category && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.category}
          </p>
        )}
      </div>
      
      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags (optional)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => handleInputChange('tags', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., monthly, primary, key (comma-separated)"
        />
        <p className="mt-1 text-xs text-gray-500">
          Separate multiple tags with commas
        </p>
      </div>
      
      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {kpi ? 'Update KPI' : 'Create KPI'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Modal Component
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  kpiName
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  kpiName: string;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete KPI">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-900">Are you sure?</h3>
            <p className="text-sm text-red-700">
              This action cannot be undone. This will permanently delete the KPI "{kpiName}" and all its historical data.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Yes, Delete KPI
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

// KPI Card Component
const KPICard = ({ kpi }: { kpi: KPI }) => {
  const { updateKPI, deleteKPI } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const handleEdit = (data: any) => {
    updateKPI(kpi.id, data);
    setShowEditModal(false);
  };
  
  const handleDelete = () => {
    deleteKPI(kpi.id);
    setShowDeleteModal(false);
  };
  
  const progress = (kpi.value / kpi.target) * 100;
  const isOnTrack = progress >= 80;
  
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{kpi.name}</h3>
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {kpi.category}
            </span>
          </div>
          <div className="flex gap-1 ml-4">
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {kpi.unitSymbol}{kpi.value.toLocaleString()}{kpi.unit === 'percentage' ? '%' : ''}
          </div>
          <div className="text-sm text-gray-600">
            Target: {kpi.unitSymbol}{kpi.target.toLocaleString()}{kpi.unit === 'percentage' ? '%' : ''}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className={`font-medium ${isOnTrack ? 'text-green-600' : 'text-orange-600'}`}>
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isOnTrack ? 'bg-green-600' : 'bg-orange-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className={`flex items-center gap-1 ${
            kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {kpi.trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : kpi.trend === 'down' ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            <span>{kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent}%</span>
          </div>
          
          {kpi.tags.length > 0 && (
            <div className="flex gap-1">
              {kpi.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {tag}
                </span>
              ))}
              {kpi.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{kpi.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        
        {kpi.history.length > 0 && (
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kpi.history}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={kpi.trend === 'up' ? '#16a34a' : kpi.trend === 'down' ? '#dc2626' : '#6b7280'}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit KPI"
      >
        <KPIForm
          kpi={kpi}
          onSubmit={handleEdit}
          onCancel={() => setShowEditModal(false)}
          categories={['Revenue', 'Marketing', 'Sales', 'Operations', 'Customer']}
        />
      </Modal>
      
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        kpiName={kpi.name}
      />
    </>
  );
};

// Main App Provider
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AppState>({
    user: initialUser,
    kpis: initialKPIs,
    integrations: initialIntegrations,
    categories: ['Revenue', 'Marketing', 'Sales', 'Operations', 'Customer'],
    isLoading: false,
    error: null
  });
  
  const addKPI = useCallback((kpiData: Omit<KPI, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newKPI: KPI = {
      ...kpiData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setState(prev => ({
      ...prev,
      kpis: [...prev.kpis, newKPI],
      categories: prev.categories.includes(newKPI.category) 
        ? prev.categories 
        : [...prev.categories, newKPI.category]
    }));
  }, []);
  
  const updateKPI = useCallback((id: string, updates: Partial<KPI>) => {
    setState(prev => ({
      ...prev,
      kpis: prev.kpis.map(kpi => 
        kpi.id === id 
          ? { ...kpi, ...updates, updatedAt: new Date().toISOString() }
          : kpi
      ),
      categories: updates.category && !prev.categories.includes(updates.category)
        ? [...prev.categories, updates.category]
        : prev.categories
    }));
  }, []);
  
  const deleteKPI = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      kpis: prev.kpis.filter(kpi => kpi.id !== id)
    }));
  }, []);
  
  const updateUser = useCallback((updates: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, ...updates }
    }));
  }, []);
  
  const addCategory = useCallback((category: string) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.includes(category) 
        ? prev.categories 
        : [...prev.categories, category]
    }));
  }, []);
  
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);
  
  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);
  
  const value: AppContextType = {
    ...state,
    addKPI,
    updateKPI,
    deleteKPI,
    updateUser,
    addCategory,
    setError,
    setLoading
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Toast Notification Component
const Toast = ({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose 
}: {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);
  
  if (!isVisible) return null;
  
  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  }[type];
  
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`}>
      <Check className="w-5 h-5" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Main Dashboard Component
const KPIDashboard = () => {
  const { kpis, categories, addKPI } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });
  
  const handleAddKPI = (data: any) => {
    addKPI(data);
    setShowAddModal(false);
    setToast({
      message: 'KPI created successfully!',
      type: 'success',
      isVisible: true
    });
  };
  
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type, isVisible: true });
  };
  
  return (
    <AppProvider>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">KPI Dashboard</h1>
            <p className="text-gray-600">Track and manage your key performance indicators</p>
          </div>