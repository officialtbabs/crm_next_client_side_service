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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { getJobsApi } from "@/apis/jobs.api";
import { JobResponseData, JobStatus } from "@/lib/types";
import CustomBadge from "./custom-bagde";

export enum JobTableActions {
  createAppointment = "CREATE_APPOINTMENT",
  updateStatus = "UPDATE_STATUS",
  generateInvoice = "GENERATE_INVOICE",
  viewDetails = "VIEW_DETAILS",
}

export type ActiveJobTableDataAction = {
  id: string;
  action: JobTableActions;
};

type JobTableData = {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  createdAt: string;
};

function getTableColumns(
  onAction: (data: ActiveJobTableDataAction) => void
): ColumnDef<JobTableData>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <CustomBadge status={row.original.status} />,
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
                    action: JobTableActions.viewDetails,
                  })
                }
              >
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  onAction({
                    id: taskId,
                    action: JobTableActions.createAppointment,
                  })
                }
              >
                Create appointment
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  onAction({
                    id: taskId,
                    action: JobTableActions.updateStatus,
                  })
                }
              >
                Update status
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  onAction({
                    id: taskId,
                    action: JobTableActions.generateInvoice,
                  })
                }
              >
                Generate invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

interface JobsDataTableProps {
  setActiveTableAction: Dispatch<
    SetStateAction<ActiveJobTableDataAction | null>
  >;
}

const JobsDataTable = ({ setActiveTableAction }: JobsDataTableProps) => {
  const [data, setData] = useState<JobResponseData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getJobsCallbacks = useCallback(async () => {
    setIsLoading(true);

    try {
      const getJobsRes = await getJobsApi();

      if (getJobsRes.success) {
        setData(getJobsRes.data);
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

  const onActionClick = (data: ActiveJobTableDataAction) => {
    setActiveTableAction(data);
  };

  const columns = getTableColumns(onActionClick);

  useEffect(() => {
    getJobsCallbacks();
  }, [getJobsCallbacks]);

  return (
    <>
      <DataTable
        isLoading={isLoading}
        data={data ?? []}
        columns={columns}
        filterSearchBy="title"
      />
    </>
  );
};

export default JobsDataTable;
