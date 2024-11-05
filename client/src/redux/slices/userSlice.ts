import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../interfaces/IUser";

interface UserState {
  currentUser: IUser | null;
  isAuthenticated: boolean;
  laoding: boolean;
  error: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  laoding: false,
  error: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInSuccess: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
      state.laoding = false;
      state.error = false;
    },
  },
});


export const { signInSuccess } = userSlice.actions;

export default userSlice.reducer;
