// lib/auth.js
import api from './api';

export const loginUser = async (email: string, password: string): Promise<any> => {
  const res = await api.post('/auth/login', {
    correo: email,
    contrasena: password,
  });
  return res.data;
};

export const loginWithGoogle = (): void => {
  window.location.href = 'http://localhost:4000/api/auth/google';
};