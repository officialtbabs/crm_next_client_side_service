"use client";

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { getInvoicesApi } from "@/apis/invoices.api";
import { InvoiceResponseData } from "@/lib/types";

export enum InvoiceTableActions {
  collectPayment = "COLLECT_PAYMENT",
}

export type ActiveInvoiceTableDataAction = {
  id: string;
  action: InvoiceTableActions;
};

type InvoicesTableData = {
  id: string;
  jobId: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
};

function getTableColumns(
  onAction: (data: ActiveInvoiceTableDataAction) => void
): ColumnDef<InvoicesTableData>[] {
  return [
    {
      accessorKey: "jobId",
      header: "Job ID",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("jobId")}</div>
      ),
    },
    {
      accessorKey: "subtotal",
      header: "Subtotal",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("subtotal")}</div>
      ),
    },
    {
      accessorKey: "tax",
      header: "Tax",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("tax")}</div>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("total")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <div className="capitalize">
          {formatDate(row.getValue("createdAt"))}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const taskId = row.original.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs font-medium">
                Actions
              </DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() =>
                  onAction({
                    id: taskId,
                    action: InvoiceTableActions.collectPayment,
                  })
                }
              >
                Collect payment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

interface InvoicesDataTableProps {
  setActiveTableAction: Dispatch<
    SetStateAction<ActiveInvoiceTableDataAction | null>
  >;
}

const InvoicesDataTable = ({
  setActiveTableAction,
}: InvoicesDataTableProps) => {
  const [data, setData] = useState<InvoiceResponseData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getInvoicesCallbacks = useCallback(async () => {
    setIsLoading(true);

    try {
      const getInvoicesRes = await getInvoicesApi();

      if (getInvoicesRes.success) {
        setData(getInvoicesRes.data);
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
  }, []);

  const onActionClick = (data: ActiveInvoiceTableDataAction) => {
    setActiveTableAction(data);
  };

  const columns = getTableColumns(onActionClick);

  useEffect(() => {
    getInvoicesCallbacks();
  }, [getInvoicesCallbacks]);

  return (
    <>
      <DataTable
        isLoading={isLoading}
        data={data ?? []}
        columns={columns}
        filterSearchBy="jobId"
      />
    </>
  );
};

export default InvoicesDataTable;
