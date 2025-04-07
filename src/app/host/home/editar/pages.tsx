import React from 'react';
import { Label } from "@/components/ui/label";


const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Label htmlFor="email">Your email address</Label>

      <input type="email" id="email" placeholder="Enter your email" />
      <p>This is a base page. Start building your content here!</p>
    </div>
  );
};

export default HomePage;