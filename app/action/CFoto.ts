// Auth.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

// Ganti InitialParamsType sesuai dengan struktur FormData
export const createFotoAsync = createAsyncThunk('/foto/uploads', async (formData: FormData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/foto/uploads`, {
    method: 'POST',
    body: formData,  // Mengirimkan FormData langsung sebagai body
  });

  const data = await response.json();
  return data; 
});
