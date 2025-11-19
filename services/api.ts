import { User, FinancialRecord, AttendanceRecord, Member, ActionItem } from '../types';

// --- MOCK DATA ---
const MOCK_USER: User = {
  id: 'u1',
  email: 'pastor@innovation.church',
  name: 'Rev. Cooper Levin',
  role: 'pastor',
  tenantId: 'tenant_123',
  avatarUrl: 'https://picsum.photos/seed/pastor/200/200'
};

const FINANCIAL_DATA: FinancialRecord[] = [
  { month: 'Jan', tithes: 12000, offerings: 4000, expenses: 10000 },
  { month: 'Feb', tithes: 13500, offerings: 4200, expenses: 11000 },
  { month: 'Mar', tithes: 11000, offerings: 3800, expenses: 9500 },
  { month: 'Apr', tithes: 14000, offerings: 5000, expenses: 12000 },
  { month: 'May', tithes: 18500, offerings: 6200, expenses: 13000 },
  { month: 'Jun', tithes: 16000, offerings: 5500, expenses: 11500 },
  { month: 'Jul', tithes: 15000, offerings: 5100, expenses: 11000 },
  { month: 'Aug', tithes: 13000, offerings: 4500, expenses: 10500 },
  { month: 'Sep', tithes: 14500, offerings: 4800, expenses: 11200 },
  { month: 'Oct', tithes: 15500, offerings: 5200, expenses: 11800 },
  { month: 'Nov', tithes: 17000, offerings: 6000, expenses: 12500 },
  { month: 'Dec', tithes: 22000, offerings: 8000, expenses: 15000 },
];

const ACTION_ITEMS: ActionItem[] = [
  {
    id: '1',
    type: 'counseling',
    status: 'Pending',
    date: '2023-10-25',
    requester: { id: 'm1', name: 'Anika Rosser', role: 'Worship Team', ministry: 'Music', status: 'Active', avatarUrl: 'https://picsum.photos/seed/anika/200/200' }
  },
  {
    id: '2',
    type: 'volunteer_signup',
    status: 'In Progress',
    date: '2023-10-24',
    requester: { id: 'm2', name: 'Charlie Korsgaard', role: 'Member', ministry: 'Tech', status: 'Active', avatarUrl: 'https://picsum.photos/seed/charlie/200/200' }
  },
  {
    id: '3',
    type: 'Prayer',
    status: 'Completed',
    date: '2023-10-22',
    requester: { id: 'm3', name: 'Livia Madsen', role: 'Usher', ministry: 'Hospitality', status: 'Active', avatarUrl: 'https://picsum.photos/seed/livia/200/200' }
  }
];

// --- SERVICE METHODS ---

// Login
export const login = async (email: string): Promise<User> => {
  // SUPABASE MIGRATION: 
  // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem('app_token', 'mock_token_123');
      resolve(MOCK_USER);
    }, 1000);
  });
};

// Check Auth
export const checkAuth = async (): Promise<User | null> => {
  // SUPABASE MIGRATION:
  // const { data: { user } } = await supabase.auth.getUser();
  
  const token = localStorage.getItem('app_token');
  if (token) return MOCK_USER;
  return null;
};

// Fetch Financials
export const getFinancials = async (tenantId: string): Promise<FinancialRecord[]> => {
  // SUPABASE MIGRATION:
  // await supabase.from('financials').select('*').eq('tenant_id', tenantId);
  
  return new Promise(resolve => setTimeout(() => resolve(FINANCIAL_DATA), 600));
};

// Fetch Actions
export const getActionItems = async (tenantId: string): Promise<ActionItem[]> => {
  // SUPABASE MIGRATION:
  // await supabase.from('actions').select('*, requester:members(*)').eq('tenant_id', tenantId);

  return new Promise(resolve => setTimeout(() => resolve(ACTION_ITEMS), 500));
};