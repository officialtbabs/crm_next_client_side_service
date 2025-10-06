import { JobStatus } from "@/lib/types";
import React from "react";
import { Badge } from "./ui/badge";
import {
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  FilePlus,
  ReceiptText,
} from "lucide-react";

type CustomBadgeProps = {
  status: JobStatus;
};

const CustomBadge = ({ status }: CustomBadgeProps) => {
  return (
    <div>
      <Badge
        variant="outline"
        className={` ${
          status === JobStatus.new
            ? "text-blue-500 bg-blue-50"
            : status === JobStatus.scheduled
            ? "text-amber-500 bg-amber-50"
            : status === JobStatus.done
            ? "text-green-500 bg-green-50"
            : status === JobStatus.invoiced
            ? "text-indigo-500 bg-indigo-50"
            : "text-emerald-600 bg-emerald-50"
        }} px-2.5`}
      >
        {status === JobStatus.new ? (
          <FilePlus strokeWidth={3} className="text-blue-500" />
        ) : status === JobStatus.scheduled ? (
          <CalendarClock strokeWidth={3} className="text-amber-500" />
        ) : status === JobStatus.done ? (
          <CheckCircle2 strokeWidth={3} className="text-green-500" />
        ) : status === JobStatus.invoiced ? (
          <ReceiptText strokeWidth={3} className="text-indigo-500" />
        ) : (
          <BadgeCheck strokeWidth={3} className="text-emerald-600" />
        )}
        {status}
      </Badge>
    </div>
  );
};

export default CustomBadge;
