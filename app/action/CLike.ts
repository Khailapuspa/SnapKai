// Auth.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

interface InitialParamsType {
    FOTOID: number;
    USERID: number;
}

export const createLikeAsync = createAsyncThunk('/like/create', async ({ FOTOID, USERID }: InitialParamsType) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/like/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ FOTOID, USERID }),
  });

  const data = await response.json();
  return data; 
});