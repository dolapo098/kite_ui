import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export class AxiosClientService {
  public axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });

    this.initializeRequestInterceptor();
    this.initializeResponseInterceptor();
  }

  private initializeRequestInterceptor() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const xsrfToken = this.getCookieValue('XSRF-TOKEN');
        if (xsrfToken) {
          config.headers = config.headers ?? {};
          (config.headers as Record<string, string>)['X-XSRF-TOKEN'] = xsrfToken;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  private initializeResponseInterceptor() {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              console.error('Bad request');
              break;
            case 401:
              console.warn('Unauthorized');
              break;
            case 403:
              console.warn('Forbidden');
              break;
            case 404:
              console.warn('Not found');
              break;
            case 500:
              console.error('Server error');
              break;
            default:
              console.error('Unexpected error', error.response);
          }
        } else if (error.request) {
          console.error('No response from server');
        } else {
          console.error('Request setup error', error.message);
        }
        return Promise.reject(error);
      },
    );
  }

  private getCookieValue(name: string): string | null {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }
}

export const axiosClientService = new AxiosClientService(API_URL);
export const axiosClient = axiosClientService.axiosInstance;
export const dataAxiosClient = new AxiosClientService(API_URL).axiosInstance;
