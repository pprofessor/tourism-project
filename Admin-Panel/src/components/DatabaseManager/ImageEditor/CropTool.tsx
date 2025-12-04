import React, { useState } from "react";
import { Box, Slider, Typography, Button } from "@mui/material";
import { CropArea } from "./types";

interface CropToolProps {
  image: string;
  onCrop: (cropArea: CropArea) => void;
  aspectRatio?: number;
}

const CropTool: React.FC<CropToolProps> = ({
  image,
  onCrop,
  aspectRatio = 16 / 9,
}) => {
  const [crop, setCrop] = useState<CropArea>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  const handleCropApply = () => {
    onCrop(crop);
  };

  return (
    <Box sx={{ direction: "rtl" }}>
      <Typography variant="h6" gutterBottom>
        ابزار برش تصویر
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>عرض: {crop.width}%</Typography>
        <Slider
          value={crop.width}
          onChange={(_, value) =>
            setCrop((prev: CropArea) => ({ ...prev, width: value as number }))
          }
          min={10}
          max={100}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>ارتفاع: {crop.height}%</Typography>
        <Slider
          value={crop.height}
          onChange={(_, value) =>
            setCrop((prev: CropArea) => ({ ...prev, height: value as number }))
          }
          min={10}
          max={100}
        />
      </Box>

      <Button variant="contained" onClick={handleCropApply}>
        اعمال برش
      </Button>
    </Box>
  );
};

export default CropTool;
