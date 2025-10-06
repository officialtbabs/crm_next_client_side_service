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
import { createCustomersApi } from "@/apis/customers.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface CreateCustomerFormDrawerProps {
  isOpened: boolean;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
}

export interface CreateCustomerRequestDto {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const CreateCustomerFormDrawer = ({
  isOpened,
  setIsOpened,
}: CreateCustomerFormDrawerProps) => {
  const isMobile = useIsMobile();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCustomerRequestDto>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpened(false);
      reset();
    } else setIsOpened(true);
  };

  const onSubmitHandler: SubmitHandler<CreateCustomerRequestDto> = async (
    values
  ) => {
    setIsLoading(true);

    try {
      const createCustomerRes = await createCustomersApi(values);

      if (createCustomerRes.success) {
        toast.success(createCustomerRes.message);
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
                Create customer
              </DrawerTitle>
              <DrawerDescription>
                Fill out the customer details below
              </DrawerDescription>
            </DrawerHeader>

            <div className="pt-4 pb-0 px-10">
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="flex flex-col gap-6">
                  {/* Election Type */}
                  <Controller
                    name="name"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <Label className="font-semibold">Enter fullname</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Taiwo Babarinde"
                          {...field}
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <Label className="font-semibold">Enter phone no.</Label>
                        <Input
                          id="phone"
                          type="text"
                          placeholder="+2349030133136"
                          {...field}
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <Label className="font-semibold">Enter email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="victorotbabs@gmail.com"
                          {...field}
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <Label className="font-semibold">Enter address</Label>
                        <Input
                          id="address"
                          type="text"
                          placeholder="123 Main St, Springfield"
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

export default CreateCustomerFormDrawer;
