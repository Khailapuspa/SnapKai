// Auth.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

interface InitialParamsType {
    USERNAME: string;
    PASSWORD: string;
    EMAIL: string;
    NAMALENGKAP: string;
    ALAMAT: string;
}

export const userRegisAsync = createAsyncThunk('/register-user/users', async ({ USERNAME, PASSWORD, EMAIL, NAMALENGKAP, ALAMAT }: InitialParamsType) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/register-user/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ USERNAME, PASSWORD, EMAIL, NAMALENGKAP, ALAMAT }),
  });

  const data = await response.json();
  return data; 
});