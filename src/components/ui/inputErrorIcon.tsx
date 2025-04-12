import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";

type Props = {
  message: string;
};

export default function InputErrorIcon({ message }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-2 text-red-500 cursor-pointer">
            <AlertCircle size={18} />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-sm text-red-600">{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
