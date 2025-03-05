import { useEffect } from "react";
import { Select } from "./catalyst/select";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesFailure, getCategoriesStart, getCategoriesSuccess } from "../redux/slices/categoriesSlice";
import axios from "axios";
import { RootState } from "../redux/store";
import { Field, Label } from "./catalyst/fieldset";

export const CategoriesSelect = ({ selectedCategory,setSelectedCategory, placeholderCategory }) => {

    const dispatch = useDispatch();
    const  categories  = useSelector((state:RootState) => state.categories.categories);
    const  errorCategories  = useSelector((state:RootState) => state.categories.error);
    // const placeholderCategory = { _id: "", name: "Alege o categorie" };
    useEffect(() => {
        const getCategories = async () => {
          dispatch(getCategoriesStart());
          try {
            const categories = await axios.get("/api/categories");
            // console.log(categories);
            dispatch(getCategoriesSuccess(categories.data));
          } catch (error) {
            const errorMessage =
              axios.isAxiosError(error) && error.response
                ? error.response.data.message || "A apărut o eroare la identificarea categoriilor."
                : "A apărut o eroare neprevăzută.";
            console.log(errorMessage);
            dispatch(getCategoriesFailure(errorMessage));
          }
        };
        getCategories();
      }, [dispatch]);
  return (
    <Field className="pt-4 flex-1 ">
    <Label>Categorie</Label>
    <Select
      name="category"
      value={selectedCategory._id || ""}
      invalid={!!errorCategories}
      onChange={(e) => {
        const selected = categories.find((cat) => cat._id === e.target.value) || placeholderCategory;
        setSelectedCategory(selected);
      }}
    >
      <option value="" disabled>
        Alege o categorie
      </option>
      {categories.map((category) => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}
    </Select>
    </Field>
  );
};
