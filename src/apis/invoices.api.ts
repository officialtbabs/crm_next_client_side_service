import { RecordPaymentRequestDto } from "@/components/record-payment-form-dialog";
import { httpClient } from "./setup";
import { GetInvoicesApiResponse } from "@/lib/types";
import { AxiosResponse } from "axios";

export const getInvoicesApi = async (): Promise<GetInvoicesApiResponse> => {
  return (
    await httpClient.get<
      GetInvoicesApiResponse,
      AxiosResponse<GetInvoicesApiResponse>
    >("/invoices")
  ).data;
};

export const recordPaymentApi = async (
  invoiceId: string,
  data: RecordPaymentRequestDto
) => {
  return (await httpClient.post(`/invoices/${invoiceId}/payments`, data)).data;
};
