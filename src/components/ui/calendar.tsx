<<<<<<< HEAD
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

=======
"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
>>>>>>> origin/recode
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
<<<<<<< HEAD
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
=======
      className={className}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2", 
        month: "flex flex-col gap-4", 
        month_caption: "relative flex items-center justify-start mb-4 text-lg font-semibold",////

        caption_label: "text-sm font-medium text-left mt-4 ml-4", 
        nav: "absolute right-0 top-0 flex items-center gap-1", 
        //el fill para que cabie a fuerza el color de los iconos de cambiar de es a negro
        button_previous: "p-1 rounded hover:bg-gray-100 transition [&>svg]:!fill-black mt-2",
        button_next: "p-1 rounded hover:bg-gray-100 transition [&>svg]:!fill-black mt-2",
        month_grid: "w-full border-collapse space-x-1", 
        weekdays: "flex", 
        weekday: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]", 
        week: "flex w-full mt-2", 
        day: cn( 
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100" 
        ),
        day_button: "", 
        range_start: "aria-selected:bg-primary aria-selected:text-primary-foreground", 
        range_end: "aria-selected:bg-primary aria-selected:text-primary-foreground", 
        selected: "bg-blue-600 text-white data-outside:bg-transparent data-outside:text-muted-foreground",
        //  selected: "bg-primary text-white data-outside:bg-transparent data-outside:text-muted-foreground",para que no se pinte de la otra semana
        today: "bg-accent text-accent-foreground", 
        outside: "text-muted-foreground aria-selected:text-muted-foreground", 
        disabled: "text-muted-foreground opacity-50", 
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground", 
        hidden: "invisible", 
        ...classNames,
      }}
      {...props}
    />
  );
}

export { Calendar };
>>>>>>> origin/recode
