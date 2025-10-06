"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatDate } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ActiveJobTableDataAction } from "./jobs-data-table";
import { getJobDetailsByJobIdApi } from "@/apis/jobs.api";
import { JobResponseData, JobStatus } from "@/lib/types";
import CustomBadge from "./custom-bagde";

interface JobDetailsDrawerProps {
  activeTableId: string;
  setActiveTableAction: Dispatch<
    SetStateAction<ActiveJobTableDataAction | null>
  >;
  isOpened: boolean;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
}

export interface CreateCustomerRequestDto {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const JobDetailsDrawer = ({
  activeTableId,
  setActiveTableAction,
  isOpened,
  setIsOpened,
}: JobDetailsDrawerProps) => {
  const isMobile = useIsMobile();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<JobResponseData | null>(null);

  const handleOnOpenChangeCallback = useCallback(
    (open: boolean) => {
      if (!open) {
        setIsOpened(false);
        setActiveTableAction(null);
      } else setIsOpened(true);
    },
    [setIsOpened, setActiveTableAction]
  );

  const getJobDetailsCallback = useCallback(async () => {
    if (activeTableId) {
      setIsLoading(true);

      try {
        const getJobDetailsRes = await getJobDetailsByJobIdApi(activeTableId);

        if (getJobDetailsRes.success) {
          setData(getJobDetailsRes.data);
          console.log(getJobDetailsRes);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          const { message } = error.response?.data;
          toast.error(Array.isArray(message) ? message[0] : message);
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    }
  }, [activeTableId]);

  useEffect(() => {
    getJobDetailsCallback();
  }, [getJobDetailsCallback]);

  return (
    <Drawer
      open={isOpened}
      onOpenChange={handleOnOpenChangeCallback}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerPortal>
        <DrawerContent className="w-full md:min-w-xl">
          <div className="w-full max-h-full py-10 overflow-y-auto">
            <DrawerHeader className="px-10">
              <DrawerTitle className="text-xl font-bold">
                Job details
              </DrawerTitle>
              <DrawerDescription>
                Detailed information for a job below
              </DrawerDescription>
            </DrawerHeader>

            <div className="pt-4 pb-0 px-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2 font-medium">
                  <h5 className="text-sm text-dimGrey">Job ID</h5>
                  <p>{data?.id ?? "N/A"}</p>
                </div>

                <div className="space-y-2 font-medium">
                  <h5 className="text-sm text-dimGrey">Title</h5>
                  <p>{data?.title ?? "N/A"}</p>
                </div>

                <div className="space-y-2 font-medium">
                  <h5 className="text-sm text-dimGrey">Status</h5>
                  <CustomBadge status={data?.status ?? JobStatus.new} />
                </div>

                <div className="col-span-2 space-y-2 font-medium">
                  <h5 className="text-sm text-dimGrey">Description</h5>
                  <p>{data?.description ?? "N/A"}</p>
                </div>
              </div>

              <div className="flex w-full mt-6 flex-col gap-6">
                <Tabs defaultValue="customer">
                  <TabsList className="mb-4">
                    <TabsTrigger value="customer">Customer</TabsTrigger>
                    <TabsTrigger value="appointment">Appointment</TabsTrigger>
                    <TabsTrigger value="invoice">Invoice</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="customer">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 space-y-2 font-medium">
                        <h5 className="text-sm text-dimGrey">
                          Customer&apos;s Name
                        </h5>
                        <p>{data?.customer?.name ?? "N/A"}</p>
                      </div>

                      <div className="space-y-2 font-medium">
                        <h5 className="text-sm text-dimGrey">
                          Customer&apos;s Email
                        </h5>
                        <p>{data?.customer?.email ?? "N/A"}</p>
                      </div>

                      <div className="space-y-2 font-medium">
                        <h5 className="text-sm text-dimGrey">
                          Customer&apos;s Phone No.
                        </h5>
                        <p>{data?.customer?.phone ?? "N/A"}</p>
                      </div>

                      <div className="col-span-2 space-y-2 font-medium">
                        <h5 className="text-sm text-dimGrey">
                          Customer&apos;s Address.
                        </h5>
                        <p>{data?.customer?.address ?? "N/A"}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="appointment">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 space-y-2 font-medium">
                        <h5 className="text-sm text-dimGrey">
                          Technician&apos;s Name
                        </h5>
                        <p>{data?.appointment?.technician?.name ?? "N/A"}</p>
                      </div>

                      <div className="space-y-2 font-medium">
                        <h5 className="text-sm text-dimGrey">Start Time</h5>
                        <p>
                          {data?.appointment?.start
                            ? formatDate(data?.appointment.start)
                            : "N/A"}
                        </p>
                      </div>

                      <div className="space-y-2 font-medium">
                        <h5 className="text-sm text-dimGrey">End Time</h5>
                        <p>
                          {data?.appointment?.end
                            ? formatDate(data?.appointment.end)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="invoice">
                    <div>
                      <Table>
                        {/* <TableCaption>
                            A list of your recent invoices.
                          </TableCaption>  */}
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data?.invoice?.items &&
                            data.invoice.items.map((invoice) => (
                              <TableRow key={invoice.id}>
                                <TableCell className="font-medium">
                                  {invoice.description ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {invoice.quantity ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {invoice.unitPrice ?? "N/A"}
                                </TableCell>
                                <TableCell className="text-right">
                                  {invoice.total ?? "N/A"}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell colSpan={3}>Sub total + Tax</TableCell>
                            <TableCell className="text-right">
                              <p>
                                {data?.invoice
                                  ? `${data.invoice.subtotal} + ${data.invoice.tax}`
                                  : "N/A"}
                              </p>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className="text-right">
                              <p>
                                {data?.invoice ? data.invoice.total : "N/A"}
                              </p>
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="payments">
                    <div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Amount</TableHead>
                            <TableHead>Paid At</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data?.invoice?.payments &&
                            data.invoice.payments.map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell className="font-medium">
                                  <p className="text-wrap">
                                    {payment.amount ?? "N/A"}
                                  </p>
                                </TableCell>
                                <TableCell>
                                  {payment.createdAt
                                    ? formatDate(payment.createdAt)
                                    : "N/A"}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="history">
                    <div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Note</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Create At</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data?.history &&
                            data.history.map((hist) => (
                              <TableRow key={hist.id}>
                                <TableCell className="font-medium">
                                  <p className="text-wrap">
                                    {hist.note ?? "N/A"}
                                  </p>
                                </TableCell>
                                <TableCell>
                                  {hist.status ? (
                                    <CustomBadge status={hist.status} />
                                  ) : (
                                    "N/A"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {hist.createdAt
                                    ? formatDate(hist.createdAt)
                                    : "N/A"}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            <DrawerFooter className="px-10">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
};

export default JobDetailsDrawer;
