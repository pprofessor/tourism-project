import React, { useState, useEffect, useCallback } from 'react';
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
  CircularProgress,
  Chip,
  Tooltip,
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
  Close,
  Refresh,
  GetApp,
  ContentCopy
} from '@mui/icons-material';
import { mediaService, MediaFile } from '../../services/mediaService';

// کامپوننت برای نمایش فایل
const MediaFileCard: React.FC<{
  file: MediaFile;
  viewMode: 'grid' | 'list' | 'large';
  onEdit: (file: MediaFile) => void;
  onDelete: (id: string) => void;
  onDownload?: (file: MediaFile) => void;
  editingFileId: string | null;
  editFileName: string;
  editLoading: boolean;
  onStartEditing: (file: MediaFile) => void;
  onCancelEditing: () => void;
  onConfirmEdit: (fileId: string, newName: string) => void;
  onCopyUrl?: (url: string) => void;
}> = ({ 
  file, 
  viewMode, 
  onEdit, 
  onDelete, 
  onDownload,
  editingFileId,
  editFileName,
  editLoading,
  onStartEditing,
  onCancelEditing,
  onConfirmEdit,
  onCopyUrl
}) => {
  const [imageError, setImageError] = useState(false);

  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return <Image color="primary" />;
      case 'video': return <VideoFile color="secondary" />;
      case 'audio': return <AudioFile color="success" />;
      default: return <InsertDriveFile color="action" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? 'تاریخ نامشخص' 
        : date.toLocaleDateString('fa-IR');
    } catch {
      return 'تاریخ نامشخص';
    }
  };

  const getCardStyle = () => {
    switch (viewMode) {
      case 'grid':
        return { height: '100%', minHeight: 280 };
      case 'list':
        return { display: 'flex', alignItems: 'center', height: 'auto' };
      case 'large':
        return { height: '100%', minHeight: 350 };
      default:
        return { height: '100%' };
    }
  };

  const getImageStyle = () => {
    switch (viewMode) {
      case 'grid':
        return { height: 160, width: '100%' };
      case 'list':
        return { height: 60, width: 80 };
      case 'large':
        return { height: 220, width: '100%' };
      default:
        return { height: 160, width: '100%' };
    }
  };

  return (
    <Card 
      sx={{ 
        ...getCardStyle(),
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
        {/* Header */}
        <Box display="flex" alignItems="flex-start" mb={viewMode === 'list' ? 0 : 2}>
          <IconButton size="small" sx={{ mr: 1 }}>
            {getFileIcon(file.type)}
          </IconButton>
          
          <Box flex={1} sx={{ minWidth: 0 }}>
            {/* حالت ویرایش یا نمایش */}
            {editingFileId === file.id ? (
              <Box display="flex" alignItems="center" gap={1}>
                <input
                  value={editFileName}
                  onChange={(e) => onStartEditing({ ...file, name: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onConfirmEdit(file.id, editFileName);
                    } else if (e.key === 'Escape') {
                      onCancelEditing();
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  autoFocus
                  disabled={editLoading}
                />
                <IconButton 
                  size="small" 
                  onClick={() => onConfirmEdit(file.id, editFileName)}
                  disabled={editLoading}
                  color="primary"
                >
                  <Check />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={onCancelEditing}
                  disabled={editLoading}
                  color="inherit"
                >
                  <Close />
                </IconButton>
              </Box>
            ) : (
              <Tooltip title={file.name}>
                <Typography 
                  variant={viewMode === 'list' ? "body1" : "h6"}
                  noWrap 
                  sx={{ fontWeight: 'medium', cursor: 'pointer' }}
                  onClick={() => onStartEditing(file)}
                >
                  {file.name}
                </Typography>
              </Tooltip>
            )}
            
            {/* اطلاعات فایل */}
            {viewMode !== 'list' && (
              <Box mt={1}>
                <Chip 
                  label={file.type} 
                  size="small" 
                  color={
                    file.type === 'image' ? 'primary' :
                    file.type === 'video' ? 'secondary' :
                    file.type === 'audio' ? 'success' : 'default'
                  }
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  📏 حجم: {formatFileSize(file.size)}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  📅 تاریخ: {formatDate(file.uploadedAt)}
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Actions */}
          <Box display="flex" flexDirection={viewMode === 'list' ? 'row' : 'column'} gap={0.5}>
            <Tooltip title="ویرایش نام">
              <IconButton 
                color="primary"
                onClick={() => onStartEditing(file)}
                disabled={editLoading}
                size="small"
              >
                <Edit />
              </IconButton>
            </Tooltip>
                       
            {onDownload && (
              <Tooltip title="دانلود">
                <IconButton 
                  color="info"
                  onClick={() => onDownload(file)}
                  size="small"
                >
                  <GetApp />
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title="حذف">
              <IconButton 
                color="error"
                onClick={() => onDelete(file.id)}
                disabled={editLoading}
                size="small"
              >
                <Delete />
              </IconButton>
            </Tooltip>

            <Tooltip title="کپی آدرس فایل">
  <IconButton 
    color="info"
    onClick={() => onCopyUrl?.(file.url)} // ✅ استفاده از prop
    size="small"
  >
    <ContentCopy />
  </IconButton>
</Tooltip>
          </Box>
        </Box>

        {/* اطلاعات مختصر برای حالت list */}
        {viewMode === 'list' && (
          <Box display="flex" gap={2} ml={2} flex={1}>
            <Chip 
              label={file.type} 
              size="small" 
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary">
              📏 {formatFileSize(file.size)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              📅 {formatDate(file.uploadedAt)}
            </Typography>
          </Box>
        )}

        {/* Image preview */}
        {file.type === 'image' && viewMode !== 'list' && (
          <Box mt={2}>
            <img 
              src={file.url}
              alt={file.name}
              style={{ 
                ...getImageStyle(),
                objectFit: 'cover',
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                display: imageError ? 'none' : 'block'
              }} 
              loading="lazy"
              onError={() => setImageError(true)}
            />
            {imageError && (
              <Box 
                sx={{ 
                  ...getImageStyle(),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'grey.100',
                  borderRadius: 2
                }}
              >
                <Image sx={{ fontSize: 48, color: 'grey.400' }} />
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const MediaManager: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editFileName, setEditFileName] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'large'>('grid');
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

 // بارگذاری فایل‌ها
const loadFiles = useCallback(async () => {
  try {
    setLoading(true);
    console.log('🔄 شروع بارگذاری فایل‌ها...');
    
    const response = await mediaService.getFiles();
    
    console.log('📋 پاسخ از mediaService:', response);
    
    if (response.success && response.data) {
      console.log('✅ تعداد فایل‌های دریافت شده:', response.data.length);
      
      // ✅ لاگ مفصل برای دیباگ تصاویر
      const imageFiles = response.data.filter((file: MediaFile) => file.type === 'image');
      console.log('🖼️ تعداد فایل‌های تصویری:', imageFiles.length);
      
      imageFiles.forEach((file: MediaFile, index: number) => {
        console.log(`📸 تصویر ${index + 1}:`, {
          name: file.name,
          url: file.url,
          size: file.size,
          type: file.type
        });
        
        // ✅ تست پیش‌بارگذاری تصاویر - روش درست
        const testImage = document.createElement('img');
        testImage.onload = () => console.log(`✅ تصویر "${file.name}" قابل دسترس است`);
        testImage.onerror = () => console.log(`❌ خطا در بارگذاری تصویر "${file.name}" - آدرس: ${file.url}`);
        testImage.src = file.url;
      });

      // ✅ لاگ فایل‌های غیرتصویری هم
      const otherFiles = response.data.filter((file: MediaFile) => file.type !== 'image');
      console.log('📄 فایل‌های غیرتصویری:', otherFiles.length);
      
      // ✅ نمایش اولین فایل تصویری برای تست
      if (imageFiles.length > 0) {
        const firstImage = imageFiles[0];
        console.log('🔍 تست اولین تصویر:', {
          name: firstImage.name,
          url: firstImage.url,
          fullInfo: firstImage
        });
      }
      
      setFiles(response.data);
      
      console.log('🎉 بارگذاری فایل‌ها با موفقیت انجام شد');
    } else {
      console.log('❌ خطا در دریافت فایل‌ها:', response.message);
      setSnackbar({
        open: true,
        message: response.message,
        severity: 'error'
      });
    }
  } catch (error) {
    console.error('💥 خطای غیرمنتظره در بارگذاری فایل‌ها:', error);
    setSnackbar({
      open: true,
      message: 'خطا در بارگذاری فایل‌ها',
      severity: 'error'
    });
  } finally {
    setLoading(false);
  }
}, []);





  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

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

  // تایید ویرایش
  const handleEditFileName = async (fileId: string, newName: string) => {
  if (!newName.trim()) {
    setSnackbar({
      open: true,
      message: 'نام فایل نمی‌تواند خالی باشد',
      severity: 'error'
    });
    return;
  }

  const file = files.find(f => f.id === fileId);
  if (file && file.name === newName) {
    cancelEditing();
    return;
  }

  try {
    setEditLoading(true);
    const response = await mediaService.renameFile(fileId, newName);
    
    if (response.success && response.data) {
      // ✅ استفاده از data با type assertion
      const responseData = response.data as { newName: string; newUrl: string };
      
      // ✅ آپدیت state با اطلاعات جدید از سرور
      setFiles(prev => prev.map(file => 
        file.id === fileId ? { 
          ...file, 
          name: responseData.newName,
          url: responseData.newUrl,
          id: responseData.newName
        } : file
      ));
      
      cancelEditing();
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

  // آپلود فایل
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = '';

    if (file.size > 50 * 1024 * 1024) {
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

  const handleUploadConfirm = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const response = await mediaService.uploadFile(selectedFile);
      
      if (response.success) {
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

  // حذف فایل
  const handleDeleteFile = async (id: string) => {
    if (!window.confirm('آیا از حذف این فایل اطمینان دارید؟')) return;

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

  // دانلود فایل
  const handleDownloadFile = (file: MediaFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
  const handleCopyFileUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setSnackbar({
        open: true,
        message: 'آدرس فایل در کلیپ‌بورد کپی شد',
        severity: 'success'
      });
    } catch (error) {
      // Fallback برای مرورگرهای قدیمی
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setSnackbar({
        open: true,
        message: 'آدرس فایل کپی شد',
        severity: 'success'
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* هدر */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          مدیریت فایل‌های رسانه‌ای
          <Typography variant="subtitle1" color="text.secondary">
            {files.length} فایل found
          </Typography>
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2}>
          {/* View Mode Buttons */}
          <Box display="flex" border={1} borderColor="grey.300" borderRadius={2}>
            <Tooltip title="نمایش شبکه‌ای">
              <IconButton 
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
                size="small"
              >
                <ViewModule />
              </IconButton>
            </Tooltip>
            <Tooltip title="نمایش لیستی">
              <IconButton 
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
                size="small"
              >
                <ViewList />
              </IconButton>
            </Tooltip>
            <Tooltip title="نمایش بزرگ">
              <IconButton 
                onClick={() => setViewMode('large')}
                color={viewMode === 'large' ? 'primary' : 'default'}
                size="small"
              >
                <ViewCompact />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Refresh Button */}
          <Tooltip title="بارگذاری مجدد">
            <IconButton 
              onClick={loadFiles}
              disabled={loading}
              color="primary"
            >
              <Refresh />
            </IconButton>
          </Tooltip>

          {/* Upload Button */}
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

      {/* Files Grid */}
      {!loading && files.length > 0 && (
        <Box sx={{ 
  display: 'grid', 
  gridTemplateColumns: { 
    xs: '1fr',
    md: viewMode === 'list' ? '1fr' : viewMode === 'large' ? '1fr 1fr' : '1fr 1fr 1fr' 
  },
  gap: 3 
}}>
  {files.map((file) => (
    <Box key={file.id}>
              <MediaFileCard
                file={file}
                viewMode={viewMode}
                onEdit={startEditing}
                onDelete={handleDeleteFile}
                onDownload={handleDownloadFile}
                editingFileId={editingFileId}
                editFileName={editFileName}
                editLoading={editLoading}
                onStartEditing={startEditing}
                onCancelEditing={cancelEditing}
                onConfirmEdit={handleEditFileName}
                onCopyUrl={handleCopyFileUrl}
              />
            </Box>
  ))}
</Box>
      )}

      {/* Upload Dialog */}
      <Dialog 
        open={openUpload} 
        onClose={() => !uploading && setOpenUpload(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>آپلود فایل جدید</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body1" gutterBottom>
                <strong>نام فایل:</strong> {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>سایز:</strong> {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>نوع:</strong> {selectedFile.type || 'نامشخص'}
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

      {/* Snackbar */}
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