import { X } from "lucide-react";

export default function TopBarMobile({ onClick }: { onClick: () => void }) {
  return (
    <div className="sticky top-0 left-0 w-full bg-white ">
      <div className="flex justify-end items-center h-10">
        <button
          className="p-2 bg-white rounded-full shadow-md mx-4"
          onClick={onClick}
        >
          <X size={20} className="text-black" />
        </button>
      </div>
    </div>
  )
}