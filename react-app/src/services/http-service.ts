import { AxiosInstance } from "axios";

interface Entity {
    id: number;
}

class HttpService {
  endpoint: string;
  apiClient: AxiosInstance;

  constructor(endpoint: string, apiClient: AxiosInstance) {
    this.endpoint = endpoint;
    this.apiClient = apiClient;
  }

  getAll<T>() {
    const controller = new AbortController();
    const request = this.apiClient.get<T[]>(this.endpoint, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  delete(id: number) {
    return this.apiClient.delete(`${this.endpoint}/${id}`);
  }

  add<T>(entity: T) {
    return this.apiClient.post(this.endpoint, entity);
  }

  update<T extends Entity>(entity: T) {
    return this.apiClient.patch(`${this.endpoint}/${entity.id}`, entity);
  }
}

const create = (endpoint: string, apiClient: AxiosInstance) => new HttpService(endpoint, apiClient);

export default create;
