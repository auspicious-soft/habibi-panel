import { AxiosResponse } from "axios";
import { axiosInstance } from "./axios";

/**
 * GET
 */
export const getAPI = async <T>(
  url: string,
  params?: Record<string, any>
): Promise<T> => {
  const response: AxiosResponse<T> = await axiosInstance.get(url, { params });
  return response.data;
};

/**
 * POST
 */
export const postAPI = async <T, P = unknown>(
  url: string,
  payload?: P
): Promise<T> => {
  const response: AxiosResponse<T> = await axiosInstance.post(url, payload);
  return response.data;
};

/**
 * PUT
 */
export const putAPI = async <T, P = unknown>(
  url: string,
  payload?: P
): Promise<T> => {
  const response: AxiosResponse<T> = await axiosInstance.put(url, payload);
  return response.data;
};

/**
 * DELETE
 */
export const deleteAPI = async <T>(
  url: string
): Promise<T> => {
  const response: AxiosResponse<T> = await axiosInstance.delete(url);
  return response.data;
};
