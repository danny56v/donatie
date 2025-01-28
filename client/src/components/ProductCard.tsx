import { useNavigate } from "react-router-dom";
import { Strong, Text } from "./catalyst/text";

export default function ProductCard({ product, height }) {
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate(`/product/${id}`);
  };
  return (
    <div
      key={product._id}
      onClick={() => handleClick(product._id)}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-white dark:bg-zinc-900 shadow-md dark:shadow-zinc-400"
    >
      <div className={`h-32 aspect-h-3 aspect-w-3 bg-gray-200 dark:bg-zinc-700 sm:aspect-none group-hover:opacity-75 sm:h-${height} `}>
        <img
          alt={product.name}
          src={product.imageUrls[0]}
          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4 ">
        <h3 className="text-sm font-medium text-gray-900 dark:text-zinc-100 line-clamp-2">
          <Strong>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Strong>
        </h3>
        <Text className="text-sm text-zinc-400 line-clamp-2">{product.description}</Text>
        <div className="flex flex-1 flex-col justify-end">
          {/* <p className="text-sm italic text-gray-500">{product.options}</p>
                      <p className="text-base font-medium text-gray-900">{product.price}</p> */}
        </div>
      </div>
    </div>
  );
}
