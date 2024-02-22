import { createAsyncThunk } from "@reduxjs/toolkit";

export const usertokenAsync = createAsyncThunk('/valid-token', async () => {
  const token = localStorage.getItem('data');

  if (token) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/valid-token`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();
    return data; // Mengasumsikan bahwa data memiliki struktur InitialParamsType
  } else {
    // Menangani kasus di mana token bernilai null
    throw new Error("Token bernilai null");
  }
});
