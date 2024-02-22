// userSlice.ts

import { createKomentarAsync } from "@/app/action/CKomentar";
import { RootState } from "@/app/store";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    ISIKOMENTAR: string,
    FOTOID: number | undefined;
    USERID: number | undefined;
}

const initialState: UserState = {
    ISIKOMENTAR: "",
    FOTOID: undefined,
    USERID: undefined,
};

const komentarfotoslice = createSlice({
  name: 'komentar',
  initialState: initialState,
  reducers: {

  },
  extraReducers: (builder) => {

    builder.addCase(createKomentarAsync.fulfilled, (state, action) => {
      const payload: UserState = action.payload
      state.ISIKOMENTAR = payload.ISIKOMENTAR;
      state.FOTOID = payload.FOTOID;
      state.USERID = payload.USERID;
    });
  },
});


export const ISIKOMENTAR = (state: RootState) => state.komentar.ISIKOMENTAR;
export const FOTOID = (state: RootState) => state.komentar.FOTOID;
export const USERID = (state: RootState) => state.komentar.USERID;

export default komentarfotoslice.reducer;
