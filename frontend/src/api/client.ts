/**
 * API Client
 * Version: 1.0.0
 */

const API_BASE_URL = '/api';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Domains
  async getDomains() {
    return this.request<Domain[]>('/domains');
  }

  async getDomain(id: string) {
    return this.request<Domain>(`/domains/${id}`);
  }

  async getSubdomains(domainId: string) {
    return this.request<Subdomain[]>(`/domains/${domainId}/subdomains`);
  }

  // Competencies
  async getCompetencies(params?: {
    search?: string;
    subdomain_id?: string;
    domain_id?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.subdomain_id) searchParams.append('subdomain_id', params.subdomain_id);
    if (params?.domain_id) searchParams.append('domain_id', params.domain_id);
    
    const query = searchParams.toString();
    return this.request<CompetencyWithContext[]>(`/competencies${query ? `?${query}` : ''}`);
  }

  async getCompetency(id: string) {
    return this.request<CompetencyWithDetails>(`/competencies/${id}`);
  }

  // Roles
  async getRoles(params?: { search?: string; type?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.type) searchParams.append('type', params.type);
    
    const query = searchParams.toString();
    return this.request<Role[]>(`/roles${query ? `?${query}` : ''}`);
  }

  async getRole(id: string) {
    return this.request<Role>(`/roles/${id}`);
  }

  async createRole(role: CreateRoleRequest) {
    return this.request<Role>('/roles', {
      method: 'POST',
      body: JSON.stringify(role),
    });
  }

  async updateRole(id: string, role: UpdateRoleRequest) {
    return this.request<Role>(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(role),
    });
  }

  async deleteRole(id: string) {
    return this.request<void>(`/roles/${id}`, {
      method: 'DELETE',
    });
  }

  async getRoleCompetencies(roleId: string) {
    return this.request<RoleCompetencyWithDetails[]>(`/roles/${roleId}/competencies`);
  }

  async mapCompetenciesToRole(roleId: string, mapping: {
    competency_ids: string[];
    proficiency_level?: string;
    notes?: string;
  }) {
    return this.request<{ message: string; count: number }>(`/roles/${roleId}/competencies`, {
      method: 'POST',
      body: JSON.stringify(mapping),
    });
  }

  async removeCompetencyFromRole(roleId: string, competencyId: string) {
    return this.request<void>(`/roles/${roleId}/competencies/${competencyId}`, {
      method: 'DELETE',
    });
  }

  // Courses
  async getCourses(params?: { search?: string; provider?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.provider) searchParams.append('provider', params.provider);
    
    const query = searchParams.toString();
    return this.request<Course[]>(`/courses${query ? `?${query}` : ''}`);
  }

  async getCourse(id: string) {
    return this.request<Course>(`/courses/${id}`);
  }

  async createCourse(course: CreateCourseRequest) {
    return this.request<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(course),
    });
  }

  async updateCourse(id: string, course: UpdateCourseRequest) {
    return this.request<Course>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(course),
    });
  }

  async deleteCourse(id: string) {
    return this.request<void>(`/courses/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();

// Type definitions
export interface Domain {
  domain_id: string;
  domain_code: string;
  domain_name: string;
  domain_title: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Subdomain {
  subdomain_id: string;
  domain_id: string;
  subdomain_code: string;
  subdomain_name: string;
  subdomain_title: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Competency {
  competency_id: string;
  subdomain_id: string;
  competency_code: string;
  competency_title: string;
  competency_statement?: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CompetencyWithContext extends Competency {
  subdomain_name: string;
  subdomain_title: string;
  domain_id: string;
  domain_name: string;
  domain_title: string;
}

export interface PerformanceCriteria {
  criteria_id: string;
  competency_id: string;
  criteria_text: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CompetencyWithDetails extends CompetencyWithContext {
  performance_criteria: PerformanceCriteria[];
}

export interface Role {
  role_id: string;
  role_code: string;
  role_title: string;
  role_type: string;
  role_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RoleCompetencyWithDetails {
  role_competency_id: string;
  competency_id: string;
  competency_code: string;
  competency_title: string;
  competency_statement?: string;
  proficiency_level: string;
  is_required: boolean;
  notes?: string;
  subdomain_name: string;
  domain_name: string;
}

export interface Course {
  course_id: string;
  title: string;
  description?: string;
  provider?: string;
  duration?: string;
  url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRoleRequest {
  role_code: string;
  role_title: string;
  role_type: string;
  role_description?: string;
}

export interface UpdateRoleRequest {
  role_code?: string;
  role_title?: string;
  role_type?: string;
  role_description?: string;
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  provider?: string;
  duration?: string;
  url?: string;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  provider?: string;
  duration?: string;
  url?: string;
}