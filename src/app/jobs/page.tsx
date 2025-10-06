"use client";

import { useEffect, useState } from "react";
import JobsDataTable, {
  ActiveJobTableDataAction,
  JobTableActions,
} from "@/components/jobs-data-table";
import CreateJobAppointmentFormDrawer from "@/components/create-job-appointment-form-drawer";
import UpdateJobStatusFormDialog from "@/components/update-job-status-form-dialog";
import GenerateJobInvoiceFormDrawer from "@/components/generate-job-invoice-form-drawer";
import JobDetailsDrawer from "@/components/job-details-drawer";

const JobsPage = () => {
  const [activeTableAction, setActiveTableAction] =
    useState<ActiveJobTableDataAction | null>(null);
  const [
    isCreateJobAppointmentFormDrawerOpened,
    setIsCreateJobAppointmentFormDrawerOpened,
  ] = useState(false);

  const [
    isUpdateJobStatusFormDrawerOpened,
    setIsUpdateJobStatusFormDrawerOpened,
  ] = useState(false);

  const [
    isGenerateJobInvoiceFormDrawerOpened,
    setIsGenerateJobInvoiceFormDrawerOpened,
  ] = useState(false);

  const [isJobDetailsDrawerOpened, setIsJobDetailsDrawerOpened] =
    useState(false);

  useEffect(() => {
    if (activeTableAction) {
      const { action } = activeTableAction;

      switch (action) {
        case JobTableActions.createAppointment:
          setIsCreateJobAppointmentFormDrawerOpened(true);
          break;
        case JobTableActions.updateStatus:
          setIsUpdateJobStatusFormDrawerOpened(true);
          break;
        case JobTableActions.generateInvoice:
          setIsGenerateJobInvoiceFormDrawerOpened(true);
          break;
        case JobTableActions.viewDetails:
          setIsJobDetailsDrawerOpened(true);
          break;
      }
    }
  }, [activeTableAction]);

  return (
    <>
      <div className="flex flex-1 h-full items-center justify-center ">
        <main className="flex flex-1 h-full flex-col gap-4 p-4">
          <JobsDataTable setActiveTableAction={setActiveTableAction} />
        </main>
      </div>

      <CreateJobAppointmentFormDrawer
        activeTableId={activeTableAction ? activeTableAction.id : ""}
        setActiveTableAction={setActiveTableAction}
        isOpened={isCreateJobAppointmentFormDrawerOpened}
        setIsOpened={setIsCreateJobAppointmentFormDrawerOpened}
      />

      <UpdateJobStatusFormDialog
        activeTableId={activeTableAction ? activeTableAction.id : ""}
        setActiveTableAction={setActiveTableAction}
        isOpened={isUpdateJobStatusFormDrawerOpened}
        setIsOpened={setIsUpdateJobStatusFormDrawerOpened}
      />

      <GenerateJobInvoiceFormDrawer
        activeTableId={activeTableAction ? activeTableAction.id : ""}
        setActiveTableAction={setActiveTableAction}
        isOpened={isGenerateJobInvoiceFormDrawerOpened}
        setIsOpened={setIsGenerateJobInvoiceFormDrawerOpened}
      />

      <JobDetailsDrawer
        activeTableId={activeTableAction ? activeTableAction.id : ""}
        setActiveTableAction={setActiveTableAction}
        isOpened={isJobDetailsDrawerOpened}
        setIsOpened={setIsJobDetailsDrawerOpened}
      />
    </>
  );
};

export default JobsPage;
