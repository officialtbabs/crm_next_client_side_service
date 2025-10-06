"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { displayFormErrors } from "@/lib/utils";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ActiveInvoiceTableDataAction } from "./invoices-data-table";
import { recordPaymentApi } from "@/apis/invoices.api";
import { Input } from "./ui/input";

interface RecordPaymentFormDialogProps {
  activeTableId: string;
  setActiveTableAction: Dispatch<
    SetStateAction<ActiveInvoiceTableDataAction | null>
  >;
  isOpened: boolean;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
}

export interface RecordPaymentRequestDto {
  amount: number;
}

const RecordPaymentFormDialog = ({
  activeTableId,
  setActiveTableAction,
  isOpened,
  setIsOpened,
}: RecordPaymentFormDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecordPaymentRequestDto>();

  const [isLoading, setIsLoading] = useState(false);

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpened(false);
      setActiveTableAction(null);
      reset();
    } else setIsOpened(true);
  };

  const onSubmitHandler: SubmitHandler<RecordPaymentRequestDto> = async (
    values
  ) => {
    setIsLoading(true);

    try {
      const recordPaymentRes = await recordPaymentApi(activeTableId, values);

      if (recordPaymentRes.success) {
        toast.success(recordPaymentRes.message);
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
              Record payment
            </DialogTitle>
            <DialogDescription>
              Fill the amount below to record a payment
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4 pb-0 px-10">
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <div className="flex flex-col gap-6">
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: {
                      message: "Amount is required",
                      value: true,
                    },
                    min: {
                      message: "Please enter a non-negative amount ",
                      value: 1,
                    },
                  }}
                  render={({ field: { value, onChange } }) => (
                    <div className="grid gap-3">
                      <Label className="font-semibold">Amount</Label>

                      <Input
                        id="amount"
                        type="number"
                        placeholder=""
                        value={(value ?? 0).toString()}
                        onChange={(e) => {
                          onChange(Number(e.target.value));
                        }}
                      />
                    </div>
                  )}
                />

                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading ? (
                    <span className="animate-pulse">Recording...</span>
                  ) : (
                    "Record"
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

export default RecordPaymentFormDialog;
