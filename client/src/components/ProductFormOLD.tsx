import { PhotoIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";
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
import { Heading } from "./catalyst/heading";
import { Divider } from "./catalyst/divider";
import { ErrorMessage, Field, Fieldset, Label } from "./catalyst/fieldset";
import { Input } from "./catalyst/input";
import { Textarea } from "./catalyst/textarea";
import { Select } from "./catalyst/select";
import { Radio, RadioField, RadioGroup } from "./catalyst/radio";
import { Text } from "./catalyst/text";
import { Button } from "./catalyst/button";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductForm() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const subcategories = useSelector((state: RootState) => state.categories.subcategories);
  const user = useSelector((state: RootState) => state.user.currentUser);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorCategories = useSelector((state: RootState) => state.categories.error);
  const loadingCategories = useSelector((state: RootState) => state.categories.loading);

  const placeholderCategory = useMemo(() => ({ _id: null, name: "Alege o optiune", subcategories: null }), []);
  const placeholderSubcategory = useMemo(() => ({ _id: null, name: "Alege o optiune" }), []);

  const [selectedCategory, setSelectedCategory] = useState(placeholderCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(placeholderSubcategory);

  const [filesWithPreview, setFilesWithPreview] = useState<{ file: File; preview: string }[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    region: "",
    city: "",
    address: "",
    phone: "",
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

    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const combinedFiles = [...filesWithPreview, ...newFiles];

    if (combinedFiles.length > 10) {
      setError("Maxim 10 imagini");

      const excessFiles = combinedFiles.slice(10);
      excessFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));

      setFilesWithPreview(combinedFiles.slice(0, 10));
    } else {
      setError(null);
      setFilesWithPreview(combinedFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = filesWithPreview.filter((_, i) => i !== index);
    // Revoke URL pentru prevenirea pierderii memoriei
    URL.revokeObjectURL(filesWithPreview[index].preview);
    setFilesWithPreview(updatedFiles);
  };

  useEffect(() => {
    return () => {
      filesWithPreview.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [filesWithPreview]);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`/api/product/${id}`);
          
          if (user && user.id !== res.data.owner) {
            alert("Nu ai permisiunea să editezi acest produs!");
            navigate('/'); // Redirecționează utilizatorul dacă nu este proprietarul
          } else {
            setFormData(res.data);
          }
  
          setLoading(false);
        } catch (error) {
          setError("Produsul nu a fost găsit sau nu ai acces.");
          setLoading(false);
          navigate('/');
        }
      };
  
      fetchProduct();
    }
  }, [id, user, navigate]);
  
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

  useEffect(() => {
    if (selectedCategory._id) {
      dispatch(getSubcategoriesStart());
      const getSubcategories = async () => {
        try {
          const res = await axios.get(`/api/categories/${selectedCategory._id}/subcategories`);
          dispatch(getSubcategoriesSuccess(res.data));
          setSelectedSubcategory(placeholderSubcategory);
        } catch (error) {
          const messageError = error instanceof Error ? error.message : "A aparut o eroare";
          dispatch(getSubcategoriesFailure(messageError));
        }
      };

      getSubcategories();
    } else {
      dispatch(getSubcategoriesSuccess([]));
    }
  }, [selectedCategory, dispatch, placeholderSubcategory]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      category: selectedCategory._id,
      subcategory: selectedSubcategory._id,
    }));
  }, [selectedCategory, selectedSubcategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.category ||
      !formData.subcategory ||
      !formData.condition ||
      !formData.region ||
      !formData.city ||
      !formData.address ||
      !formData.phone ||
      filesWithPreview.length === 0
    ) {
      setError("Toate campurile sunt obligatorii");
      return;
    }

    // const currentFormData = {
    //   ...formData,
    //   category: selectedCategory._id,
    //   subcategory: selectedSubcategory._id,
    // };

    try {
      setLoading(true);
      setError(null);
      const submissionData = new FormData();
      submissionData.append("name", formData.name || "");
      submissionData.append("description", formData.description || "");
      submissionData.append("category", formData.category || "");
      submissionData.append("subcategory", formData.subcategory || "");
      submissionData.append("region", formData.region || "");
      submissionData.append("city", formData.city || "");
      submissionData.append("address", formData.address || "");
      submissionData.append("phone", formData.phone || "");
      submissionData.append("condition", formData.condition || "");

      filesWithPreview.forEach(({ file }) => {
        submissionData.append("images", file);
      });

      console.log([...submissionData.entries()]);

      await axios.post("/api/products", submissionData);
      alert("Sa creat cu succes");
      setLoading(false);
      setError(null);
      navigate("/my-products");
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "A apărut o eroare la autentificare."
          : "A apărut o eroare neprevăzută.";
      console.log(errorMessage);
      setLoading(false);
      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      region: "",
      city: "",
      address: "",
      phone: "",
      condition: "nou",
      category: placeholderCategory._id,
      subcategory: placeholderSubcategory._id,
    });
    setSelectedCategory(placeholderCategory);
    setSelectedSubcategory(placeholderSubcategory);
    setFilesWithPreview([]);
  };

  return (
    <>
      <Heading>Adaugă anunț</Heading>
      <Divider className="my-6 dark:bg-slate-400"></Divider>
      <form method="POST" onSubmit={handleSubmit}>
        <Fieldset className="flex flex-col md:flex-row md:flex-wrap gap-6">
          <div className="flex-1">
            <Field>
              <Label>Denumire</Label>
              <Input name="name" value={formData.name} onChange={handleChange}></Input>
            </Field>
            <Field className="pt-4">
              <Label>Descriere</Label>
              <Textarea name="description" onChange={handleChange} value={formData.description} rows={3}></Textarea>
            </Field>
            <div className="flex flex-col lg:flex-row lg:flex-wrap gap-6">
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
                {errorCategories && <ErrorMessage>{errorCategories}</ErrorMessage>}
              </Field>
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
            </div>
            <Field className="pt-4">
              <Label className="mb-2">Stare</Label>
              <RadioGroup
                name="condition"
                defaultValue="nou"
                aria-label="Condition"
                onChange={(value) => setFormData((prevData) => ({ ...prevData, condition: value }))}
                className="flex flex-col md:flex-row gap-6"
              >
                <RadioField className="flex-1">
                  <Radio value="nou" color="blue" />
                  <Label>Nou</Label>
                </RadioField>
                <RadioField className="flex-1">
                  <Radio value="utilizat" color="blue" />
                  <Label>Utilizat</Label>
                </RadioField>
              </RadioGroup>
            </Field>
            <div className="flex flex-col lg:flex-row  gap-4 mt-4">
              <Field className="flex-1">
                <Label>Regiune</Label>
                <Input name="region" value={formData.region} onChange={handleChange}></Input>
              </Field>
              <Field className="flex-1">
                <Label>Oraș</Label>
                <Input name="city" value={formData.city} onChange={handleChange}></Input>
              </Field>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col lg:flex-row gap-4">
              <Field className="basis-2/3">
                <Label>Adresa</Label>
                <Input name="address" value={formData.address} onChange={handleChange}></Input>
              </Field>
              <Field className="basis-1/3">
                <Label>Telefon</Label>
                <Input name="phone" type="number" value={formData.phone} onChange={handleChange}></Input>
              </Field>
            </div>
            <Field className="max-w-lg mx-auto mt-6">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed border-zinc-300 bg-zinv-50 dark:bg-zinc-800 dark:border-zinc-500 hover:dark:border-zinc-200 hover:dark:bg-zinc-700 hover:border-indigo-600 hover:bg-indigo-50 cursor-pointer"
              >
                <PhotoIcon className="h-12 w-12 text-gray-400" />
                <Text className="mt-2">
                  Drag and drop or <span className="text-indigo-600 font-medium cursor-pointer">browse</span> to upload
                </Text>
                <Text className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</Text>
                <input
                  id="file-upload"
                  type="file"
                  name="file-upload"
                  className="sr-only"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange(e)}
                />
              </label>
            </Field>
            <Field className=" grid grid-cols-5 md:grid-cols-3 lg:grid-cols-5">
              {filesWithPreview.map(({ preview }, index) => (
                <div key={index} className="relative group m-2">
                  <img src={preview} alt={`Preview ${index}`} className="h-24 w-24 rounded-md object-cover shadow-md" />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    // onClick={() => {
                    //   const newImagePreview = imagePreview.filter((_, i) => i !== index);
                    //   const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
                    //   setImagePreview(newImagePreview);
                    //   setSelectedFiles(newSelectedFiles);
                    // }}
                    className="absolute top-1 right-1 hidden h-6 w-6 bg-red-600 text-white rounded-full group-hover:flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </Field>
            <Field className={`flex justify-end gap-4 mt-6 ${loading && "cursor-not-allowed"}`}>
              <Button
                outline
                onClick={(e) => {
                  e.preventDefault();
                  handleCancel();
                }}
              >
                Anulare
              </Button>

              <Button disabled={loading} type="submit">
                {loading ? "Loading..." : "Publică"}
              </Button>
            </Field>
          </div>
        </Fieldset>
      </form>
    </>
  );
}
