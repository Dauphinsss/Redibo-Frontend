import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


export default function AccordionDemo() {
    return (
        <div className="w-full h-full flex items-center justify-center">
    <Accordion type="single" collapsible className="w-full items-center justify-center">
        <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
            si
        </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
            Yes. It comes with default styles that matches the other
            components&apos; aesthetic.
        </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
            Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
        </AccordionItem>
    </Accordion>
    </div>
    );
}