import React from "react";
import { Box } from "@mui/material";

const SimpleLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* محتوای اصلی */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SimpleLayout;
