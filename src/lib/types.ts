export interface FormData {
  country: string;
  industry: string;
  product: string;
  identity: string;
  purpose: string;
}

export interface SearchSource {
  title: string;
  url: string;
  snippet: string;
}

export interface ReportRecord {
  id: string;
  title: string;
  country: string;
  industry: string;
  product: string;
  role: string;
  purpose: string;
  reportText: string;
  createdAt: string;
  mode?: string;
  model?: string;
  warning?: string;
  provider?: string;
  generationMode?: string;
  webSearchEnabled?: boolean;
  sources?: SearchSource[];
}

export interface ApiSuccessResponse {
  success: true;
  reportText: string;
  provider?: string;
  model?: string;
  generationMode?: string;
  webSearchEnabled?: boolean;
  generatedAt?: string;
  sources?: SearchSource[];
  mode?: string;
  warning?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;
