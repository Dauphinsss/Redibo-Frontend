import React from 'react';
import Form from './form';
import { Footer } from '@/components/ui/footer';
import { Header } from './header';
import { Toaster } from '@/components/ui/sonner';

const RegistroPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Form />
      <Footer />
      <Toaster />
    </div>
  );
};

export default RegistroPage;