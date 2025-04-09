import React from "react";
import { Input, InputGroup } from "./catalyst/input";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

interface SearchBarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
}

export const SearchBar = ({ searchValue, setSearchValue }: SearchBarProps) => {
  return (
    <>
      <InputGroup className="w-full max-w-max">
        <MagnifyingGlassIcon />
        <Input
          name="search"
          placeholder="Caută..."
          aria-label="Caută"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </InputGroup>
    </>
  );
};
