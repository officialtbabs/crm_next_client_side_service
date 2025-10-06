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
import { getCustomersApi } from "@/apis/customers.api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { CustomerResponseData } from "@/lib/types";

export enum CustomerTableActions {
  createJob = "CREATE_JOB",
}

export type ActiveCustomerTableDataAction = {
  id: string;
  action: CustomerTableActions;
};

export type CustomerTableData = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
};

function getTableColumns(
  onAction: (data: ActiveCustomerTableDataAction) => void
): ColumnDef<CustomerTableData>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone No.",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("phone")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("address")}</div>
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
                    action: CustomerTableActions.createJob,
                  })
                }
              >
                Create Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

interface CustomersDataTableProps {
  setActiveTableAction: Dispatch<
    SetStateAction<ActiveCustomerTableDataAction | null>
  >;
}

const CustomersDataTable = ({
  setActiveTableAction,
}: CustomersDataTableProps) => {
  const [data, setData] = useState<CustomerResponseData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCustomersCallbacks = useCallback(async () => {
    setIsLoading(true);

    try {
      const getCustomersRes = await getCustomersApi();

      if (getCustomersRes.success) {
        setData(getCustomersRes.data);
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

  const onActionClick = async (data: ActiveCustomerTableDataAction) => {
    setActiveTableAction(data);
    console.log(data)
  };

  const columns = getTableColumns(onActionClick);

  useEffect(() => {
    getCustomersCallbacks();
  }, [getCustomersCallbacks]);

  return (
    <>
      <DataTable
        isLoading={isLoading}
        data={data ?? []}
        columns={columns}
        filterSearchBy="name"
      />
    </>
  );
};

export default CustomersDataTable;
