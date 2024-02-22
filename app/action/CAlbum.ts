// Auth.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

interface InitialParamsType {
    NAMAALBUM: string;
    DESKRIPSI: string;
    USERID: number;
}

export const createAlbumAsync = createAsyncThunk('/album/create', async ({ NAMAALBUM, DESKRIPSI, USERID }: InitialParamsType) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/album/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ NAMAALBUM, DESKRIPSI, USERID }),
  });

  const data = await response.json();
  return data; 
});