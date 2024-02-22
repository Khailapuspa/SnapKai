// userSlice.ts

import { createFotoAsync } from "@/app/action/CFoto";
import { RootState } from "@/app/store";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    JUDULFOTO: string;
    DESKRIPSIFOTO: string;
    ALBUMID: number | undefined;
    USERID: number | undefined;
}

const initialState: UserState = {
    JUDULFOTO: "",
    DESKRIPSIFOTO: "",
    ALBUMID: undefined,
    USERID: undefined,
};

const fotoSlice = createSlice({
  name: 'foto',
  initialState: initialState,
  reducers: {

  },
  extraReducers: (builder) => {

    builder.addCase(createFotoAsync.fulfilled, (state, action) => {
      const payload: UserState = action.payload
      state.JUDULFOTO = payload.JUDULFOTO;
      state.DESKRIPSIFOTO = payload.DESKRIPSIFOTO;
      state.ALBUMID = payload.ALBUMID;
      state.USERID = payload.USERID;
    });
  },
});

export const JUDULFOTO = (state: RootState) => state.foto.JUDULFOTO;
export const DESKRIPSIFOTO = (state: RootState) => state.foto.DESKRIPSIFOTO;
export const ALBUMID = (state: RootState) => state.foto.ALBUMID;
export const USERID = (state: RootState) => state.foto.USERID;

export default fotoSlice.reducer;
