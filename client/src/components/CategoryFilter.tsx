import { useEffect, useState } from "react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { Strong } from "./catalyst/text";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesStart, getCategoriesSuccess, getCategoriesFailure } from "../redux/slices/categoriesSlice";
import { RootState } from "../redux/store";
import { Text } from "./catalyst/text";


interface Props {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSubcategories: string[];
  setSelectedSubcategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export const CategoryFilter = ({
  selectedCategories,
  setSelectedCategories,
  selectedSubcategories,
  setSelectedSubcategories,
}: Props) => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories.categories);



  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      dispatch(getCategoriesStart());
      try {
        const response = await axios.get("/api/categories");
        dispatch(getCategoriesSuccess(response.data));
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

  const toggleCategory = (category) => {
    const isSelected = selectedCategories.includes(category._id);

    if (isSelected) {
      setSelectedCategories((prev) => prev.filter((cid) => cid !== category._id));
      setSelectedSubcategories((prev) =>
        prev.filter((sid) => !category.subcategories?.some((sub) => sub._id === sid))
      );
    } else {
      setSelectedCategories((prev) => [...prev, category._id]);
      setSelectedSubcategories((prev) => [...prev, ...(category.subcategories?.map((sub) => sub._id) || [])]);
    }
  };

  const toggleSubcategory = (id: string) => {
    setSelectedSubcategories((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]));
  };

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      const categoryQuery = selectedCategories.join(",");
      const subcategoryQuery = selectedSubcategories.join(",");

      try {
        const res = await axios.get(`/api/products`, {
          params: {
            categories: categoryQuery,
            subcategories: subcategoryQuery,
          },
        });
        console.log("Filtered products:", res.data);
      } catch (err) {
        console.error("Eroare la filtrare:", err);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategories, selectedSubcategories]);

  return (
    <>
      <Strong className="sr-only">Categorii</Strong>

      {Array.isArray(categories) &&
        categories.map((category) => (
          <Disclosure key={category._id} as="div" className="py-5 px-2 transition-all duration-200 hover:rounded-md hover:bg-slate-200 hover:dark:text-zinc-400 hover:dark:bg-zinc-800">
            <h3 className="-mx-2 -my-3 ">
              <DisclosureButton className="group flex w-full items-center justify-between px-2 ">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`category-${category._id}`}
                    checked={selectedCategories.includes(category._id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleCategory(category); // nu mai e doar id-ul!
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />

                  <label htmlFor={`category-${category._id}`}>
                    <Text>{category.name}</Text>
                  </label>
                </div>
                <span className="ml-6 flex items-center">
                  <PlusIcon aria-hidden="true" className="size-5 group-data-[open]:hidden" />
                  <MinusIcon aria-hidden="true" className="size-5 group-[&:not([data-open])]:hidden" />
                </span>
              </DisclosureButton>
            </h3>
            <DisclosurePanel className="pt-4">
              {category.subcategories?.map((sub) => (
                <div key={sub._id} className="p-2 ml-4 flex items-center gap-3 transition-all duration-200  hover:rounded-md hover:bg-white hover:dark:bg-zinc-700">
                  <input
                    type="checkbox"
                    id={`subcategory-${sub._id}`}
                    checked={selectedSubcategories.includes(sub._id)}
                    onChange={() => toggleSubcategory(sub._id)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label htmlFor={`subcategory-${sub._id}`} className="text-sm dark:text-zinc-400 ">
                    {sub.name}
                  </label>
                </div>
              ))}
            </DisclosurePanel>
          </Disclosure>
        ))}
    </>
  );
};
