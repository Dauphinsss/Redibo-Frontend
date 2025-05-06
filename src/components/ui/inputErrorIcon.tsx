import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipArrow,
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
        <TooltipContent
          side="top"
          className="bg-red-500 text-white rounded-md px-3 py-1 shadow-md"
        >
          {/*  esta clase es la que cambia el color del rombo */}
          <TooltipArrow className="fill-red-500" />
          <p className="text-sm">{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
