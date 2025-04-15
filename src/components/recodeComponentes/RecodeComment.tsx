import React from "react";
import { FaUserCircle, FaStar } from "react-icons/fa";

interface CommentProps {
  username: string;
  date: string;
  content: string;
  rating: number; // 
}

const Comment: React.FC<CommentProps> = ({ username, date, content, rating }) => (
  <article className="mb-6">
    {/* Usuario y fecha */}
    <header className="flex items-center mb-2">
      <FaUserCircle className="text-gray-500 w-6 h-6 mr-2" />
      <p className="font-semibold">
        {username} <span className="text-sm text-gray-500">- {date}</span>
      </p>
    </header>

    {/* Contenido del comentario */}
    <section className="mb-2">
      <p className="text-sm font-medium">"{content}"</p>
    </section>

    {/* Calificación */}
    <footer className="flex items-center">
      <FaStar className="text-yellow-500 w-4 h-4 mr-1" />
      <span className="text-sm font-medium">{rating}</span>
    </footer>
  </article>
);

export default Comment;