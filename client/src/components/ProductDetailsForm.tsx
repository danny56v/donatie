import { Field, Label } from "../components/catalyst/fieldset";
import { Input } from "../components/catalyst/input";
import { Textarea } from "../components/catalyst/textarea";
import { Select } from "../components/catalyst/select";

export default function ProductDetailsForm({ formData, setFormData, selectedCategory, setSelectedCategory, selectedSubcategory, setSelectedSubcategory }) {
  return (
    <>
      <Field>
        <Label>Denumire</Label>
        <Input name="name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
      </Field>
      <Field>
        <Label>Descriere</Label>
        <Textarea name="description" value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} />
      </Field>
      <Field>
        <Label>Categorie</Label>
        <Select value={selectedCategory._id || ""} onChange={(e) => setSelectedCategory(e.target.value)}>
          {/* Populare categorii */}
        </Select>
      </Field>
      <Field>
        <Label>Subcategorie</Label>
        <Select value={selectedSubcategory._id || ""} onChange={(e) => setSelectedSubcategory(e.target.value)}>
          {/* Populare subcategorii */}
        </Select>
      </Field>
    </>
  );
}
