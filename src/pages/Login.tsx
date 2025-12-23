import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useState } from 'react';

type LoginForm = {
  username: string;
  password: string;
};

type ServerError = {
  message: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: 'onSubmit',
  });

  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      localStorage.setItem('accessToken', res.data.accessToken);
      navigate('/dashboard');
    },
    onError: (error: AxiosError<ServerError>) => {
      setServerError(
        error.response?.data?.message || 'Login failed',
      );
    },
  });

  const onSubmit = (data: LoginForm) => {
    setServerError(null);
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-100 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">
          Admin Login
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            placeholder='Username'
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2
              ${
                errors.username
                  ? 'border-red-500 focus:ring-red-500'
                  : 'focus:ring-blue-500'
              }
            `}
            {...register('username', {
              required: 'Username is required',
            })}
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder='Password'
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2
              ${
                errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'focus:ring-blue-500'
              }
            `}
            {...register('password', {
              required: 'Password is required',
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {mutation.isPending ? 'Logging in...' : 'Login'}
        </button>

        {serverError && (
          <p className="text-red-600 text-sm text-center">
            {serverError}
          </p>
        )}
      </form>
    </div>
  );
}
