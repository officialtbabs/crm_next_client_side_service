import { AxiosResponse } from "axios";
import { httpClient } from "./setup";
import {
  CreateCustomerApiResponse,
  GetCustomersApiResponse,
} from "@/lib/types";
import { CreateCustomerRequestDto } from "@/components/create-customer-form-drawer";

export const createCustomersApi = async (
  data: CreateCustomerRequestDto
): Promise<CreateCustomerApiResponse> => {
  return (
    await httpClient.post<
      CreateCustomerApiResponse,
      AxiosResponse<CreateCustomerApiResponse>
    >("/customers", data)
  ).data;
};

export const getCustomersApi = async (): Promise<GetCustomersApiResponse> => {
  return (
    await httpClient.get<
      GetCustomersApiResponse,
      AxiosResponse<GetCustomersApiResponse>
    >("/customers")
  ).data;
};
