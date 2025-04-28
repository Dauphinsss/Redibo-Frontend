"use client";
import Header from "@/components/ui/Header";
import { WasapComponent } from "@/components/ui/historia2/WasapComponent";

export default function Historia2Page() {
  return (
    <div>
      <Header />
      <div className="p-8">
        <WasapComponent />
      </div>
    </div>
  );
}