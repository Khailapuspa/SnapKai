import { createAsyncThunk } from "@reduxjs/toolkit";

interface InitialParamsType {
    ISIKOMENTAR: string;
    FOTOID: number;
    USERID: number;
}

export const createKomentarAsync = createAsyncThunk('/komentar/create', async ({ ISIKOMENTAR, FOTOID, USERID }: InitialParamsType) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/komentar/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ISIKOMENTAR, FOTOID, USERID }),
  });

  const data = await response.json();
  return data; 
});