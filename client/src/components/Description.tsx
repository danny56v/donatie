import { DescriptionDetails, DescriptionList, DescriptionTerm } from "./catalyst/description-list";
import { Subheading } from "./catalyst/heading";

export default function Description({ product }) {
  return (
    <>
      <Subheading>{product.name}</Subheading>
      <DescriptionList className="mt-4">
        <DescriptionTerm>Descriere</DescriptionTerm>
        <DescriptionDetails>{product.description}</DescriptionDetails>

        <DescriptionTerm>Conditie</DescriptionTerm>
        <DescriptionDetails>{product.condition}</DescriptionDetails>

        

        <DescriptionTerm>Categoria, Subcategoria</DescriptionTerm>
        <DescriptionDetails>{product.category.name}, {product.subcategory.name}</DescriptionDetails>

        <DescriptionTerm>Utilizator</DescriptionTerm>
        <DescriptionDetails>{product.owner.username}</DescriptionDetails>
        
        <DescriptionTerm>Contacte</DescriptionTerm>
        <DescriptionDetails>{product.phone}</DescriptionDetails>

        <DescriptionTerm>Regiune, Oraș</DescriptionTerm>
        <DescriptionDetails>Mun. {product.region}, {product.city}</DescriptionDetails>

        <DescriptionTerm>Adresa</DescriptionTerm>
        <DescriptionDetails>{product.address}</DescriptionDetails>
      </DescriptionList>
    </>
  );
}
