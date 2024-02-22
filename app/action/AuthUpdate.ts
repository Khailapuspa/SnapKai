// Auth.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

interface InitialParamsType {
    USERID: number;
    USERNAME: string;
    PASSWORD: string;
    EMAIL: string;
    NAMALENGKAP: string;
    ALAMAT: string;
}

export const userUpdateAsync = createAsyncThunk('/users/update', async ({ USERID, USERNAME, PASSWORD, EMAIL, NAMALENGKAP, ALAMAT }: InitialParamsType) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/users/update/${USERID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ USERNAME, PASSWORD, EMAIL, NAMALENGKAP, ALAMAT }),
  });

  const data = await response.json();
  return data; 
});