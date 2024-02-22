// userSlice.ts

import { createLikeAsync } from "@/app/action/CLike";
import { RootState } from "@/app/store";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    FOTOID: number | undefined;
    USERID: number | undefined;
}

const initialState: UserState = {
    FOTOID: undefined,
    USERID: undefined,
};

const likefotoslice = createSlice({
  name: 'like',
  initialState: initialState,
  reducers: {

  },
  extraReducers: (builder) => {

    builder.addCase(createLikeAsync.fulfilled, (state, action) => {
      const payload: UserState = action.payload
      state.FOTOID = payload.FOTOID;
      state.USERID = payload.USERID;
    });
  },
});


export const FOTOID = (state: RootState) => state.like.FOTOID;
export const USERID = (state: RootState) => state.like.USERID;

export default likefotoslice.reducer;
