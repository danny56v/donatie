import { Heading } from "./catalyst/heading";
import { Divider } from "./catalyst/divider";
import { Field, Fieldset, Label } from "./catalyst/fieldset";
import { Input } from "./catalyst/input";
import { Textarea } from "./catalyst/textarea";
import { useEffect, useMemo, useState } from "react";
import { CategoriesSelect } from "./CategoriesSelect";
import { SubcategoriesSelect } from "./SubcategoriesSelect";
import { Radio, RadioField, RadioGroup } from "./catalyst/radio";
import { FileInputAndPreview } from "./FileInputAndPreview";
import { Button } from "./catalyst/button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const placeholderCategory = useMemo(() => ({ _id: null, name: "Alege o optiune", subcategories: null }), []);
  const placeholderSubcategory = useMemo(() => ({ _id: null, name: "Alege o optiune" }), []);
  const [selectedCategory, setSelectedCategory] = useState(placeholderCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(placeholderSubcategory);
  const [filesWithPreview, setFilesWithPreview] = useState<{ file: File; preview: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/products/${id}`);
          const product = response.data;
          console.log("Imagini primite:", product.imageUrls)
          setFormData({
            name: product.name,
            description: product.description,
            region: product.region,
            city: product.city,
            address: product.address,
            phone: product.phone,
            condition: product.condition,
            category: product.category._id,
            subcategory: product.subcategory._id,
          });
          setSelectedCategory(product.category);
          setSelectedSubcategory(product.subcategory);
          console.log(selectedCategory, selectedSubcategory);
          if (product.imageUrls) {
            setFilesWithPreview(product.imageUrls.map((img: string) => ({ file: null, preview: img })));
          }

          setLoading(false);
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
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
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
        if (file) {
          submissionData.append("images", file);
        }
      });
      
      const remainingImages = filesWithPreview
      .filter((fileObj) => fileObj.file === null) // Doar imaginile deja existente
      .map((fileObj) => fileObj.preview);
    
    console.log("Imagini păstrate:", remainingImages);
    
    remainingImages.forEach((image) => submissionData.append("remainingImages", image));
    

      console.log([...submissionData.entries()]);

      if (id) {
        console.log("Actualizare produs ID:", id);
console.log("FormData:", [...submissionData.entries()]);

        // Update produs
        await axios.put(`/api/products/${id}`, submissionData);
        alert("Produs actualizat cu succes!");
      } else {
        // Creare produs nou
        await axios.post("/api/products", submissionData);
        alert("Produs creat cu succes!");
      }
      setLoading(false);

      navigate("/my-products");
    } catch (error) {
        setLoading(false);
      
        if (axios.isAxiosError(error)) {
          console.log("Eroare Axios:", error.response?.data);
          setError(error.response?.data.message || "A apărut o eroare la actualizarea produsului.");
        } else {
          console.log("Eroare necunoscută:", error);
          setError("A apărut o eroare neprevăzută.");
        }
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
    navigate("/my-products");
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
              <CategoriesSelect
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                placeholderCategory={placeholderCategory}
              />
              <SubcategoriesSelect
                selectedSubcategory={selectedSubcategory}
                setSelectedSubcategory={setSelectedSubcategory}
                selectedCategory={selectedCategory}
                placeholderSubcategory={placeholderSubcategory}
                savedSubcategory={formData.subcategory}
              />
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
            <FileInputAndPreview
              filesWithPreview={filesWithPreview}
              setFilesWithPreview={setFilesWithPreview}
              setError={setError}
            />
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
                {loading ? "Loading..." : id ? "Actualizează" : "Publică"}
              </Button>
            </Field>
          </div>
        </Fieldset>
      </form>
    </>
  );
};
