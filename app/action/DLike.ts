
import { createAsyncThunk } from '@reduxjs/toolkit';

interface UnlikeParams {
  FOTOID: number; 
  USERID: number;
}

export const UnlikeAsync = createAsyncThunk('like/unlike', async ({ FOTOID, USERID }: UnlikeParams) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/like/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ FOTOID, USERID }), // Sesuaikan dengan nama yang diharapkan oleh server
    });

    const data = await response.json();
    return data;
});
