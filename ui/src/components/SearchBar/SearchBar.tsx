import React from "react";
import { IconButton, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./styles.css";

interface SearchBarProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onSearch?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Buscar...",
  value,
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
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
