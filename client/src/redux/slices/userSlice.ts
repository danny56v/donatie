import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../interfaces/IUser";

interface UserState {
  currentUser: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInSuccess: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action: PayloadAction<Error>)=>{
        state.loading = false;
        state.error = action.payload.message
    }
  },
});


export const { signInSuccess, signInFailure } = userSlice.actions;

export default userSlice.reducer;
