"use client";

import { useEffect, useState } from "react";
import InvoicesDataTable, {
  ActiveInvoiceTableDataAction,
  InvoiceTableActions,
} from "@/components/invoices-data-table";
import RecordPaymentFormDialog from "@/components/record-payment-form-dialog";

const InvoicesPage = () => {
  const [activeTableAction, setActiveTableAction] =
    useState<ActiveInvoiceTableDataAction | null>(null);

  const [isRecordPaymentFormDialogOpened, setIsRecordPaymentFormDialogOpened] =
    useState(false);

  useEffect(() => {
    if (activeTableAction) {
      const { action } = activeTableAction;

      switch (action) {
        case InvoiceTableActions.collectPayment:
          setIsRecordPaymentFormDialogOpened(true);
          break;
      }
    }
  }, [activeTableAction]);

  return (
    <>
      <div className="flex flex-1 h-full items-center justify-center ">
        <main className="flex flex-1 h-full flex-col gap-4 p-4">
          <InvoicesDataTable setActiveTableAction={setActiveTableAction} />
        </main>
      </div>

      <RecordPaymentFormDialog
        activeTableId={activeTableAction ? activeTableAction.id : ""}
        setActiveTableAction={setActiveTableAction}
        isOpened={isRecordPaymentFormDialogOpened}
        setIsOpened={setIsRecordPaymentFormDialogOpened}
      />
    </>
  );
};

export default InvoicesPage;
