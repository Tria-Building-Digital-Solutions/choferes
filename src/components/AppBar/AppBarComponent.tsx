import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuComponent from "../Menu/MenuComponent"
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

interface AppBarComponentProps {
  icon?: React.ReactNode;
  title: string;
  links: { label: string; path: string }[];
}

const AppBarComponent: React.FC<AppBarComponentProps> = ({
  icon,
  title,
  links,
}) => {

  const menuItems = links.map((link) => ({
    text: link.label,
    onClick: () => {
      window.location.href = link.path;
    },
  }));

  return (
    <AppBar position="static">
      <Toolbar variant="regular">
        {icon && (
          <IconButton edge="start" color="inherit" aria-label="menu">
            {icon}
          </IconButton>
        )}
        <Typography variant="h5" sx={{ flexGrow: 1, fontFamily: "'Protest Guerrilla', sans-serif" }}>
          {title}
        </Typography>
        <MenuComponent
          icon={<MenuRoundedIcon/>} 
          menuItems={menuItems}
        />
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
