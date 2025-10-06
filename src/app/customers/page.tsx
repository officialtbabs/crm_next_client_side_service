"use client";

import CustomersDataTable, {
  ActiveCustomerTableDataAction,
  CustomerTableActions,
} from "@/components/customers-data-table";
import CreateCustomerFormDrawer from "@/components/create-customer-form-drawer";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import CreateJobFormDrawer from "@/components/create-job-form-drawer";

const CustomersPage = () => {
  const [activeTableAction, setActiveTableAction] =
    useState<ActiveCustomerTableDataAction | null>(null);

  const [isCustomerFormDrawerOpened, setIsCustomerFormDrawerOpened] =
    useState(false);
  const [isJobFormDrawerOpened, setIsJobFormDrawerOpened] = useState(false);

  useEffect(() => {
    console.log(activeTableAction);
    if (activeTableAction) {
      const { action } = activeTableAction;

      switch (action) {
        case CustomerTableActions.createJob:
          setIsJobFormDrawerOpened(true);
          break;
      }
    }
  }, [activeTableAction]);

  return (
    <>
      <div className="font-sans flex flex-1 h-full items-center justify-center ">
        <main className="flex flex-1 h-full flex-col gap-4 p-4">
          <div className="flex flex-row justify-end items-center pr-10 h-24 w-full rounded-xl">
            <Button onClick={() => setIsCustomerFormDrawerOpened(true)}>
              Create Customer
            </Button>
          </div>

          <CustomersDataTable setActiveTableAction={setActiveTableAction} />
        </main>
      </div>

      <CreateCustomerFormDrawer
        isOpened={isCustomerFormDrawerOpened}
        setIsOpened={setIsCustomerFormDrawerOpened}
      />

      <CreateJobFormDrawer
        activeTableId={activeTableAction ? activeTableAction.id : ""}
        setActiveTableAction={setActiveTableAction}
        isOpened={isJobFormDrawerOpened}
        setIsOpened={setIsJobFormDrawerOpened}
      />
    </>
  );
};

export default CustomersPage;
