import { Field, Label } from "../components/catalyst/fieldset";
import { Input } from "../components/catalyst/input";

export default function LocationForm({ formData, setFormData }) {
  return (
    <>
      <Field>
        <Label>Regiune</Label>
        <Input name="region" value={formData.region} onChange={(e) => setFormData((prev) => ({ ...prev, region: e.target.value }))} />
      </Field>
      <Field>
        <Label>Oraș</Label>
        <Input name="city" value={formData.city} onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))} />
      </Field>
    </>
  );
}
