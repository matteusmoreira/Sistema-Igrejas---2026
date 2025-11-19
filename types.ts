// Auth & User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'pastor' | 'volunteer';
  tenantId: string; // Critical for Multi-Tenant
  avatarUrl?: string;
}

// Domain Types
export interface Member {
  id: string;
  name: string;
  role: string; // e.g., Worship Team, Usher
  ministry: string;
  status: 'Active' | 'Inactive' | 'Pending';
  avatarUrl: string;
  lastAttendance?: string;
}

export interface FinancialRecord {
  month: string;
  tithes: number;
  offerings: number;
  expenses: number;
}

export interface AttendanceRecord {
  date: string;
  mainService: number;
  kids: number;
  online: number;
}

export interface ActionItem {
  id: string;
  type: 'Prayer' | 'counseling' | 'volunteer_signup';
  requester: Member;
  status: 'Pending' | 'In Progress' | 'Completed';
  date: string;
}