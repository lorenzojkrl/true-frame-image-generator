import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export function FieldLabel({ children, htmlFor, className }: FieldLabelProps) {
  return (
    <Label
      htmlFor={htmlFor}
      className={cn("text-zinc-400 text-xs mb-2 block", className)}
    >
      {children}
    </Label>
  );
}
