interface ProgressIndicatorProps {
  currentStep: number;
}

export default function ProgressIndicator({
  currentStep,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 1
              ? "bg-foreground text-background"
              : "border text-muted-foreground"
          }`}
        >
          1
        </div>
        <span
          className={`text-sm ${
            currentStep >= 1 ? "font-medium" : "text-muted-foreground"
          }`}
        >
          Datos de Licencia
        </span>
      </div>

      <div
        className={`flex-1 h-1 rounded ${
          currentStep >= 2 ? "bg-foreground" : "bg-border"
        }`}
      />

      <div className="flex items-center space-x-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 2
              ? "bg-foreground text-background"
              : "border text-muted-foreground"
          }`}
        >
          2
        </div>
        <span
          className={`text-sm ${
            currentStep >= 2 ? "font-medium" : "text-muted-foreground"
          }`}
        >
          Fotos de Licencia
        </span>
      </div>
    </div>
  );
}
