import { HiAdjustments } from "react-icons/hi";

export default function ButtonFilter(){
    return (
        <button className="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black text-white rounded-md flex items-center justify-center">
        <HiAdjustments className="h-5 w-5" />
      </button>
    );
}