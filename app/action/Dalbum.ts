// Auth.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

interface InitialParamsType {
    ALBUMID: number;
}

export const deleteAlbumAsync = createAsyncThunk('/album/delete', async ({ ALBUMID }: InitialParamsType) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/album/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ALBUMID }),
  });

  const data = await response.json();
  return data; 
});