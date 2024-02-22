// Auth.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

interface initialParamsType {
    USERID : number
}

export const getAlbumAsync = createAsyncThunk('/user/view/album', async ({ USERID }: initialParamsType) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/user/view/album/${USERID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ USERID }),
  });

  const data = await response.json();
  return data; 
});
