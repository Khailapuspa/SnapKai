// Auth.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

interface InitialParamsType {
    EMAIL: string;
    PASSWORD: string;
}

export const userLoginsAsync = createAsyncThunk('/login-user/users', async ({ EMAIL, PASSWORD }: InitialParamsType) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/login-user/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ EMAIL, PASSWORD }),
  });

  const data = await response.json();
  return data; 
});