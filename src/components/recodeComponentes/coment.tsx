import React from "react";
import { FaUserCircle, FaStar } from "react-icons/fa";

interface CommentProps {
  username: string;
  date: string;
  content: string;
  rating: number; // Calificación, por ejemplo, de 0 a 10
}

function Comment({ username, date, content, rating }: CommentProps) {
  return (
    <div className="mb-6">
      {/* Usuario y fecha */}
      <div className="flex items-center mb-2">
        <FaUserCircle className="text-gray-500 w-6 h-6 mr-2" />
        <p className="font-semibold">
          {username} <span className="text-sm text-gray-500">- {date}</span>
        </p>
      </div>

      {/* Contenido del comentario */}
      <p className="text-sm font-medium mb-2">"{content}"</p>

      {/* Calificación */}
      <div className="flex items-center">
        <FaStar className="text-yellow-500 w-4 h-4 mr-1" />
        <span className="text-sm font-medium">{rating}</span>
      </div>
    </div>
  );
}

export default Comment;