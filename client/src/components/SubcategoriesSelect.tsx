import { useEffect } from "react";
import { ErrorMessage, Field, Label } from "./catalyst/fieldset";
import { Select } from "./catalyst/select";
import { useDispatch, useSelector } from "react-redux";
import { getSubcategoriesFailure, getSubcategoriesStart, getSubcategoriesSuccess } from "../redux/slices/categoriesSlice";
import axios from "axios";
import { RootState } from "../redux/store";


export const SubcategoriesSelect = ({selectedSubcategory, setSelectedSubcategory, selectedCategory, placeholderSubcategory, savedSubcategory}) => {
const subcategories = useSelector((state:RootState) => state.categories.subcategories);
const errorCategories = useSelector((state:RootState) => state.categories.error);
    const dispatch = useDispatch();
    useEffect(() => {
        if (selectedCategory._id) {
          dispatch(getSubcategoriesStart());
          const getSubcategories = async () => {
            try {
              const res = await axios.get(`/api/categories/${selectedCategory._id}/subcategories`);
              dispatch(getSubcategoriesSuccess(res.data));
              const existingSubcategory = res.data.find((subcat) => subcat._id === savedSubcategory);
          if (existingSubcategory) {
            setSelectedSubcategory(existingSubcategory);
          } else {
            setSelectedSubcategory(placeholderSubcategory);
          }
            } catch (error) {
              const messageError = error instanceof Error ? error.message : "A aparut o eroare";
              dispatch(getSubcategoriesFailure(messageError));
            }
          };
    
          getSubcategories();
        } else {
          dispatch(getSubcategoriesSuccess([]));
        }
      }, [selectedCategory, dispatch, placeholderSubcategory, setSelectedSubcategory, savedSubcategory]);
    
  return (
     <Field className="pt-4 flex-1">
                    <Label>Subcategorie</Label>
                    <Select
                      name="subcategory"
                      value={selectedSubcategory._id || ""}
                      invalid={!!errorCategories}
                      onChange={(e) => {
                        const selected =
                          subcategories.find((subcat) => subcat._id === e.target.value) || placeholderSubcategory;
                        setSelectedSubcategory(selected);
                      }}
                      disabled={!selectedCategory._id}
                    >
                      <option value="" disabled>
                        Alege o subcategorie
                      </option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory._id} value={subcategory._id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </Select>
                    {errorCategories && <ErrorMessage>{errorCategories}</ErrorMessage>}
                  </Field>
  )
}
