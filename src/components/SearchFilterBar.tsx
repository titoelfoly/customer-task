import React, { useState } from "react";
import * as Select from "@radix-ui/react-select";
import { FaChevronDown } from "react-icons/fa";

interface Props {
  onSearch: (query: string) => void;
  onFilter: (status: string | null) => void;
}
const options = ["All", "Active", "InActive"];
const SearchFilterBar: React.FC<Props> = ({ onSearch, onFilter }) => {
  const [search, setSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(search);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-sky-50 shadow-md rounded-lg">
      <input
        type="text"
        placeholder="Search by name, email, or phone"
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        className="flex-1 px-4 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 text-sky-700 placeholder-sky-400"
      />

      <Select.Root
        value={selectedOption}
        onValueChange={(value) => {
          setSelectedOption(value);
          onFilter(value);
        }}
      >
        <Select.Trigger className="inline-flex items-center justify-between px-4 py-2 border border-sky-300 rounded-md bg-white text-sky-700 hover:bg-sky-100 focus:ring-2 focus:ring-sky-400 w-40">
          <Select.Value placeholder="Filter by Status">
            {selectedOption || "Filter by Status"}
          </Select.Value>
          <Select.Icon>
            <FaChevronDown />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="bg-white border border-sky-300 rounded-md shadow-lg"
            position="popper"
            sideOffset={5}
          >
            <Select.Viewport className="p-2">
              {options.map((item) => (
                <Select.Item
                  value={item}
                  key={item}
                  className="px-4 py-2 cursor-pointer hover:bg-sky-100 focus:bg-sky-200 rounded-md text-sky-700"
                >
                  {item}
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default SearchFilterBar;
