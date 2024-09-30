import React from "react";
import { IconButton, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  fullWidth?: boolean; 
  onSearch?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Buscar...",
  value,
  fullWidth,
  onChange,
}) => {
  return (
    <div className="search-bar-container">
      <IconButton
        type="button"
        className="search-bar-icon"
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
      <InputBase
        className="search-bar-input"
        placeholder={placeholder}
        inputProps={{ "aria-label": placeholder }}
        value={value}
        fullWidth={fullWidth}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
