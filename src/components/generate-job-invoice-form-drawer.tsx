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

import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { displayFormErrors } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { createJobInvoiceApi } from "@/apis/jobs.api";
import { Textarea } from "./ui/textarea";
import { ActiveJobTableDataAction } from "./jobs-data-table";

interface GenerateJobInvoiceFromDrawerProps {
  activeTableId: string;
  setActiveTableAction: Dispatch<
    SetStateAction<ActiveJobTableDataAction | null>
  >;
  isOpened: boolean;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
}

interface GenerateJobInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface GenerateJobInvoiceRequestDto {
  items: GenerateJobInvoiceItem[];
  taxRate: number;
}

const GenerateJobInvoiceFormDrawer = ({
  activeTableId,
  setActiveTableAction,
  isOpened,
  setIsOpened,
}: GenerateJobInvoiceFromDrawerProps) => {
  const isMobile = useIsMobile();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GenerateJobInvoiceRequestDto>({
    defaultValues: {
      items: [{ description: "", quantity: 0, unitPrice: 0 }],
      taxRate: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpened(false);
      setActiveTableAction(null);
      reset();
    } else setIsOpened(true);
  };

  const onSubmitHandler: SubmitHandler<GenerateJobInvoiceRequestDto> = async (
    values
  ) => {
    setIsLoading(true);

    try {
      const createJobInvoiceRes = await createJobInvoiceApi(
        activeTableId,
        values
      );

      if (createJobInvoiceRes.success) {
        toast.success(createJobInvoiceRes.message);
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
                Generate invoice
              </DrawerTitle>
              <DrawerDescription>
                Fill out the information below to generate invoice for a Job.
              </DrawerDescription>
            </DrawerHeader>

            <div className="pt-4 pb-0 px-10">
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="flex flex-col gap-6">
                  <Controller
                    name="taxRate"
                    control={control}
                    rules={{
                      required: {
                        message: "Tax rate is required",
                        value: true,
                      },
                      min: {
                        message: "Please enter tax rate for invoice",
                        value: 1,
                      },
                    }}
                    render={({ field: { value, onChange } }) => (
                      <div className="grid gap-3">
                        <Label className="font-semibold">Tax rate (%)</Label>

                        <Input
                          id="taxRate"
                          type="number"
                          min={1}
                          placeholder=""
                          value={(value ?? 0).toString()}
                          onChange={(e) => {
                            onChange(Number(e.target.value));
                          }}
                        />
                      </div>
                    )}
                  />

                  {fields.map((item, index) => {
                    return (
                      <div key={item.id} className="flex flex-col gap-6">
                        <Controller
                          name={`items.${index}.description`}
                          control={control}
                          rules={{
                            required: {
                              message: "Please describe yiur item",
                              value: true,
                            },
                          }}
                          render={({ field }) => (
                            <div className="grid gap-3">
                              <Label className="font-semibold">
                                Description
                              </Label>

                              <Textarea
                                id="description"
                                placeholder="Enter item description"
                                {...field}
                              />
                            </div>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-6">
                          <Controller
                            name={`items.${index}.quantity`}
                            control={control}
                            rules={{
                              required: {
                                message: "Quantity is required",
                                value: true,
                              },
                              min: {
                                message: "Please enter quantity of your item",
                                value: 1,
                              },
                            }}
                            render={({ field: { value, onChange } }) => (
                              <div className="grid gap-3">
                                <Label className="font-semibold">
                                  Quantity
                                </Label>

                                <Input
                                  id="name"
                                  type="number"
                                  min={1}
                                  placeholder=""
                                  value={(value ?? 0).toString()}
                                  onChange={(e) => {
                                    onChange(Number(e.target.value));
                                  }}
                                />
                              </div>
                            )}
                          />

                          <Controller
                            name={`items.${index}.unitPrice`}
                            control={control}
                            rules={{
                              required: {
                                message: "Unit price is required",
                                value: true,
                              },
                              min: {
                                message:
                                  "Please enter unit price for your item",
                                value: 1,
                              },
                            }}
                            render={({ field: { value, onChange } }) => (
                              <div className="grid gap-3">
                                <Label className="font-semibold">
                                  Unit price
                                </Label>

                                <Input
                                  id="name"
                                  type="number"
                                  min={1}
                                  placeholder=""
                                  value={(value ?? 0).toString()}
                                  onChange={(e) => {
                                    onChange(Number(e.target.value));
                                  }}
                                />
                              </div>
                            )}
                          />
                        </div>
                      </div>
                    );
                  })}

                  <DrawerFooter className="px-0">
                    <div className="grid grid-cols-2 gap-6">
                      <Button
                        variant="secondary"
                        className="w-full"
                        type="button"
                        onClick={() => remove(fields.length - 1)}
                        disabled={fields.length === 1}
                      >
                        Remove item
                      </Button>

                      <Button
                        className="w-full"
                        type="button"
                        onClick={() =>
                          append({ description: "", quantity: 0, unitPrice: 0 })
                        }
                      >
                        Add Item
                      </Button>
                    </div>

                    <Button
                      disabled={isLoading}
                      type="submit"
                      className="w-full"
                    >
                      {isLoading ? (
                        <span className="animate-pulse">Generating...</span>
                      ) : (
                        "Generate"
                      )}
                    </Button>

                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </form>
            </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
};

export default GenerateJobInvoiceFormDrawer;
