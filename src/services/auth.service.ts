import { ResponseError } from "@/models/responseError.model";
import { loginSchema } from "@/schemas/login.schema";
import { z } from "zod";
import { LoginResponse } from "@/models/auth.model";
import { UserDB } from "@/models/user.model";

const BASE_URL = import.meta.env.VITE_API_URL;

export const signIn = async (
  loginData: z.infer<typeof loginSchema>
): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new ResponseError("Credenciales incorrectas", response.status);
    }

    throw new ResponseError("Error al iniciar sesión", response.status);
  }

  const { data } = await response.json();

  return data;
};

export const validateSession = async (token: string): Promise<UserDB> => {
  const response = await fetch(`${BASE_URL}/auth/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new ResponseError("Sesión no válida", response.status);
  }

  const { data } = await response.json();

  return data;
};

export const sendEmailVerification = async (token: string): Promise<string> => {
  const response = await fetch(`${BASE_URL}/auth/send-verification-email`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 409) {
      const body = await response.json();
      const expiresAt = body.message.split(": ")[1] as string;

      throw new ResponseError(expiresAt, response.status);
    }

    throw new ResponseError(
      "Error al enviar el correo de verificación",
      response.status
    );
  }

  const { data } = await response.json();
  const { expiresAt } = data;
  return expiresAt;
};

export const verifyEmail = async (otp: string, token: string) => {
  const response = await fetch(`${BASE_URL}/auth/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ otp }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new ResponseError(
        "Código de verificación incorrecto",
        response.status
      );
    }

    throw new ResponseError("Error al verificar el correo", response.status);
  }

  return "Correo verificado con éxito";
};

export const forgotPassword = async (email: string) => {
  const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new ResponseError("Correo no encontrado", response.status);
    }

    throw new ResponseError(
      "Error al solicitar el cambio de contraseña",
      response.status
    );
  }

  return "Correo enviado con éxito";
};

export const verifyForgotPasswordToken = async (token: string) => {
  const response = await fetch(
    `${BASE_URL}/auth/verify-forgot-password-token/${token}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new ResponseError("Token no encontrado", response.status);
    }

    throw new ResponseError("Error al verificar el token", response.status);
  }

  return "Token verificado con éxito";
};

export const resetPassword = async (token: string, password: string) => {
  const response = await fetch(`${BASE_URL}/auth/reset-password/${token}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    throw new ResponseError(
      "Error al restablecer la contraseña, intentelo nuevamente más tarde",
      response.status
    );
  }

  return "Contraseña restablecida con éxito";
};
