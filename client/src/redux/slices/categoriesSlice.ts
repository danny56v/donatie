import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Subcategory {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
}

interface CategoriesState {
  categories: Category[];
  subcategories: Subcategory[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  subcategories: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    getCategoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.loading = false;
    },
    getCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getSubcategoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSubcategoriesSuccess: (state, action: PayloadAction<Subcategory[]>) => {
      state.subcategories = action.payload;
      state.loading = false;
    },
    getSubcategoriesFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  getCategoriesStart,
  getCategoriesSuccess,
  getCategoriesFailure,
  getSubcategoriesStart,
  getSubcategoriesSuccess,
  getSubcategoriesFailure,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
