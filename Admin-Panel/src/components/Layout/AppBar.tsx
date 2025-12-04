import React from "react";
import { AppBar as RaAppBar } from "react-admin";
import { styled } from "@mui/material/styles";
import { Typography, Box, Button } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";

const AppBarStyled = styled(RaAppBar)(({ theme }) => ({
  "& .RaAppBar-toolbar": {
    backgroundColor: "#1e293b",
    backgroundImage: "linear-gradient(90deg, #1e293b 0%, #334155 100%)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
    minHeight: "64px",
    position: "fixed",
    width: "100%",
    zIndex: 1300,
  },
  "& .RaAppBar-menuButton": {
    color: "white",
  },
  "& .RaAppBar-title": {
    color: "white",
    fontSize: "1.25rem",
    fontWeight: 600,
    flexGrow: 1,
  },
}));

const AppBar = (props: any) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  return (
    <AppBarStyled {...props}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Typography variant="h6">🚀 پنل مدیریت تورینو</Typography>

        <Button
          color="inherit"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          خروج
        </Button>
      </Box>
    </AppBarStyled>
  );
};

export default AppBar;
