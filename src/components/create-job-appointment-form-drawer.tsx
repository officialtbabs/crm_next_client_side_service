"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { displayFormErrors } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { createJobAppointmentApi } from "@/apis/jobs.api";
import { DateTimePicker } from "./ui/date-time-picker";
import { ActiveJobTableDataAction } from "./jobs-data-table";

interface CreateJobsFromDrawerProps {
  activeTableId: string;
  setActiveTableAction: Dispatch<
    SetStateAction<ActiveJobTableDataAction | null>
  >;
  isOpened: boolean;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
}

export interface CreateJobAppointmentRequestDto {
  technicianId: string;
  start: Date;
  end: Date;
}

const CreateJobAppointmentFormDrawer = ({
  activeTableId,
  setActiveTableAction,
  isOpened,
  setIsOpened,
}: CreateJobsFromDrawerProps) => {
  const isMobile = useIsMobile();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateJobAppointmentRequestDto>({
    defaultValues: {
      technicianId: "92bc23b9-92e5-4eda-b3eb-3a2e6d2f240a",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpened(false);
      setActiveTableAction(null);
      reset();
    } else setIsOpened(true);
  };

  const onSubmitHandler: SubmitHandler<CreateJobAppointmentRequestDto> = async (
    values
  ) => {
    setIsLoading(true);

    try {
      const createJobAppointmentRes = await createJobAppointmentApi(
        activeTableId,
        values
      );

      if (createJobAppointmentRes.success) {
        toast.success(createJobAppointmentRes.message);
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
    <Drawer
      open={isOpened}
      onOpenChange={handleOnOpenChange}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerPortal>
        <DrawerContent className="w-full md:min-w-xl">
          <div className="w-full max-h-full py-10 overflow-y-auto">
            <DrawerHeader className="px-10">
              <DrawerTitle className="text-xl font-bold">
                Create appointment
              </DrawerTitle>
              <DrawerDescription>
                Fill out the appointment details below
              </DrawerDescription>
            </DrawerHeader>

            <div className="pt-4 pb-0 px-10">
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="flex flex-col gap-6">
                  <Controller
                    name="start"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { value, onChange } }) => (
                      <div className="grid gap-3">
                        <Label className="font-semibold">Start time</Label>
                        <DateTimePicker date={value} onChange={onChange} />
                      </div>
                    )}
                  />

                  <Controller
                    name="end"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <div className="grid gap-3">
                        <Label className="font-semibold">End time</Label>

                        <DateTimePicker date={value} onChange={onChange} />
                      </div>
                    )}
                  />

                  <Button disabled={isLoading} type="submit" className="w-full">
                    {isLoading ? (
                      <span className="animate-pulse">Creating...</span>
                    ) : (
                      "Create"
                    )}
                  </Button>
                </div>
              </form>
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

export default CreateJobAppointmentFormDrawer;
