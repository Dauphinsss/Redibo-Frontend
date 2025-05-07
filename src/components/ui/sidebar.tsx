
"use client";

import React, { createContext, useContext } from "react";
import clsx from "clsx";

// Contexto para el provider (puedes expandirlo si necesitas más lógica)
const SidebarContext = createContext({});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  return (
    <SidebarContext.Provider value={{}}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({
  children,
  side = "left",
  collapsible = "none",
  className = "",
}: {
  children: React.ReactNode;
  side?: "left" | "right";
  collapsible?: "none" | "responsive";
  className?: string;
}) {
  return (
    <nav
      className={clsx(
        "flex flex-col bg-white",
        side === "left" ? "border-r" : "border-l",
        className
      )}
    >
      {children}
    </nav>
  );
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2 p-4">{children}</div>;
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-2">{children}</ul>;
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

export function SidebarMenuButton({
  children,
  onClick,
  isActive,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex items-center w-full px-4 py-1 text-left rounded transition text-sm",
        isActive
          ? "bg-gray-200 font-semibold border-black"
          : "bg-white hover:bg-gray-100",
        className
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </button>
  );
} 