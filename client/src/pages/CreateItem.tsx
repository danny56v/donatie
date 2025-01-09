import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategoriesFailure,
  getCategoriesStart,
  getCategoriesSuccess,
  getSubcategoriesFailure,
  getSubcategoriesStart,
  getSubcategoriesSuccess,
} from "../redux/slices/categoriesSlice";
import { RootState } from "../redux/store";

export default function CreateItem() {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const subcategories = useSelector((state: RootState) => state.categories.subcategories);

  const placeholderCategory = { _id: null, name: "Alege o optiune", subcategories: null };
  const placeholderSubcategory = { _id: null, name: "Alege o optiune" };
  // const categoriesWithPlaceholder = [placeholderCategory, ...categories];

  const [selectedCategory, setSelectedCategory] = useState(placeholderCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(placeholderSubcategory);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    condition: "nou",
    category: selectedCategory._id,
    subcategory: selectedSubcategory._id,
  });

  // Object.entries(formData).forEach(([key, value]) => {
  //   submissionData.append(key, value);
  // });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      alert("Maxim 5 fisiere");
      setSelectedFiles(files.slice(0, 5));
    } else {
      setSelectedFiles(files);
    }
  };

  useEffect(() => {
    dispatch(getCategoriesStart());
    const getCategories = async () => {
      try {
        const categories = await axios.get("/api/categories");
        // console.log(categories);
        dispatch(getCategoriesSuccess(categories.data));
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response
            ? error.response.data.message || "A apărut o eroare la autentificare."
            : "A apărut o eroare neprevăzută.";
        console.log(errorMessage);
      }
    };
    getCategories();
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory._id) {
      dispatch(getSubcategoriesStart());
      const getSubcategories = async () => {
        try {
          const res = await axios.get(`/api/categories/${selectedCategory._id}/subcategories`);
          dispatch(getSubcategoriesSuccess(res.data));
        } catch (error) {
          const messageError = error instanceof Error ? error.message : "A aparut o eroare";
          dispatch(getSubcategoriesFailure(messageError));
        }
      };

      getSubcategories();
    }
  }, [selectedCategory, dispatch]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      category: selectedCategory._id,
    }));
  }, [selectedCategory]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      subcategory: selectedSubcategory._id,
    }));
  }, [selectedSubcategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.category || !formData.subcategory || !formData.condition) {
      alert("Toate campurile sunt obligatorii");
      return;
    }

    // const currentFormData = {
    //   ...formData,
    //   category: selectedCategory._id,
    //   subcategory: selectedSubcategory._id,
    // };

    try {
      const submissionData = new FormData();
      submissionData.append("name", formData.name || "");
      submissionData.append("description", formData.description || "");
      submissionData.append("category", formData.category || "");
      submissionData.append("subcategory", formData.subcategory || "");
      submissionData.append("condition", formData.condition || "");

      selectedFiles.forEach((file, index) => {
        submissionData.append(`images`, file); // Cheia poate fi "images" pentru toate
      });

      // console.log(formData);
      // console.log(submissionData.get);

      await axios.post("/api/products", submissionData);
      // const res = await fetch("/api/products", {
      //   method: "POST",
      //   body: submissionData,
      // });
      // console.log(res);
      alert("Sa creat cu succes");
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "A apărut o eroare la autentificare."
          : "A apărut o eroare neprevăzută.";
      console.log(errorMessage);
    }
  };

  return (
    <>
      <div className="container mx-auto px-5 py-5">
        <form onSubmit={handleSubmit}>
          <div className=" flex flex-col md:flex-row md:gap-10 flex-nowrap">
            <div className="basis-1/2">
              <div className="border-b border-gray-900/10 pb-12 ">
                <h2 className="text-base/7 font-semibold text-gray-900">Creare Produs</h2>
                <p className="mt-1 text-sm/6 text-gray-600">
                  Adaugă datele despre produsul tău. Toate câmpurile sunt obligatorii.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                      Denumire
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                        {/* <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">workcation.com/</div> */}
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Scaun, Masa, etc."
                          className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">
                      Descriere
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={7}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                    <p className="mt-3 text-sm/6 text-gray-600">Descrie produsul tău.</p>
                  </div>
                  <div className="col-span-full">
                    <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
                      Cover photo
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                        <div className="mt-4 flex text-sm/6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              onChange={(e) => handleFileChange(e)}
                              multiple
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="basis-1/2">
              <div className="border-b border-gray-900/10 pb-5">
                <h2 className="text-base/7 font-semibold text-gray-900">Categoria</h2>
                <p className="mt-1 text-sm/6 text-gray-600">
                  We'll always let you know about important changes, but you pick what else you want to hear about.
                </p>

                <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                  <Label className="block text-sm/6 font-medium text-gray-900">Assigned to</Label>
                  <div className="relative mt-2">
                    <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                      <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                        {/* <img alt="" src={selected.avatar} className="size-5 shrink-0 rounded-full" /> */}
                        <span className="block truncate">{selectedCategory.name}</span>
                      </span>
                      <ChevronUpDownIcon
                        aria-hidden="true"
                        className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                      />
                    </ListboxButton>

                    <ListboxOptions
                      transition
                      className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                    >
                      {categories.map((category) => (
                        <ListboxOption
                          key={category._id}
                          value={category}
                          className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                        >
                          <div className="flex items-center">
                            {/* <img alt="" src={.avatar} className="size-5 shrink-0 rounded-full" /> */}
                            <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                              {category.name}
                            </span>
                          </div>

                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                            <CheckIcon aria-hidden="true" className="size-5" />
                          </span>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
              <div className="border-b border-gray-900/10 pb-5">
                <h2 className="text-base/7 font-semibold text-gray-900">Subcategoria</h2>
                <p className="mt-1 text-sm/6 text-gray-600">
                  Selectează mai întâi o categorie pentru a alege o subcategorie.
                </p>

                <Listbox
                  value={selectedSubcategory}
                  onChange={setSelectedSubcategory}
                  disabled={!selectedCategory._id} // Dezactivează dacă nu este selectată o categorie
                >
                  <Label className="block text-sm/6 font-medium text-gray-900">Subcategorie</Label>
                  <div className="relative mt-2">
                    <ListboxButton
                      className={`grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                        !selectedCategory._id ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
                      }`}
                    >
                      <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                        <span className="block truncate">{selectedSubcategory.name}</span>
                      </span>
                      <ChevronUpDownIcon
                        aria-hidden="true"
                        className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                      />
                    </ListboxButton>

                    <ListboxOptions
                      transition
                      className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                    >
                      {subcategories.map((subcategory) => (
                        <ListboxOption
                          key={subcategory._id}
                          value={subcategory}
                          className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                        >
                          <div className="flex items-center">
                            <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                              {subcategory.name}
                            </span>
                          </div>

                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                            <CheckIcon aria-hidden="true" className="size-5" />
                          </span>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
              <div className="mt-10 space-y-10">
                <fieldset>
                  <legend className="text-sm/6 font-semibold text-gray-900">Starea produsului</legend>
                  <p className="mt-1 text-sm/6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
                  <div className="mt-6 flex flex-row gap-x-6">
                    <div className="flex items-center gap-x-3">
                      <input
                        id="push-everything"
                        name="used"
                        type="radio"
                        value="nou"
                        checked={formData.condition === "nou"}
                        onChange={() => setFormData((prev) => ({ ...prev, condition: "nou" }))}
                        className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                      />
                      <label htmlFor="push-everything" className="block text-sm/6 font-medium text-gray-900">
                        Nou
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="push-email"
                        name="used"
                        type="radio"
                        value="utilizat"
                        checked={formData.condition === "utilizat"}
                        onChange={() => setFormData((prev) => ({ ...prev, condition: "utilizat" }))}
                        className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                      />
                      <label htmlFor="push-email" className="block text-sm/6 font-medium text-gray-900">
                        Utilizat
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm/6 font-semibold text-gray-900">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
