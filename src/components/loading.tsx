import React from 'react';

const Loading: React.FC = () => (
  <div className="flex flex-col justify-center items-center text-muted-foreground">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary m-4"></div>
    Cargando...
  </div>
);

export default Loading;