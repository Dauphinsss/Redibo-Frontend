import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Lock, Eye, EyeOff, Info } from 'lucide-react';
import axios from 'axios';
import { API_URL } from "@/utils/bakend";

export const SecurityInfo = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [showNoPasswordModal, setShowNoPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para validar si la contraseña es fuerte
  const isPasswordStrong = (password: string) => {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[^A-Za-z0-9]/.test(password);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setConfirmPassword(value);
      setPasswordError(newPassword !== value);
    }
  };

  const handleUpdatePassword = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error('No hay sesión activa');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/check-user-password`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        if (response.data.hasPassword) {
          setShowConfirmModal(true);
        } else {
          setShowNoPasswordModal(true);
        }
      } else {
        toast.error('Error al verificar el estado de la cuenta');
      }
    } catch (error) {
      console.error("Error checking user password:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else {
        toast.error('Error al verificar el estado de la cuenta');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showConfirmModal) {
      setShowCurrentPassword(false);
    }
  }, [showConfirmModal]);

  useEffect(() => {
    if (!showNewPasswordModal) {
      setShowNewPassword(false);
      setShowConfirmNewPassword(false);
    }
  }, [showNewPasswordModal]);

  const handleConfirmCurrentPassword = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setCurrentPasswordError('No hay sesión activa');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/validate-password`,
        { currentPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.valid) {
        setShowConfirmModal(false);
        setShowNewPasswordModal(true);
        setCurrentPassword('');
        setCurrentPasswordError('');
      } else {
        setCurrentPasswordError(response.data.message || 'Contraseña incorrecta');
      }
    } catch (error) {
      console.error("Error validating password:", error);
      setCurrentPasswordError('Error al validar contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNewPassword = async () => {
    if (!isPasswordStrong(newPassword) || newPassword !== confirmPassword) {
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert('No hay sesión activa');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/update-password`,
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.error) {
        toast.error(response.data.error);
        return;
      } else {
        setShowNewPasswordModal(false);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordTouched(false);
        setConfirmPasswordTouched(false);
        setPasswordError(false);
        toast.success('Contraseña actualizada correctamente. Por favor, inicia sesión nuevamente.');
        setTimeout(() => {
        handleLogout();
        }, 2500);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else {
        toast.error('Error al actualizar contraseña. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setCurrentPassword('');
    setCurrentPasswordError('');
  };

  const handleCancelNewPassword = () => {
    setShowNewPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordTouched(false);
    setConfirmPasswordTouched(false);
    setPasswordError(false);
  };

  const handleNoPasswordOk = () => {
    setShowNoPasswordModal(false);
    setShowNewPasswordModal(true);
  };

  const handleNoPasswordCancel = () => {
    setShowNoPasswordModal(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Lock className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Contraseña</h3>
              <p className="text-sm text-gray-500">
                Actualiza tu contraseña para mantener tu cuenta segura
              </p>
            </div>
          </div>
          <Button 
            onClick={handleUpdatePassword}
            disabled={loading}
            className="bg-gray-900 text-white hover:bg-gray-800 border border-gray-900"
          >
            {loading ? 'Verificando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      {/* Modal informativo para usuarios sin contraseña */}
      <Dialog open={showNoPasswordModal} onOpenChange={setShowNoPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold flex items-center justify-center space-x-2">
              <Info className="h-6 w-6 text-blue-500" />
              <span>Sin contraseña registrada</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center space-y-3">
              <p className="text-gray-600">
                Tu cuenta no tiene una contraseña registrada actualmente.
              </p>
              <p className="text-gray-600">
                ¿Te gustaría crear una contraseña para tu cuenta?
              </p>
            </div>
          </div>
          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleNoPasswordCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleNoPasswordOk}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
            >
              Crear contraseña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de contraseña actual */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Confirma tu contraseña actual
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Confirma tu contraseña antes de actualizar la configuración de tu cuenta.
            </p>
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-sm font-medium">
                Contraseña *
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={currentPassword}
                  maxLength={20}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setCurrentPasswordError('');
                  }}
                  className={`pr-10 ${currentPasswordError ? 'border-red-500' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-600" />
                  )}
                </Button>
              </div>
              {currentPasswordError && (
                <p className="text-sm text-red-500">{currentPasswordError}</p>
              )}
            </div>
          </div>
          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleCancelConfirm}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmCurrentPassword}
              disabled={!currentPassword || loading}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
            >
              {loading ? 'Validando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de nueva contraseña */}
      <Dialog open={showNewPasswordModal} onOpenChange={setShowNewPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Contraseña</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Nueva contraseña */}
            <div className="space-y-2 relative">
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={newPassword}
                  maxLength={20}
                  onChange={(e) => {
                    const newPasswordValue = e.target.value;
                    if (newPasswordValue.length <= 20) {
                      setNewPassword(newPasswordValue);
                      if (confirmPassword.length > 0) {
                        setPasswordError(newPasswordValue !== confirmPassword);
                      }
                    }
                  }}
                  onBlur={() => setPasswordTouched(true)}
                  className={`pr-10 ${passwordTouched &&
                      (newPassword.length === 0 ||
                        newPassword.length < 8 ||
                        !isPasswordStrong(newPassword))
                      ? "border-red-500"
                      : ""
                    }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-600" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Usa 8 o más caracteres y combina letras, números y símbolos.
              </p>
              {passwordTouched && (
                <div className="space-y-1">
                  {newPassword.length === 0 ? (
                    <p className="text-sm text-red-500">
                      La contraseña es obligatoria.
                    </p>
                  ) : newPassword.length < 8 ? (
                    <p className="text-sm text-red-500">
                      La contraseña debe tener al menos 8 caracteres
                    </p>
                  ) : !/[A-Z]/.test(newPassword) ? (
                    <p className="text-sm text-red-500">
                      Debe contener al menos una letra mayúscula
                    </p>
                  ) : !/[0-9]/.test(newPassword) ? (
                    <p className="text-sm text-red-500">
                      Debe contener al menos un número
                    </p>
                  ) : !/[^A-Za-z0-9]/.test(newPassword) ? (
                    <p className="text-sm text-red-500">
                      Debe contener al menos un carácter especial
                    </p>
                  ) : null}
                </div>
              )}
            </div>

            {/* Confirmar nueva contraseña */}
            <div className="space-y-2 relative">
              <div className="relative">
                <Input
                  type={showConfirmNewPassword ? "text" : "password"}
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  maxLength={20}
                  onChange={handleConfirmPasswordChange}
                  onBlur={() => setConfirmPasswordTouched(true)}
                  className={`pr-10 ${passwordError || (confirmPasswordTouched && !confirmPassword)
                      ? "border-red-500"
                      : ""
                    }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-transparent"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                >
                  {showConfirmNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-600" />
                  )}
                </Button>
              </div>
              {confirmPasswordTouched && !confirmPassword && (
                <p className="text-sm text-red-500">
                  Debe confirmar su contraseña
                </p>
              )}
              {passwordError && confirmPassword && (
                <p className="text-sm text-red-500">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleCancelNewPassword}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveNewPassword}
              disabled={!isPasswordStrong(newPassword) || passwordError || !confirmPassword || loading}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};