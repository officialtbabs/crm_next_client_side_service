import { CreateJobRequestDto } from "@/components/create-job-form-drawer";
import { httpClient } from "./setup";
import { CreateJobAppointmentRequestDto } from "@/components/create-job-appointment-form-drawer";
import { UpdateJobStatusRequestDto } from "@/components/update-job-status-form-dialog";
import { GenerateJobInvoiceRequestDto } from "@/components/generate-job-invoice-form-drawer";
import { SingleJobApiResponse, GetJobsApiResponse } from "@/lib/types";
import { AxiosResponse } from "axios";

export const createJobApi = async (
  data: CreateJobRequestDto
): Promise<SingleJobApiResponse> => {
  return (
    await httpClient.post<
      SingleJobApiResponse,
      AxiosResponse<SingleJobApiResponse>
    >("/jobs", data)
  ).data;
};

export const getJobsApi = async (): Promise<GetJobsApiResponse> => {
  return (
    await httpClient.get<GetJobsApiResponse, AxiosResponse<GetJobsApiResponse>>(
      "/jobs"
    )
  ).data;
};

export const createJobAppointmentApi = async (
  jobId: string,
  data: CreateJobAppointmentRequestDto
) => {
  return (await httpClient.post(`/jobs/${jobId}/appointments`, data)).data;
};

export const updateJobStatusApi = async (
  jobId: string,
  data: UpdateJobStatusRequestDto
) => {
  return (await httpClient.patch(`/jobs/${jobId}/status`, data)).data;
};

export const createJobInvoiceApi = async (
  jobId: string,
  data: GenerateJobInvoiceRequestDto
) => {
  return (await httpClient.post(`/jobs/${jobId}/invoice`, data)).data;
};

export const getJobDetailsByJobIdApi = async (
  jobId: string
): Promise<SingleJobApiResponse> => {
  return (
    await httpClient.get<
      SingleJobApiResponse,
      AxiosResponse<SingleJobApiResponse>
    >(`/jobs/${jobId}`)
  ).data;
};
