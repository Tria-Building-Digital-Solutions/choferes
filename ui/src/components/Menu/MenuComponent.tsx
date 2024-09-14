import React, { useState } from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  SvgIconProps,
} from "@mui/material";

interface MenuComponentProps {
  icon?: React.ReactElement<SvgIconProps>;
  buttonText?: string;
  menuItems: { text: string; onClick: () => void }[];
}

const MenuComponent: React.FC<MenuComponentProps> = ({
  icon,
  buttonText,
  menuItems,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {icon && (
        <IconButton
          color="inherit"
          aria-controls={open ? "generic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          {icon}
        </IconButton>
      )}

      {buttonText && !icon && (
        <Button
          aria-controls={open ? "generic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          {buttonText}
        </Button>
      )}

      <Menu
        id="generic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "generic-button",
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick();
              handleClose();
            }}
          >
            {item.text}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default MenuComponent;
