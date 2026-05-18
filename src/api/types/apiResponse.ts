export interface ApiResponse<T> {
  success?: boolean;
  error?: boolean;
  data?: T;
  message?: string;
  status?: number;
}
