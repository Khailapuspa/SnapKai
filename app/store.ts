import { configureStore } from "@reduxjs/toolkit"
import counterSlice from "./features/counter/counterSlice"
import userSlice from "./features/auth/userSlice"
import AlbumSlice from "./features/album/AlbumSlice"
import FotoSlice from "./features/foto/FotoSlice"
import LikefotoSlice from "./features/likefoto/LikefotoSlice"
import KomentarfotoSlice from "./features/komentarfoto/KomentarfotoSlice"

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    user: userSlice,
    album: AlbumSlice,
    foto: FotoSlice,
    like: LikefotoSlice,
    komentar: KomentarfotoSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch