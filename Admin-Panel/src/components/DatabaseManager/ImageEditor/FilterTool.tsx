import React, { useState } from "react";
import { Box, Slider, Typography, Button } from "@mui/material";
import { FilterOptions } from "./types";

interface FilterToolProps {
  onFilterApply: (filters: FilterOptions) => void;
}

const FilterTool: React.FC<FilterToolProps> = ({ onFilterApply }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    blur: 0,
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });

  const handleApply = () => {
    onFilterApply(filters);
  };

  return (
    <Box sx={{ direction: "rtl" }}>
      <Typography variant="h6" gutterBottom>
        افکت‌های تصویر
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>مات کردن: {filters.blur}px</Typography>
        <Slider
          value={filters.blur}
          onChange={(_, value) =>
            setFilters((prev: FilterOptions) => ({
              ...prev,
              blur: value as number,
            }))
          }
          min={0}
          max={20}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>روشنایی: {filters.brightness}%</Typography>
        <Slider
          value={filters.brightness}
          onChange={(_, value) =>
            setFilters((prev: FilterOptions) => ({
              ...prev,
              brightness: value as number,
            }))
          }
          min={0}
          max={200}
        />
      </Box>

      <Button variant="contained" onClick={handleApply}>
        اعمال افکت‌ها
      </Button>
    </Box>
  );
};

export default FilterTool;
