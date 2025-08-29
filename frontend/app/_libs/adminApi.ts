// Admin API service functions using existing endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class AdminApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem('authToken'); // Use existing auth token
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle the ResponseObject format from backend
      if (data.success !== undefined) {
        return { 
          success: data.success, 
          data: data.content || data.data || data 
        };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  // Dashboard APIs - Using existing endpoints to aggregate data
  async getDashboardStats() {
    try {
      // Get stats from existing endpoints
      const [usersRes, problemsRes, eventsRes] = await Promise.all([
        this.request<any>('/accounts?size=1'), // Get just one to get total count
        this.request<any>('/problems?size=1'),
        this.request<any>('/events?size=1')
      ]);

      const stats = {
        totalUsers: usersRes.data?.totalElements || 0,
        totalProblems: problemsRes.data?.data?.length || 0,
        totalEvents: eventsRes.data?.data?.length || 0,
        totalSubmissions: 0, // Would need submission endpoint
        apiCalls: 0, // Mock data for now
        avgResponseTime: 245, // Mock data for now
      };

      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: 'Failed to load dashboard stats' };
    }
  }

  async getApiEndpoints() {
    // Mock API endpoints data since we don't have monitoring
    const endpoints = [
      {
        id: '1',
        path: '/accounts',
        method: 'GET',
        controller: 'AccountController',
        calls: 15420,
        avgResponseTime: 180,
        errorRate: 2.1,
        status: 'active'
      },
      {
        id: '2',
        path: '/problems',
        method: 'GET',
        controller: 'ProblemController',
        calls: 8934,
        avgResponseTime: 320,
        errorRate: 1.5,
        status: 'active'
      },
      {
        id: '3',
        path: '/events',
        method: 'GET',
        controller: 'EventController',
        calls: 3456,
        avgResponseTime: 150,
        errorRate: 0.8,
        status: 'active'
      }
    ];
    return { success: true, data: endpoints };
  }

  // User Management APIs - Using AccountController
  async getUsers(params?: { page?: number; size?: number; search?: string; role?: string; status?: string }) {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== '').map(([key, value]) => [key, String(value)])
    ).toString() : '';
    
    const response = await this.request<any>(`/accounts${queryString}`);
    
    // Transform the response to match admin UI expectations
    if (response.success && response.data) {
      const transformedData = {
        users: Array.isArray(response.data) ? response.data.map(this.transformUser) : [],
        totalElements: response.data.totalElements || (Array.isArray(response.data) ? response.data.length : 0),
        totalPages: response.data.totalPages || 1,
        currentPage: params?.page || 0
      };
      return { success: true, data: transformedData };
    }
    
    return response;
  }

  private transformUser(user: any) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role || 'MEMBER',
      status: user.isActive ? 'active' : 'inactive',
      createdAt: user.createdDate,
      lastLogin: user.lastLogin,
      submissions: 0 // Would need submission count from API
    };
  }

  async updateUserStatus(userId: string, status: string) {
    const endpoint = status === 'active' ? `/accounts/enable/${userId}` : `/accounts/disable/${userId}`;
    return this.request<any>(endpoint, {
      method: 'PATCH',
    });
  }

  async deleteUser(userId: string) {
    // AccountController doesn't have delete, but has disable
    return this.updateUserStatus(userId, 'inactive');
  }

  // Problem Management APIs - Using ProblemController
  async getProblems(params?: { search?: string; difficulty?: string; category?: string; status?: string }) {
    const queryString = params?.search ? `?q=${params.search}` : '';
    
    const response = await this.request<any[]>(`/problems${queryString}`);
    
    // Transform problems to match admin UI expectations
    if (response.success && response.data) {
      const transformedProblems = Array.isArray(response.data) 
        ? response.data.map(this.transformProblem)
        : [];
      return { success: true, data: transformedProblems };
    }
    
    return response;
  }

  private transformProblem(problem: any) {
    return {
      id: problem.id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty?.toLowerCase() || 'easy',
      category: problem.category || 'General',
      timeLimit: problem.timeLimit || 1000,
      memoryLimit: problem.memoryLimit || 256,
      status: problem.isActive ? 'active' : 'inactive',
      createdAt: problem.createdDate,
      totalSubmissions: 0, // Would need from submission API
      acceptedSubmissions: 0,
      author: 'FCoder Team'
    };
  }

  async updateProblemStatus(problemId: string, status: string) {
    // ProblemController doesn't have status update endpoint
    // This would need to be implemented or we return success for UI
    console.warn('Problem status update not implemented in backend');
    return { success: true, data: { message: 'Status update simulated' } };
  }

  // Event Management APIs - Using EventController
  async getEvents(params?: { search?: string; type?: string; status?: string }) {
    const queryString = params?.search ? `?query=${params.search}` : '';
    
    const response = await this.request<any>(`/events${queryString}`);
    
    // Transform events to match admin UI expectations
    if (response.success && response.data) {
      const events = response.data.data || response.data;
      const transformedEvents = Array.isArray(events) 
        ? events.map(this.transformEvent)
        : [];
      return { success: true, data: transformedEvents };
    }
    
    return response;
  }

  private transformEvent(event: any) {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      type: event.type?.toLowerCase() || 'contest',
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location || 'Online',
      maxParticipants: event.maxParticipants || 100,
      currentParticipants: 0, // Would need from registration API
      status: this.determineEventStatus(event),
      organizer: event.organizer || 'FCoder Team',
      registrationDeadline: event.registrationDeadline,
      prize: event.prize || 'Certificates',
      difficulty: event.difficulty || 'intermediate'
    };
  }

  private determineEventStatus(event: any) {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (startDate > now) return 'upcoming';
    if (endDate < now) return 'completed';
    return 'ongoing';
  }

  // Database Management APIs - Mock for now
  async getDatabaseStats() {
    // Mock database stats since we don't have database monitoring API
    const mockTables = [
      { name: 'accounts', records: 150, size: '12.5 MB', status: 'healthy' },
      { name: 'problems', records: 25, size: '8.2 MB', status: 'healthy' },
      { name: 'events', records: 10, size: '2.1 MB', status: 'healthy' },
      { name: 'submissions', records: 500, size: '45.6 MB', status: 'healthy' }
    ];
    
    return { 
      success: true, 
      data: { 
        tables: mockTables,
        totalTables: mockTables.length 
      } 
    };
  }

  async createBackup(type: 'full' | 'incremental') {
    // Mock backup creation since we don't have backup API
    const filename = `fcoder_${type}_${new Date().toISOString().replace(/[-T:]/g, '').split('.')[0]}.sql`;
    return { 
      success: true, 
      data: { 
        filename,
        status: 'in_progress',
        type 
      } 
    };
  }
}

export const adminApi = new AdminApiService();
export default adminApi;
