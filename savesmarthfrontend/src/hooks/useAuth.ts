import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser, clearUser, setLoading, setError, updateUserProfile } from '../store/slices/authSlice';
import { authApi } from '../services/api.service';
import toast from 'react-hot-toast';
import type { LoginRequest, RegisterRequest, Login } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        dispatch(setLoading(true));
        const response = await authApi.login(credentials);

        if (response === false) {
          toast.error('Credenciales inválidas');
          dispatch(setError('Credenciales inválidas'));
          return false;
        }

        // Debug: Verificar estructura de la respuesta
        console.log('🔐 Login Response:', response);
        console.log('🎫 Token recibido:', response.token);

        // Si el backend envía el token en un formato diferente, normalizarlo
        if (!response.token) {
          console.warn('⚠️ No se recibió token en la respuesta de login');
        }

        dispatch(setUser(response));
        toast.success('¡Inicio de sesión exitoso!');

        // Redirigir según el rol del usuario
        if (response.rol === 'Administrador') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/home');
        }

        return true;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
        toast.error(errorMessage);
        dispatch(setError(errorMessage));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, navigate]
  );

const register = useCallback(
  async (data: RegisterRequest) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.register(data);
      dispatch(setUser(response));
      toast.success('¡Registro exitoso!');
      navigate('/user/home');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al registrarse';
      toast.error(errorMessage);
      dispatch(setError(errorMessage));
      // 👇 vuelve a lanzar el error para que el componente lo capture
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  },
  [dispatch, navigate]
);


  const logout = useCallback(() => {
    dispatch(clearUser());
    toast.success('Sesión cerrada exitosamente');
    navigate('/login');
  }, [dispatch, navigate]);

  const updateProfile = useCallback(
    async (userId: string, data: Partial<Login>) => {
      try {
        dispatch(setLoading(true));
        const response = await authApi.updateProfile(userId, data);

        // Actualizar Redux inmediatamente con los datos nuevos
        const updatedUser = response?.user || response;
        dispatch(updateUserProfile(updatedUser));

        toast.success('Perfil actualizado exitosamente');
        return true;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Error al actualizar perfil';
        toast.error(errorMessage);
        dispatch(setError(errorMessage));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  // Método para actualizar el perfil directamente sin API call
  const setUserData = useCallback(
    (userData: Partial<Login>) => {
      dispatch(updateUserProfile(userData));
    },
    [dispatch]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    setUser: setUserData, // Exportar para uso directo
  };
};
