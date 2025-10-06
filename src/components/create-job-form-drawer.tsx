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
import { Input } from "./ui/input";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { createJobApi } from "@/apis/jobs.api";
import { Textarea } from "./ui/textarea";
import { ActiveCustomerTableDataAction } from "./customers-data-table";

interface CreateJobsFromDrawerProps {
  activeTableId: string;
  setActiveTableAction: Dispatch<
    SetStateAction<ActiveCustomerTableDataAction | null>
  >;
  isOpened: boolean;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
}

export interface CreateJobRequestDto {
  title: string;
  description: string;
  customerId: string;
}

const CreateJobFormDrawer = ({
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
    setValue,
    formState: { errors },
  } = useForm<CreateJobRequestDto>({
    defaultValues: {
      customerId: activeTableId,
      title: "",
      description: "",
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

  const onSubmitHandler: SubmitHandler<CreateJobRequestDto> = async (
    values
  ) => {
    setIsLoading(true);

    try {
      const createJobRes = await createJobApi(values);

      if (createJobRes.success) {
        handleOnOpenChange(isOpened);
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
    if (!activeTableId) return;
    setValue("customerId", activeTableId);
  }, [activeTableId, setValue]);

  useEffect(() => {
    displayFormErrors(errors);
  }, [errors, activeTableId]);

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
                Create job
              </DrawerTitle>
              <DrawerDescription>
                Fill out the job details below
              </DrawerDescription>
            </DrawerHeader>

            <div className="pt-4 pb-0 px-10">
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="flex flex-col gap-6">
                  <Controller
                    name="title"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <Label className="font-semibold">Title</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder=""
                          {...field}
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <Label className="font-semibold">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Enter job description"
                          {...field}
                        />
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

export default CreateJobFormDrawer;
