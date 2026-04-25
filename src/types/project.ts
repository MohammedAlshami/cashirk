export enum TakeoverDocumentType {
  CONDITIONAL_VOLUNTARY = 'conditional_voluntary',
  UNCONDITIONAL_VOLUNTARY = 'unconditional_voluntary',
  CONDITIONAL_MANDATORY = 'conditional_mandatory',
  UNCONDITIONAL_MANDATORY = 'unconditional_mandatory',
}

export interface ProjectFile {
  file_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  s3_url: string;
  uploaded_at: string;
  metadata: Record<string, any>;
}

export interface Variable {
  id: string;
  name: string;
  value: string;
}

export interface ProjectQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: 'pending' | 'answered' | 'skipped';
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export interface Project {
  project_id: string;
  title: string;
  description?: string;
  company: string;
  takeover_document_type: TakeoverDocumentType;
  metadata: Record<string, any>;
  owner_id: string;
  created_at: string;
  updated_at: string;
  files: ProjectFile[];
  questions: ProjectQuestion[];
  variables: Variable[];
}

export interface ProjectCreateRequest {
  title: string;
  description?: string;
  company: string;
  takeover_document_type?: TakeoverDocumentType;
  metadata?: Record<string, any>;
}

export interface ProjectUpdateRequest {
  title?: string;
  description?: string;
  company?: string;
  metadata?: Record<string, any>;
}

export interface ProjectSearchRequest {
  query?: string;
  page?: number;
  page_size?: number;
}

export interface ProjectListResponse {
  projects: Project[];
  total_count: number;
  page: number;
  page_size: number;
  has_next: boolean;
}
