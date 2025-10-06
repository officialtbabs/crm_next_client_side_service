import { clsx, type ClassValue } from "clsx";
import { FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function displayFormErrors(errors: FieldErrors) {
  if (Object.keys(errors).length > 0) {
    const firstError = Object.values(errors)[0];

    if (typeof firstError === "string") {
      toast.error("Validation Error", {
        description: firstError,
      });
    } else if (typeof firstError?.message === "string") {
      toast.error("Validation Error", {
        description: firstError.message,
      });
    } else {
      toast.error("Please correct the errors in the form.");
    }
  }
}

export function formatDate(date: Date | string): string {
  return format(date, "PPP");
}
