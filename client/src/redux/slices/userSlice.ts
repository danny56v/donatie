import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { IUser } from "../../interfaces/Interfaces";

interface IUser {
  id: string;
  googleId?: string;
  username?: string;
  email: string;
  isAdmin: boolean ;
  productsId: string[];
  firstName: string;
  lastName: string;
  createdAt: string;
}
interface UserState {
  currentUser: IUser | null;
  isAuthenticated: boolean;
  // token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  // token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action: PayloadAction<IUser>) => {
      state.loading = false;
      state.currentUser = action.payload;
      // console.log(state.currentUser)
      // state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    signInFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    signUpStart: (state) => {
      state.loading = true;
    },
    signUpSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    signUpFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOutStart: (state) => {
      state.loading = true;
    },
    signOutSuccess: (state) => {
      state.isAuthenticated = false;
      // state.token = null;
      state.loading = false;
      state.error = null;
      state.currentUser = null;
    },
    signOutFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signUpStart,
  signUpSuccess,
  signUpFailure,
  signOutFailure,
  signOutStart,
  signOutSuccess,
} = userSlice.actions;

export default userSlice.reducer;
