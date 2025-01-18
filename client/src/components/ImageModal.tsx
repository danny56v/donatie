

import { useCallback, useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
export default function ImageModal({
    open,
    setOpen,
    images,
    currentImageIndex,
    setCurrentImageIndex,
  }) {
    const showPrevImage = useCallback(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
      }, [images.length, setCurrentImageIndex]);
    
      const showNextImage = useCallback(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, [images.length, setCurrentImageIndex]);
    
      useEffect(() => {
        const handleKeyDown = (event) => {
          if (open) {
            if (event.key === "ArrowLeft") {
              showPrevImage();
            } else if (event.key === "ArrowRight") {
              showNextImage();
            }
          }
        };
    
        // Adaugă evenimentul
        window.addEventListener("keydown", handleKeyDown);
    
        // Elimină evenimentul atunci când componenta este demontată sau când modalul este închis
        return () => {
          window.removeEventListener("keydown", handleKeyDown);
        };
      }, [open, showPrevImage, showNextImage]);
    

    return (
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          {/* Imaginea curentă */}
          <div className="relative max-w-5xl">
            <img
              src={images[currentImageIndex]}
              alt=""
              className="mx-auto max-h-[80vh] object-contain"
            />
            {/* Thumbnail-uri */}
            <div className="mt-4 flex justify-center space-x-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt=""
                  className={`h-16 w-16 cursor-pointer rounded ${
                    index === currentImageIndex
                      ? "ring-2 ring-red-500"
                      : "opacity-50"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
  
          {/* Buton pentru imaginea anterioară */}
          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2  text-white h-36 w-16 flex items-center justify-center text-4xl font-bold hover:text-gray-600 focus:outline-none"
            onClick={showPrevImage}
          >
            {"<"}
          </button>
  
          {/* Buton pentru imaginea următoare */}
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2  text-white h-36 w-16 flex items-center justify-center text-4xl font-bold hover:text-gray-600 focus:outline-none"
            onClick={showNextImage}
          >
            {">"}
          </button>
  
          {/* Buton pentru închiderea modalului */}
          <button
            type="button"
            className="absolute top-10 right-8 text-white text-2xl h-20 w-20 font-bold hover:text-gray-600 focus:outline-none"
            onClick={() => setOpen(false)}
          >
            X
          </button>
        </div>
      </Dialog>
    );
  }
  