// components/FloatingTimer.tsx
export function FloatingTimer({ timeLeft, formatTime, onClick }: any) {
    return (
      <div
        onClick={onClick}
        className="fixed bottom-4 right-4 bg-[#1a1a1a] text-white rounded-xl shadow-lg w-24 h-12 p-2 flex items-center justify-center hover:ring-2 ring-white cursor-pointer"
      >
        <span className="text-xl font-bold">
          {formatTime(timeLeft, false)}
        </span>
      </div>
    );
  }

  