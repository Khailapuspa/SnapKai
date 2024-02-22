// userSlice.ts
import { userRegisAsync } from "@/app/action/AuthRegis";
import { userUpdateAsync } from "@/app/action/AuthUpdate";
import { RootState } from "@/app/store";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    USERNAME: string;
    PASSWORD: string;
    EMAIL: string;
    NAMALENGKAP: string;
    ALAMAT: string;
    update: any,
}

const initialState: UserState = {
    USERNAME: "",
    PASSWORD: "",
    EMAIL: "",
    NAMALENGKAP: "",
    ALAMAT: "",
    update: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {

  },
  extraReducers: (builder) => {

    builder.addCase(userRegisAsync.fulfilled, (state, action) => {
      const payload: UserState = action.payload
      state.USERNAME = payload.USERNAME;
      state.PASSWORD = payload.PASSWORD;
      state.EMAIL = payload.EMAIL;
      state.NAMALENGKAP = payload.NAMALENGKAP;
      state.ALAMAT = payload.ALAMAT;
    })
    builder.addCase(userUpdateAsync.fulfilled, (state, action) => {
      state.update = action.payload
    })
  },
});

export const USERNAME = (state: RootState) => state.user.USERNAME;
export const PASSWORD = (state: RootState) => state.user.PASSWORD;
export const EMAIL = (state: RootState) => state.user.EMAIL;
export const NAMALENGKAP = (state: RootState) => state.user.NAMALENGKAP;
export const ALAMAT = (state: RootState) => state.user.ALAMAT;
export const update = (state: RootState) => state.user.update;

export default userSlice.reducer;
