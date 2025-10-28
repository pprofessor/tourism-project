import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Delete,
  Image,
  InsertDriveFile,
  AudioFile,
  VideoFile,
  ViewModule,
  ViewList,      
  ViewCompact,
  Edit,    
  Check,   
  Close   
   
} from '@mui/icons-material';
import { mediaService, MediaFile } from '../../services/mediaService';

interface ViewStyle {
  container: any;
  card: any;
  image: { 
    height: number; 
    width?: number; // اضافه کردن width به عنوان optional
  };
}

const MediaManager: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
const [editFileName, setEditFileName] = useState('');
const [editLoading, setEditLoading] = useState(false);
  
  
// ویرایش نام فایل
const handleEditFileName = async (fileId: string, newName: string) => {
  if (!newName.trim()) {
    setSnackbar({
      open: true,
      message: 'نام فایل نمی‌تواند خالی باشد',
      severity: 'error'
    });
    return;
  }

  // اگر نام تغییر نکرده، کاری نکن
  const file = files.find(f => f.id === fileId);
  if (file && file.name === newName) {
    setEditingFileId(null);
    setEditFileName('');
    return;
  }

  try {
    setEditLoading(true);
    
    // صدا زدن API برای تغییر نام فایل در بک‌اند
    const response = await mediaService.renameFile(fileId, newName);
    
    if (response.success) {
      // آپدیت state در فرانت‌اند
      setFiles(prev => prev.map(file => 
        file.id === fileId ? { ...file, name: newName } : file
      ));
      
      setEditingFileId(null);
      setEditFileName('');
      
      setSnackbar({
        open: true,
        message: 'نام فایل با موفقیت تغییر کرد',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: response.message,
        severity: 'error'
      });
    }
  } catch (error) {
    setSnackbar({
      open: true,
      message: 'خطا در تغییر نام فایل',
      severity: 'error'
    });
  } finally {
    setEditLoading(false);
  }
};

// شروع ویرایش
const startEditing = (file: MediaFile) => {
  setEditingFileId(file.id);
  setEditFileName(file.name);
};

// لغو ویرایش
const cancelEditing = () => {
  setEditingFileId(null);
  setEditFileName('');
};

// حالت‌های جدید برای نمایش
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'large'>('grid');
  
  //const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  // بارگذاری فایل‌ها از سرور
  useEffect(() => {
    loadFiles();
  }, []);

