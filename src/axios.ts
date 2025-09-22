/* eslint-disable no-unused-vars */
import axios from 'axios';
import type {AxiosInstance, AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse} from 'axios'
import { getAccessToken, getRefreshToken } from '@/utils/sessionStorage';
import { useLoadingStore } from '@/portalStores/loading';
import { useAuthStore } from './portalStores/auth';

let isRefreshing = false; // 현재 토큰 갱신 중인지 확인하는 플래그
let failedQueue: any[] = [];     // 갱신이 진행 중일 때 대기 중인 요청을 저장할 큐

// 실패한 요청을 큐에 넣고 나중에 다시 실행
const processQueue = (error: any, token = '') => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
interface CustomInstance extends AxiosInstance {
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
  getUri(config?: AxiosRequestConfig): string;
  request<T>(config: AxiosRequestConfig): Promise<T>;
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  head<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  options<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}

const axiosInstance: CustomInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  },
  withCredentials: true,
  timeout: 60000
});

axiosInstance.interceptors.request.use(
  function (config) {
    const LoadingStore = useLoadingStore();
    if (config.useLoading) {
      // useLoading이 true 일때마다 loading count 증가
      LoadingStore.addLoadingCount();
    }

    // loadingCount가 1 일때만 loading 화면 호출 -> 여러번 켜지지 않도록
    if (LoadingStore.getLoadingCount() === 1) {
      LoadingStore.setLoading(true);
    }

    config.headers = {
      'X-APIVERSION': '1.0.0',
      'X-APPID': 'svcfw',
      ...config.headers
    };

    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers = {
        'Authorization': `bearer ${accessToken}`,
        ...config.headers
      };
    }
    if (config.params) {
      convertGetParam(config.params, config.url);
    }
    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response: any) {
    const LoadingStore = useLoadingStore();
    // response 될 때마다 loadingCount 감소
    LoadingStore.reduceLoadingCount();
    // loading 화면 노출 여부가 true면서 loadingCount가 0일때 loading 화면 노출 여부 false 로 변경
    if (LoadingStore.getLoading() && LoadingStore.getLoadingCount() === 0) {
      LoadingStore.setLoading(false);
    }
    return response;
  },
  async function (error: any) {
    const LoadingStore = useLoadingStore();
    const authStore = useAuthStore();
    if (LoadingStore.getLoading()) {
      LoadingStore.setLoading(false);
    }

      const originalRequest = error.config; // 원래 요청 저장

      // 무한 재시도 방지: 토큰 갱신 후에도 401이 계속 발생하면 재시도 하지 않음
      if (originalRequest._retry) {
          return Promise.reject(error); // 재시도한 요청이 실패하면 에러 그대로 반환
      }

      if (error.response && error.response.status === 401 && !originalRequest.url.includes('login')) {
          if (originalRequest._retry) {
              return Promise.reject(error); // 이미 재시도한 요청일 경우 중단
          }

          // 첫 번째 실패: 요청 재시도를 위한 플래그 설정
          originalRequest._retry = true;

          // 이미 갱신 중인 경우, 기존 갱신 요청이 완료될 때까지 대기
          if (isRefreshing) {
              return new Promise((resolve, reject) => {
                  failedQueue.push({ resolve, reject });
              }).then(token => {
                  originalRequest.headers['Authorization'] = `Bearer ${token}`;
                  return axiosInstance(originalRequest);
              }).catch(err => {
                  return Promise.reject(err);
              });
          }

          // 새로 갱신을 시도
          isRefreshing = true;

          try {
              await authStore.tokenRefresh(`${getRefreshToken()}`);

              processQueue(null, `${getAccessToken()}`); // 실패한 요청을 큐에서 처리
              isRefreshing = false;

              originalRequest.headers['Authorization'] = `Bearer ${getAccessToken()}`;
              return axiosInstance(originalRequest); // 원래 요청을 다시 보냄
          } catch (refreshError) {
              processQueue(refreshError, null); // 갱신 실패 시 큐에 있는 요청들에 에러 전달
              isRefreshing = false;
              return Promise.reject(refreshError); // 갱신 실패 시 전체 에러 반환
          }
      }


    return Promise.reject(error);
  }
);
// 서버 형식의 param으로 변경하기 위한 함수
const convertGetParam = (params: any, url: string) => {
  params.pageNumber = params.pageNumber ? params.pageNumber - 1 : 0;
  if (params && params.searchKey && params.searchText) {
    params[params.searchKey] = params.searchText;
  }
  delete params.searchKey;
  if (!url.includes('sysm/log/audit')) delete params.searchText;
};
export default axiosInstance;
