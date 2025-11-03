// ADMIN-PANEL/src/components/DatabaseManager/SliderManagement.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { sliderService, type Slide } from '../../services/sliderService'; 
import { mediaService, type MediaFile } from '../../services/mediaService';

import {
  Box,
  Card,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Chip,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  MenuItem  
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Upload,
  
} from '@mui/icons-material';

interface SliderFormData {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  altText: string;
  seoTitle: string;
  seoDescription: string;
   mediaSource: 'UPLOAD' | 'MEDIA_LIBRARY';
  transitionType: 'fade' | 'slide' | 'zoom' | 'flip';
  navigationType: 'dots' | 'arrows' | 'dots_arrows' | 'custom';
  customNavigation: string;
  slideInterval: number;
  transitionDuration: number;
}

const SliderManagement: React.FC = () => {
  const theme = useTheme();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
const [mediaLoading, setMediaLoading] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState<SliderFormData>({
    title: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    altText: '',
    seoTitle: '',
    seoDescription: '',
    mediaSource: 'UPLOAD',
  transitionType: 'fade',
  navigationType: 'dots_arrows',
  customNavigation: 'default',
  slideInterval: 5000,
  transitionDuration: 500
  });


  // بارگذاری فایل‌های مدیا
const loadMediaFiles = async () => {
  try {
    setMediaLoading(true);
    const result = await mediaService.getFiles();
    if (result.success && result.data) {
      setMediaFiles(result.data);
    }
  } catch (error) {
    console.error('Error loading media files:', error);
  } finally {
    setMediaLoading(false);
  }
};


  // بارگذاری اسلایدها
  const loadSlides = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sliderService.getAllSlides();
      setSlides(data);
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'خطا در بارگذاری اسلایدها', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSlides();
  }, [loadSlides]);

  // مدیریت آپلود تصویر
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSnackbar({ 
        open: true, 
        message: 'فرمت تصویر نامعتبر است', 
        severity: 'error' 
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ 
        open: true, 
        message: 'سایز تصویر نباید بیشتر از 5MB باشد', 
        severity: 'error' 
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // شبیه‌سازی آپلود
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  // باز کردن مدال برای اسلاید جدید
const handleAddSlide = () => {
  setEditingSlide(null);
  setFormData({
    title: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    altText: '',
    seoTitle: '',
    seoDescription: '',
    mediaSource: 'UPLOAD',
    transitionType: 'fade',
    navigationType: 'dots_arrows',
    customNavigation: 'default',
    slideInterval: 5000,
    transitionDuration: 500
  });
  setImagePreview('');
  setOpenDialog(true);
};

// باز کردن مدال برای ویرایش
const handleEditSlide = (slide: Slide) => {
  setEditingSlide(slide);
  setFormData({
    title: slide.title,
    description: slide.description,
    buttonText: slide.buttonText,
buttonLink: slide.buttonLink, 
   altText: slide.altText,
    seoTitle: slide.seoTitle || '',
    seoDescription: slide.seoDescription || '',
    mediaSource: slide.mediaSource || 'UPLOAD',
    transitionType: slide.transitionType || 'fade',
    navigationType: slide.navigationType || 'dots_arrows',
    customNavigation: slide.customNavigation || 'default',
    slideInterval: slide.slideInterval || 5000,
    transitionDuration: slide.transitionDuration || 500
  });
setImagePreview(slide.image);
  setOpenDialog(true);
};

  // ذخیره اسلاید
 const handleSaveSlide = async () => {
  if (!formData.title.trim() || !formData.description.trim() || !imagePreview) {
    setSnackbar({ 
      open: true, 
      message: 'لطفاً فیلدهای ضروری را پر کنید', 
      severity: 'error' 
    });
    return;
  }

  try {
    const slideData = {
      title: formData.title,
      description: formData.description,
      buttonText: formData.buttonText,
      buttonLink: formData.buttonLink, // تغییر از buttonLink به targetUrl
image: imagePreview,
      altText: formData.altText,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      isActive: true,
displayOrder: editingSlide ? editingSlide.displayOrder : slides.length,      // فیلدهای پیشرفته
      mediaSource: formData.mediaSource,
      transitionType: formData.transitionType,
      navigationType: formData.navigationType,
      customNavigation: formData.customNavigation,
      slideInterval: formData.slideInterval,
      transitionDuration: formData.transitionDuration
    };

    if (editingSlide) {
      await sliderService.updateSlide(editingSlide.id.toString(), slideData);
    } else {
      await sliderService.createSlide(slideData);
    }
    
    setOpenDialog(false);
    loadSlides();
    setSnackbar({ 
      open: true, 
      message: editingSlide ? 'اسلاید با موفقیت به‌روزرسانی شد' : 'اسلاید جدید با موفقیت ایجاد شد', 
      severity: 'success' 
    });
  } catch (error) {
    setSnackbar({ 
      open: true, 
      message: 'خطا در ذخیره اسلاید', 
      severity: 'error' 
    });
  }
};

  // حذف اسلاید
  const handleDeleteSlide = async (id: number) => { // تغییر نوع به number
  if (!window.confirm('آیا از حذف این اسلاید مطمئن هستید؟')) return;

  try {
    await sliderService.deleteSlide(id.toString()); // تبدیل به string
    setSnackbar({ 
      open: true, 
      message: 'اسلاید با موفقیت حذف شد', 
      severity: 'success' 
    });
    loadSlides();
  } catch (error) {
    setSnackbar({ 
      open: true, 
      message: 'خطا در حذف اسلاید', 
      severity: 'error' 
    });
  }
};

  // تغییر وضعیت فعال/غیرفعال
  const handleToggleStatus = async (slide: Slide) => {
  try {
await sliderService.toggleSlideStatus(slide.id.toString(), !slide.isActive);    setSnackbar({ 
      open: true, 
      message: slide.isActive ? 'اسلاید غیرفعال شد' : 'اسلاید فعال شد', // تغییر به active
      severity: 'success' 
    });
    loadSlides();
  } catch (error) {
    setSnackbar({ 
      open: true, 
      message: 'خطا در تغییر وضعیت اسلاید', 
      severity: 'error' 
    });
  }
};

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* هدر و دکمه افزودن */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          مدیریت اسلایدشو
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddSlide}
          size={isMobile ? "medium" : "large"}
        >
          افزودن اسلاید
        </Button>
      </Box>

      {/* لیست اسلایدها */}
      <Box 
        display="grid" 
        gridTemplateColumns={{
          xs: '1fr',
          md: '1fr 1fr',
          lg: '1fr 1fr 1fr'
        }}
        gap={3}
      >
        {slides.map((slide) => (
          <Card key={slide.id}>
            <Box position="relative">
              {/* تصویر اسلاید */}
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `url(${slide.image})`,

                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}
              >
                {/* وضعیت */}
                <Chip
  label={slide.isActive ? 'فعال' : 'غیرفعال'} // تغییر به active
  color={slide.isActive ? 'success' : 'default'} // تغییر به active
  size="small"
  sx={{ position: 'absolute', top: 8, left: 8 }}
/>
              </Box>

              {/* محتوای اسلاید */}
              <Box p={2}>
                <Typography variant="h6" noWrap title={slide.title}>
                  {slide.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {slide.description}
                </Typography>

                {/* اقدامات */}
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleToggleStatus(slide)}
                      title={slide.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
                    >
                      {slide.isActive ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditSlide(slide)}
                      title="ویرایش"
                    >
                      <Edit />
                    </IconButton>
                  </Box>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDeleteSlide(slide.id)}
                    title="حذف"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      {/* مدال افزودن/ویرایش اسلاید */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingSlide ? 'ویرایش اسلاید' : 'افزودن اسلاید'}
        </DialogTitle>
        
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* آپلود تصویر */}
<Box>
  <Typography variant="h6" gutterBottom>
    تصویر اسلاید
  </Typography>
  
  <Box display="flex" gap={2} mb={2}>
    <Button
      variant={formData.mediaSource === 'UPLOAD' ? 'contained' : 'outlined'}
      onClick={() => setFormData(prev => ({ ...prev, mediaSource: 'UPLOAD' }))}
    >
      آپلود جدید
    </Button>
    <Button
      variant={formData.mediaSource === 'MEDIA_LIBRARY' ? 'contained' : 'outlined'}
      onClick={() => {
        setFormData(prev => ({ ...prev, mediaSource: 'MEDIA_LIBRARY' }));
        loadMediaFiles();
      }}
    >
      انتخاب از کتابخانه
    </Button>
  </Box>

  {formData.mediaSource === 'UPLOAD' && (
    <Box 
      sx={{ 
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        position: 'relative'
      }}
      onClick={() => document.getElementById('image-upload')?.click()}
    >
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
      
      {imagePreview ? (
        <Box>
          <img 
            src={imagePreview} 
            alt="Preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: 200, 
              borderRadius: 8 
            }} 
          />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Box mt={1}>
              <CircularProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" mt={1}>
                {uploadProgress}% آپلود شده
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          <Upload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body1" color="text.secondary">
            برای آپلود تصویر کلیک کنید
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            فرمت‌های مجاز: JPG, PNG, GIF - حداکثر سایز: 5MB
          </Typography>
        </Box>
      )}
    </Box>
  )}

  {formData.mediaSource === 'MEDIA_LIBRARY' && (
    <Box>
      {mediaLoading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 2,
            maxHeight: 300,
            overflow: 'auto',
            p: 1
          }}
        >
          {mediaFiles.filter(file => file.type === 'image').map((file) => (
            <Card 
              key={file.id}
              sx={{ 
                cursor: 'pointer',
                border: imagePreview === file.url ? '2px solid' : '1px solid',
                borderColor: imagePreview === file.url ? 'primary.main' : 'divider'
              }}
              onClick={() => setImagePreview(file.url)}
            >
              <Box sx={{ height: 100, position: 'relative' }}>
                <img 
                  src={file.url} 
                  alt={file.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
              <Box p={1}>
                <Typography variant="body2" noWrap title={file.name}>
                  {file.name}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  )}
</Box>

            {/* فیلدهای فرم */}
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
              <TextField
                fullWidth
                label="عنوان اسلاید"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
              <TextField
                fullWidth
                label="متن دکمه"
                value={formData.buttonText}
                onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                required
              />
            </Box>

            <TextField
              fullWidth
              label="توضیحات"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              required
            />

            <TextField
              fullWidth
              label="لینک دکمه"
              value={formData.buttonLink}
              onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
              placeholder="#tours یا /tours"
              required
            />

            <TextField
              fullWidth
              label="متن جایگزین تصویر"
              value={formData.altText}
              onChange={(e) => setFormData(prev => ({ ...prev, altText: e.target.value }))}
              helperText="این متن برای دسترسی‌پذیری و سئو مهم است"
              required
            />

            {/* فیلدهای سئو */}
            <Box>
              <Typography variant="h6" gutterBottom>
                تنظیمات سئو
              </Typography>
              <TextField
                fullWidth
                label="عنوان سئو"
                value={formData.seoTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                helperText="عنوان برای بهینه‌سازی موتورهای جستجو"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="توضیحات سئو"
                value={formData.seoDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                multiline
                rows={2}
                helperText="توضیحات متا برای بهینه‌سازی موتورهای جستجو"
              />
            </Box>

{/* تنظیمات پیشرفته اسلایدشو */}
<Box>
  <Typography variant="h6" gutterBottom>
    تنظیمات پیشرفته اسلایدشو
  </Typography>
  
  <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} mb={2}>
    <TextField
      fullWidth
      select
      label="منبع تصویر"
      value={formData.mediaSource}
      onChange={(e) => setFormData(prev => ({ ...prev, mediaSource: e.target.value as 'UPLOAD' | 'MEDIA_LIBRARY' }))}
      helperText="منبع فایل اسلاید"
    >
      <MenuItem value="UPLOAD">آپلود جدید</MenuItem>
      <MenuItem value="MEDIA_LIBRARY">کتابخانه مدیا</MenuItem>
    </TextField>
    
    <TextField
      fullWidth
      select
      label="نوع انتقال"
      value={formData.transitionType}
      onChange={(e) => setFormData(prev => ({ ...prev, transitionType: e.target.value as 'fade' | 'slide' | 'zoom' | 'flip' }))}
      helperText="انیمیشن تغییر اسلاید"
    >
      <MenuItem value="fade">Fade (محو)</MenuItem>
      <MenuItem value="slide">Slide (لغزش)</MenuItem>
      <MenuItem value="zoom">Zoom (زوم)</MenuItem>
      <MenuItem value="flip">Flip (چرخش)</MenuItem>
    </TextField>
  </Box>

  <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} mb={2}>
    <TextField
      fullWidth
      select
      label="نوع ناوبری"
      value={formData.navigationType}
      onChange={(e) => setFormData(prev => ({ ...prev, navigationType: e.target.value as 'dots' | 'arrows' | 'dots_arrows' | 'custom' }))}
      helperText="دکمه‌های تغییر اسلاید"
    >
      <MenuItem value="dots">نقطه‌ها</MenuItem>
      <MenuItem value="arrows">فلش‌ها</MenuItem>
      <MenuItem value="dots_arrows">نقطه و فلش</MenuItem>
      <MenuItem value="custom">نمادهای خاص</MenuItem>
    </TextField>
    
    <TextField
      fullWidth
      label="زمان تعویض (میلی‌ثانیه)"
      type="number"
      value={formData.slideInterval}
      onChange={(e) => setFormData(prev => ({ ...prev, slideInterval: parseInt(e.target.value) || 5000 }))}
      helperText="مثال: 5000 = 5 ثانیه"
    />
  </Box>
</Box>

          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            لغو
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveSlide}
            disabled={!formData.title || !formData.description || !imagePreview}
          >
            {editingSlide ? 'بروزرسانی' : 'ذخیره'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* اسنک‌بار برای اطلاع‌رسانی */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SliderManagement;