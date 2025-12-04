import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import CropTool from "./CropTool";
import FilterTool from "./FilterTool";
import { ImageEditorProps, CropArea, FilterOptions } from "./types";

const ImageEditor: React.FC<ImageEditorProps> = ({
  image,
  onSave,
  onCancel,
  aspectRatio,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleCrop = (cropArea: CropArea) => {
    console.log("اعمال کراپ:", cropArea);
    // در آینده اینجا منطق کراپ واقعی پیاده‌سازی شود
  };

  const handleFilter = (filters: FilterOptions) => {
    console.log("اعمال فیلترها:", filters);
    // در آینده اینجا منطق فیلترها پیاده‌سازی شود
  };

  const handleSave = () => {
    onSave(image); // فعلاً تصویر اصلی را بازمی‌گردانیم
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle component="div" sx={{ textAlign: "right" }}>
        <Typography variant="h6" fontWeight="bold">
          ویرایش تصویر
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ direction: "rtl" }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
          >
            <Tab label="برش تصویر" />
            <Tab label="افکت‌ها" />
            <Tab label="تنظیمات پیشرفته" />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {activeTab === 0 && (
              <CropTool
                image={image}
                onCrop={handleCrop}
                aspectRatio={aspectRatio}
              />
            )}

            {activeTab === 1 && <FilterTool onFilterApply={handleFilter} />}

            {activeTab === 2 && (
              <Typography>تنظیمات پیشرفته در نسخه بعدی</Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">
          لغو
        </Button>
        <Button onClick={handleSave} variant="contained">
          ذخیره تغییرات
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageEditor;
