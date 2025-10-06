type ApiResponseData<T> = {
  success: boolean;
  statusCode: number;
  message: string | string[];
  data: T;
};

export type CustomerResponseData = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateCustomerApiResponse = ApiResponseData<CustomerResponseData>;
export type GetCustomersApiResponse = ApiResponseData<CustomerResponseData[]>;

export type TechnicianResponseData = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export enum JobStatus {
  new = "NEW",
  scheduled = "SCHEDULED",
  done = "DONE",
  invoiced = "INVOICED",
  paid = "PAID",
}

export type JobResponseData = {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  history: JobHistoryResponseData[];
  customerId: string;
  createdAt: string;
  updatedAt: string;
  customer?: CustomerResponseData;
  appointment?: AppointmentResponseData;
  invoice?: InvoiceResponseData;
};

export type SingleJobApiResponse = ApiResponseData<JobResponseData>;
export type GetJobsApiResponse = ApiResponseData<JobResponseData[]>;

export type AppointmentResponseData = {
  id: string;
  start: string;
  end: string;
  jobId: string;
  technicianId: string;
  createdAt: string;
  updatedAt: string;
  job?: JobResponseData;
  technician?: TechnicianResponseData;
};

export type InvoiceItemResponseData = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  invoiceId: string;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceResponseData = {
  id: string;
  subtotal: number;
  tax: number;
  total: number;
  jobId: string;
  createdAt: string;
  updatedAt: string;
  items?: InvoiceItemResponseData[];
  payments?: PaymentResponseData[];
};

export type GetInvoicesApiResponse = ApiResponseData<InvoiceResponseData[]>;

export type PaymentResponseData = {
  id: string;
  amount: number;
  invoiceId: string;
  createdAt: string;
  updatedAt: string;
};

export type JobHistoryResponseData = {
  id: string;
  jobId: string;
  status: JobStatus;
  note: string;
  createdAt: string;
  updatedAt: string;
};
