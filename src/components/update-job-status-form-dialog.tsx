"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { displayFormErrors } from "@/lib/utils";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { updateJobStatusApi } from "@/apis/jobs.api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ActiveJobTableDataAction } from "./jobs-data-table";
import { JobStatus } from "@/lib/types";

interface UpdateJobStatusFormDialogProps {
  activeTableId: string;
  setActiveTableAction: Dispatch<
    SetStateAction<ActiveJobTableDataAction | null>
  >;
  isOpened: boolean;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
}

export interface UpdateJobStatusRequestDto {
  status: JobStatus;
}

const UpdateJobStatusFormDialog = ({
  activeTableId,
  setActiveTableAction,
  isOpened,
  setIsOpened,
}: UpdateJobStatusFormDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateJobStatusRequestDto>();

  const [isLoading, setIsLoading] = useState(false);

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpened(false);
      setActiveTableAction(null);
      reset();
    } else setIsOpened(true);
  };

  const onSubmitHandler: SubmitHandler<UpdateJobStatusRequestDto> = async (
    values
  ) => {
    setIsLoading(true);

    try {
      const updateJobRes = await updateJobStatusApi(activeTableId, values);

      if (updateJobRes.success) {
        toast.success(updateJobRes.message);
        handleOnOpenChange(false);
        location.reload();
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
  };

  useEffect(() => {
    displayFormErrors(errors);
  }, [errors]);

  return (
    <Dialog open={isOpened} onOpenChange={handleOnOpenChange}>
      <DialogContent className="w-full">
        <div className="w-full py-10 overflow-y-auto">
          <DialogHeader className="px-10">
            <DialogTitle className="text-xl font-bold">
              Update status
            </DialogTitle>
            <DialogDescription>Update job status to done</DialogDescription>
          </DialogHeader>

          <div className="pt-4 pb-0 px-10">
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <div className="flex flex-col gap-6">
                <Controller
                  name="status"
                  control={control}
                  rules={{
                    required: {
                      message: "Please select a status",
                      value: true,
                    },
                  }}
                  render={({ field }) => (
                    <div className="grid gap-3">
                      <Label className="font-semibold">Title</Label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={JobStatus.done}>Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />

                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading ? (
                    <span className="animate-pulse">Updating...</span>
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateJobStatusFormDialog;
