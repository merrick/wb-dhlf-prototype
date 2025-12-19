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

  // Learning Modules
  async getLearningModules(params?: { search?: string; provider?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.provider) searchParams.append('provider', params.provider);

    const query = searchParams.toString();
    return this.request<LearningModule[]>(`/learning-modules${query ? `?${query}` : ''}`);
  }

  async getLearningModule(id: string) {
    return this.request<LearningModule>(`/learning-modules/${id}`);
  }

  async createLearningModule(learningModule: CreateLearningModuleRequest) {
    return this.request<LearningModule>('/learning-modules', {
      method: 'POST',
      body: JSON.stringify(learningModule),
    });
  }

  async updateLearningModule(id: string, learningModule: UpdateLearningModuleRequest) {
    return this.request<LearningModule>(`/learning-modules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(learningModule),
    });
  }

  async deleteLearningModule(id: string) {
    return this.request<void>(`/learning-modules/${id}`, {
      method: 'DELETE',
    });
  }

  // Mappings
  async parseMapping(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${API_BASE_URL}/mappings/parse`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to parse file');
    }

    return response.json() as Promise<MappingParseResponse>;
  }

  async saveMapping(data: SaveMappingRequest) {
    return this.request<SaveMappingResponse>('/mappings/save', {
      method: 'POST',
      body: JSON.stringify(data),
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

export interface LearningModule {
  learning_module_id: string;
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

export interface CreateLearningModuleRequest {
  title: string;
  description?: string;
  provider?: string;
  duration?: string;
  url?: string;
}

export interface UpdateLearningModuleRequest {
  title?: string;
  description?: string;
  provider?: string;
  duration?: string;
  url?: string;
}

export interface MappingPreview {
  excelRoleName: string;
  role: {
    roleId: string;
    roleCode: string;
    roleTitle: string;
    roleType: string;
  };
  competencyCount: number;
  validCompetencies: number;
  invalidCompetencies: number;
  invalidCodes: string[];
  validCodes: string[];
  existingMappingsCount: number;
  sheetName: string;
}

export interface MappingParseResponse {
  success: boolean;
  preview: MappingPreview;
}

export interface SaveMappingRequest {
  roleCode: string;
  competencyCodes: string[];
}

export interface SaveMappingResponse {
  success: boolean;
  message: string;
  mappingsCreated: number;
}