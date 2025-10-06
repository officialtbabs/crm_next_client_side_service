import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const PREFIX = "/api/v1";
const HTTP_GATEWAY = `${BASE_URL}${PREFIX}`;

const defaultConfig: AxiosRequestConfig = {
  baseURL: HTTP_GATEWAY,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const httpClient = axios.create({ ...defaultConfig });
