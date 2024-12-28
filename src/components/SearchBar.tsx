import React from "react";
import { Input } from "@/components/ui/input";
type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};
const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <Input
        type="text"
        placeholder="Search Pokemon..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
};
export default SearchBar;
