import { PhotoIcon } from "@heroicons/react/24/solid";
import { Field } from "./catalyst/fieldset";
import { Text } from "./catalyst/text";
import { useEffect } from "react";

export const FileInputAndPreview = ({ filesWithPreview, setFilesWithPreview, setError }) => {
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
  return (
    <>
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
              className="absolute top-1 right-1 hidden h-6 w-6 bg-red-600 text-white z-10 rounded-full group-hover:flex items-center justify-center"
            >
              &times;
            </button>
          </div>
        ))}
      </Field>
    </>
  );
};
