// Auth.ts
import { createAsyncThunk } from '@reduxjs/toolkit';

interface InitialParamsType {
    FOTOID: number;
}

export const deleteFotoAsync = createAsyncThunk('/foto/delete', async ({ FOTOID }: InitialParamsType) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/foto/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ FOTOID })  // Ensure FOTOID is sent in the request body
    });

    const data = await response.json();
    return data;
});