/// تابع برای استایل‌های مختلف بر اساس view mode
const getViewStyle = (): ViewStyle => {
  switch (viewMode) {
    case 'grid':
      return {
        container: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 },
        card: { height: '100%' },
        image: { height: 180 }
      };
    case 'list':
      return {
        container: { display: 'flex', flexDirection: 'column', gap: 2 },
        card: { display: 'flex', alignItems: 'center' },
        image: { height: 80, width: 120 } // حالا width مجاز هست
      };
    case 'large':
      return {
        container: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 3 },
        card: { height: '100%' },
        image: { height: 250 }
      };
    default:
      return {
        container: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 },
        card: { height: '100%' },
        image: { height: 180 }
      };
  }
};

  // تابع برای بارگذاری فایل‌ها
  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await mediaService.getFiles();
      
      console.log('📋 پاسخ از mediaService:', response);
      
      if (response.success && response.data) {
        console.log('✅ فایل‌های قابل نمایش:', response.data);
        setFiles(response.data);
      } else {
        console.log('❌ خطا در دریافت فایل‌ها:', response.message);
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('💥 خطای غیرمنتظره:', error);
      setSnackbar({
        open: true,
        message: 'خطا در بارگذاری فایل‌ها',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getFileType = (file: File): MediaFile['type'] => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return <Image />;
      case 'video': return <VideoFile />;
      case 'audio': return <AudioFile />;
      default: return <InsertDriveFile />;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ریست کردن input برای آپلود فایل تکراری
    event.target.value = '';

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setSnackbar({
        open: true,
        message: 'سایز فایل نباید بیشتر از 50MB باشد',
        severity: 'error'
      });
      return;
    }

    setSelectedFile(file);
    setOpenUpload(true);
  };

  // آپلود فایل به سرور
  const handleUploadConfirm = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const response = await mediaService.uploadFile(selectedFile);
      
      if (response.success) {
        // ریلود لیست فایل‌ها از سرور
        await loadFiles();
        setOpenUpload(false);
        setSelectedFile(null);
        setSnackbar({
          open: true,
          message: 'فایل با موفقیت آپلود شد',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'خطا در آپلود فایل',
        severity: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  // حذف فایل از سرور
  const handleDeleteFile = async (id: string) => {
    try {
      const response = await mediaService.deleteFile(id);
      
      if (response.success) {
        setFiles(prev => prev.filter(file => file.id !== id));
        setSnackbar({
          open: true,
          message: 'فایل با موفقیت حذف شد',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'خطا در حذف فایل',
        severity: 'error'
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

// تابع برای فرمت تاریخ
const formatDate = (dateString: string, fileName: string) => {
  try {
    const date = new Date(dateString);
    
    // اگر تاریخ معتبر نیست، از timestamp استفاده کن
    if (isNaN(date.getTime())) {
      // سعی کن تاریخ رو از نام فایل استخراج کنی
      const timestampMatch = fileName.match(/^(\d+)_/);
      if (timestampMatch) {
        const timestamp = parseInt(timestampMatch[1]);
        const validDate = new Date(timestamp);
        return validDate.toLocaleDateString('fa-IR');
      }
      return 'تاریخ نامشخص';
    }
    
    return date.toLocaleDateString('fa-IR');
  } catch (error) {
    return 'تاریخ نامشخص';
  }
};

// تابع برای فرمت زمان
const formatTime = (dateString: string, fileName: string) => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      const timestampMatch = fileName.match(/^(\d+)_/);
      if (timestampMatch) {
        const timestamp = parseInt(timestampMatch[1]);
        const validDate = new Date(timestamp);
        return validDate.toLocaleTimeString('fa-IR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
      return 'زمان نامشخص';
    }
    
    return date.toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    return 'زمان نامشخص';
  }
};


  return (
    <Box sx={{ p: 3 }}>
      {/* هدر و دکمه آپلود */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
  <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
    مدیریت فایل‌های رسانه‌ای
  </Typography>
  
  <Box display="flex" alignItems="center" gap={2}>
    {/* دکمه‌های تغییر حالت نمایش */}
    <Box display="flex" border={1} borderColor="grey.300" borderRadius={2}>
      <IconButton 
        onClick={() => setViewMode('grid')}
        color={viewMode === 'grid' ? 'primary' : 'default'}
        size="small"
        title="نمایش شبکه‌ای"
      >
        <ViewModule />
      </IconButton>
      <IconButton 
        onClick={() => setViewMode('list')}
        color={viewMode === 'list' ? 'primary' : 'default'}
        size="small"
        title="نمایش لیستی"
      >
        <ViewList />
      </IconButton>
      <IconButton 
        onClick={() => setViewMode('large')}
        color={viewMode === 'large' ? 'primary' : 'default'}
        size="small"
        title="نمایش بزرگ"
      >
        <ViewCompact />
      </IconButton>
    </Box>

    {/* دکمه آپلود */}
    <Button
      variant="contained"
      startIcon={loading ? <CircularProgress size={20} /> : <Add />}
      onClick={() => document.getElementById('file-upload')?.click()}
      disabled={loading}
      size="large"
    >
      {loading ? 'در حال بارگذاری...' : 'آپلود فایل'}
    </Button>
  </Box>
  
  <input
    id="file-upload"
    type="file"
    onChange={handleFileUpload}
    style={{ display: 'none' }}
    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
  />
</Box>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            در حال بارگذاری فایل‌ها...
          </Typography>
        </Box>
      )}

      {/* Empty State */}
      {!loading && files.length === 0 && (
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center" 
          height={300}
          border={1}
          borderColor="grey.300"
          borderRadius={2}
        >
          <Image sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            فایلی برای نمایش وجود ندارد
          </Typography>
          <Typography variant="body2" color="text.secondary">
            اولین فایل خود را آپلود کنید
          </Typography>
        </Box>
      )}

      {/* List Files */}
{!loading && files.length > 0 && (
  <Box sx={getViewStyle().container as any}>
    {files.map((file) => (
      <Card 
  key={file.id} 
  sx={{ 
    ...(getViewStyle().card as any),
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 4
    }
  }}
>
  <CardContent sx={{ 
    flexGrow: 1, 
    p: viewMode === 'list' ? 2 : 3,
    display: viewMode === 'list' ? 'flex' : 'block',
    alignItems: viewMode === 'list' ? 'center' : 'normal',
    width: '100%'
  }}>
    {/* Header with icon and actions */}
    <Box display="flex" alignItems="flex-start" mb={viewMode === 'list' ? 0 : 2}>
      <IconButton size="large" sx={{ color: 'primary.main' }}>
        {getFileIcon(file.type)}
      </IconButton>
      <Box flex={1} ml={2} sx={{ minWidth: 0 }}>
        {/* حالت ویرایش یا نمایش */}
  {editingFileId === file.id ? (
    <Box display="flex" alignItems="center" gap={1}>
      <input
        value={editFileName}
        onChange={(e) => setEditFileName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleEditFileName(file.id, editFileName);
          } else if (e.key === 'Escape') {
            cancelEditing();
          }
        }}
        style={{
          flex: 1,
          padding: '4px 8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: viewMode === 'list' ? '14px' : '16px'
        }}
        autoFocus
        disabled={editLoading}
      />
      <IconButton 
        size="small" 
        onClick={() => handleEditFileName(file.id, editFileName)}
        disabled={editLoading}
        color="primary"
      >
        <Check />
      </IconButton>
      <IconButton 
        size="small" 
        onClick={cancelEditing}
        disabled={editLoading}
        color="inherit"
      >
        <Close />
      </IconButton>
    </Box>
  ) : (
    <Typography 
      variant={viewMode === 'list' ? "body1" : "h6"}
      noWrap 
      title={file.name}
      sx={{ fontWeight: 'medium' }}
    >
      {file.name.length > 30 ? file.name.substring(0, 30) + '...' : file.name}
    </Typography>
  )}
        
{/* اطلاعات فایل - فقط در حالت‌های grid و large */}
{viewMode !== 'list' && (
  <Box mt={1}>
    <Typography variant="caption" color="text.secondary" display="block">
      📏 حجم: {formatFileSize(file.size)}
    </Typography>
    <Typography variant="caption" color="text.secondary" display="block">
      📅 تاریخ آپلود: {formatDate(file.uploadedAt, file.name)}
    </Typography>
    <Typography variant="caption" color="text.secondary" display="block">
      🕒 زمان: {formatTime(file.uploadedAt, file.name)}
    </Typography>
    <Typography 
      variant="caption" 
      color="text.secondary" 
      display="block"
      sx={{ 
        wordBreak: 'break-all',
        fontFamily: 'monospace',
        fontSize: '0.7rem'
      }}
      title={file.url} // نمایش کامل آدرس در tooltip
    >
      🔗 آدرس: {file.url}
    </Typography>
  </Box>
)}
      </Box>
      
      {/* Actions */}
<Box display="flex" flexDirection={viewMode === 'list' ? 'row' : 'column'} gap={1}>
  {/* دکمه ویرایش */}
  <IconButton 
    color="primary"
    onClick={() => startEditing(file)}
    aria-label={`ویرایش ${file.name}`}
    disabled={loading}
    size="small"
  >
    <Edit />
  </IconButton>
  
  {/* دکمه حذف */}
  <IconButton 
    color="error"
    onClick={() => handleDeleteFile(file.id)}
    aria-label={`حذف ${file.name}`}
    disabled={loading}
    size="small"
  >
    <Delete />
  </IconButton>
</Box>
    </Box>
    
    {/* اطلاعات مختصر برای حالت list */}
{viewMode === 'list' && (
  <Box display="flex" gap={2} ml={2}>
    <Typography variant="caption" color="text.secondary">
      📏 {formatFileSize(file.size)}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      📅 {formatDate(file.uploadedAt, file.name)}
    </Typography>
  </Box>
)}

    {/* Image preview - فقط در حالت‌های grid و large */}
    {file.type === 'image' && viewMode !== 'list' && (
      <Box mt={2}>
        <img 
          src={file.url} 
          alt={file.name}
          style={{ 
            width: '100%', 
            height: getViewStyle().image.height, 
            objectFit: 'cover',
            borderRadius: 8,
            border: '1px solid #e0e0e0'
          }} 
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik04MCA2MEgxMjBNODAgODBIMTIwTTgwIDEwMEgxMjBNNjAgNjBWNzBNNjAgODBWMTAwTTYwIDYwSDE0ME02MCA2MFYxNDBNNjAgMTQwSDE0ME0xNDAgMTQwVjYwIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
            e.currentTarget.alt = 'تصویر قابل نمایش نیست';
          }}
        />
      </Box>
    )}
  </CardContent>
</Card>
    ))}
  </Box>
)}
      {/* مدال آپلود */}
      <Dialog 
        open={openUpload} 
        onClose={() => !uploading && setOpenUpload(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          آپلود فایل جدید
        </DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body1" gutterBottom>
                <strong>نام فایل:</strong> {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>سایز:</strong> {formatFileSize(selectedFile.size)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>نوع:</strong> {getFileType(selectedFile)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setOpenUpload(false)} 
            disabled={uploading}
            color="inherit"
          >
            لغو
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUploadConfirm}
            disabled={!selectedFile || uploading}
            startIcon={uploading ? <CircularProgress size={16} /> : null}
          >
            {uploading ? 'در حال آپلود...' : 'آپلود فایل'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* اسنک‌بار */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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

export default MediaManager;