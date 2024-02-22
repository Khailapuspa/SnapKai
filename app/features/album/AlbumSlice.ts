// userSlice.ts
import { createAlbumAsync } from "@/app/action/CAlbum";
import { RootState } from "@/app/store";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    NAMAALBUM: string;
    DESKRIPSI: string;
    USERID: number | undefined;
}

const initialState: UserState = {
    NAMAALBUM: "",
    DESKRIPSI: "",
    USERID: undefined
};

const albumSlice = createSlice({
  name: 'album',
  initialState: initialState,
  reducers: {

  },
  extraReducers: (builder) => {

    builder.addCase(createAlbumAsync.fulfilled, (state, action) => {
      const payload: UserState = action.payload
      state.NAMAALBUM = payload.NAMAALBUM;
      state.DESKRIPSI = payload.DESKRIPSI;
      state.USERID = payload.USERID;
    });
  },
});

export const NAMAALBUM = (state: RootState) => state.album.NAMAALBUM;
export const DESKRIPSI = (state: RootState) => state.album.DESKRIPSI;
export const USERID = (state: RootState) => state.album.USERID;

export default albumSlice.reducer;
