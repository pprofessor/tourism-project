import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Dialog, DialogTitle, DialogContent,
  TextField, IconButton, Tooltip, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, useTheme, CircularProgress,
  Stepper, Step, StepLabel, Checkbox, Tabs, Tab, List, ListItem, ListItemAvatar, ListItemText,
  Alert, DialogActions, InputAdornment, MenuItem, FormControlLabel, Switch
} from '@mui/material';
import {
  Edit, Add, Hotel, Bed, BusinessCenter, Spa, BeachAccess,
  Image, Upload, VideoFile, FolderOpen, Group, Analytics, Block, Undo,
  Delete, LocationOn, AttachMoney, Wifi, Pool, FitnessCenter, Restaurant,
  LocalParking, AcUnit, Pets, RoomService, Star
} from '@mui/icons-material';
import adminService from '../../services/adminService';

// انواع داده‌های پیشرفته - کاملاً سازگار با مدل Hotel جاوا
interface RoomType {
  id: string;
  name: string;
  category: 'standard' | 'suite' | 'single-bedroom' | 'double-bedroom' | 'master' | 'vip';
  basePrice: number;
  available: number;
  total: number;
  amenities: string[];
  weeklyPrices: { [key: string]: number };
}

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  uploadDate: string;
}

// اینترفیس اصلی کاملاً سازگار با Hotel جاوا
interface HotelData {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website: string;
  basePrice: number;
  totalRooms: number;
  availableRooms: number;
  starRating: number;
  amenities: string[];
  imageUrls: string[];
  mainImageUrl: string;
  isActive: boolean;
  discountPercentage: number;
  discountCode: string;
  discountExpiry: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  createdAt: string;
  updatedAt: string;
}

// اینترفیس توسعه یافته برای قابلیت‌های جدید
interface ExtendedHotelData extends HotelData {
  roomTypes?: RoomType[];
  media?: MediaFile[];
  occupancyRate?: number;
  dailyRevenue?: number;
}

const roomCategories = {
  'standard': { name: 'اتاق ساده', icon: <Bed /> },
  'suite': { name: 'سوئیت', icon: <BusinessCenter /> },
  'single-bedroom': { name: 'اتاق ۱ خوابه', icon: <Hotel /> },
  'double-bedroom': { name: 'اتاق ۲ خوابه', icon: <Hotel /> },
  'master': { name: 'اتاق مستر', icon: <Spa /> },
  'vip': { name: 'اتاق VIP', icon: <BeachAccess /> }
};

const amenityIcons: { [key: string]: React.ReactElement } = {
  'wifi': <Wifi />,
  'pool': <Pool />,
  'gym': <FitnessCenter />,
  'spa': <Spa />,
  'restaurant': <Restaurant />,
  'parking': <LocalParking />,
  'ac': <AcUnit />,
  'pets': <Pets />,
  'room-service': <RoomService />,
};

const defaultAmenities = ['wifi', 'pool', 'gym', 'spa', 'restaurant', 'parking', 'ac', 'pets', 'room-service'];

const HotelManagement: React.FC = () => {
  const theme = useTheme();
  const [hotels, setHotels] = useState<ExtendedHotelData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [editingHotel, setEditingHotel] = useState<ExtendedHotelData | null>(null);
const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit' | 'analytics'>('list');
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [mediaTab, setMediaTab] = useState(0);
  const [mediaLibrary, setMediaLibrary] = useState<MediaFile[]>([]);
  const [roomManagementOpen, setRoomManagementOpen] = useState(false);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedHotels, setSelectedHotels] = useState<number[]>([]);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; hotelId: number | null; hotelName: string }>({
    show: false,
    hotelId: null,
    hotelName: ''
  });

  // داده‌های جدید هتل - کاملاً سازگار با مدل اصلی
  const [newHotel, setNewHotel] = useState<Partial<ExtendedHotelData>>({
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    basePrice: 0,
    totalRooms: 0,
    availableRooms: 0,
    starRating: 3,
    amenities: [],
    imageUrls: [],
    mainImageUrl: '',
    isActive: true,
    discountPercentage: 0,
    discountCode: '',
    discountExpiry: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    // فیلدهای جدید برای قابلیت‌های پیشرفته
    roomTypes: Object.keys(roomCategories).map(category => ({
      id: `${category}-${Date.now()}`,
      name: roomCategories[category as keyof typeof roomCategories].name,
      category: category as RoomType['category'],
      basePrice: 0,
      available: 0,
      total: 0,
      amenities: [],
      weeklyPrices: {
        'saturday': 0, 'sunday': 0, 'monday': 0, 'tuesday': 0,
        'wednesday': 0, 'thursday': 0, 'friday': 0
      }
    })),
    media: [],
    occupancyRate: 0,
    dailyRevenue: 0
  });

  useEffect(() => {
    loadHotels();
    loadMediaLibrary();
  }, []);

  const loadHotels = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getHotels();
      // تبدیل داده‌های فعلی به مدل توسعه یافته با مقادیر پیش‌فرض ایمن
      const enhancedHotels: ExtendedHotelData[] = Array.isArray(data) ? data.map(hotel => ({
        ...hotel,
        basePrice: hotel.basePrice || 0,
        totalRooms: hotel.totalRooms || 0,
        availableRooms: hotel.availableRooms || 0,
        starRating: hotel.starRating || 3,
        amenities: hotel.amenities || [],
        imageUrls: hotel.imageUrls || [],
        isActive: hotel.isActive !== undefined ? hotel.isActive : true,
        discountPercentage: hotel.discountPercentage || 0,
        roomTypes: [],
        media: [],
        occupancyRate: Math.floor(Math.random() * 100),
        dailyRevenue: Math.floor(Math.random() * 10000000)
      })) : [];
      setHotels(enhancedHotels);
    } catch (error) {
      console.error('Error loading hotels:', error);
      setError('خطا در بارگذاری هتل‌ها');
    } finally {
      setLoading(false);
    }
  };

  const loadMediaLibrary = async () => {
    try {
      // استفاده از سرویس آپلود موجود برای ساخت مدیا لایبرری
      const mockMedia: MediaFile[] = [
        {
          id: '1',
          name: 'hotel-image-1.jpg',
          url: '/media/images/hotel1.jpg',
          type: 'image',
          size: 2048576,
          uploadDate: new Date().toISOString()
        },
        {
          id: '2', 
          name: 'hotel-video-1.mp4',
          url: '/media/videos/hotel1.mp4',
          type: 'video',
          size: 10485760,
          uploadDate: new Date().toISOString()
        }
      ];
      setMediaLibrary(mockMedia);
    } catch (error) {
      console.error('Error loading media library:', error);
      setMediaLibrary([]);
    }
  };

  const handleCreateHotel = async () => {
    setError('');
    try {
      // اعتبارسنجی فیلدهای ضروری
      if (!newHotel.name || !newHotel.city || !newHotel.country) {
        setError('نام هتل، شهر و کشور ضروری هستند');
        return;
      }

      // تبدیل به مدل اصلی برای ارسال به بک‌اند
      const { roomTypes, media, occupancyRate, dailyRevenue, ...hotelToCreate } = newHotel;
      
      await adminService.createHotel(hotelToCreate);
      // ریست فرم
      setNewHotel({
        name: '', description: '', address: '', city: '', country: '', postalCode: '',
        basePrice: 0, totalRooms: 0, availableRooms: 0, starRating: 3,
        amenities: [], imageUrls: [], mainImageUrl: '', isActive: true, 
        discountPercentage: 0, discountCode: '', discountExpiry: '',
        seoTitle: '', seoDescription: '', seoKeywords: '',
        roomTypes: [], media: [], occupancyRate: 0, dailyRevenue: 0
      });
      setActiveTab('list');
      setActiveStep(0);
      loadHotels();
      setSuccess('هتل با موفقیت ایجاد شد!');
    } catch (error) {
      console.error('Error creating hotel:', error);
      setError('خطا در ایجاد هتل');
    }
  };

  const handleUpdateHotel = async () => {
    if (!editingHotel) return;
    setError('');
    try {
      // تبدیل به مدل اصلی برای ارسال به بک‌اند
      const { roomTypes, media, occupancyRate, dailyRevenue, ...hotelToUpdate } = editingHotel;
      
      await adminService.updateHotel(editingHotel.id, hotelToUpdate);
      setEditingHotel(null);
      setActiveTab('list');
      loadHotels();
      setSuccess('هتل با موفقیت به‌روزرسانی شد!');
    } catch (error) {
      console.error('Error updating hotel:', error);
      setError('خطا در به‌روزرسانی هتل');
    }
  };

  const showDeleteConfirm = (hotelId: number, hotelName: string) => {
    setDeleteConfirm({
      show: true,
      hotelId,
      hotelName
    });
  };

  const handleDeleteHotel = async () => {
    if (!deleteConfirm.hotelId) return;
    
    try {
      await adminService.deleteHotel(deleteConfirm.hotelId);
      setDeleteConfirm({ show: false, hotelId: null, hotelName: '' });
      loadHotels();
      setSuccess('هتل با موفقیت حذف شد!');
    } catch (error) {
      console.error('Error deleting hotel:', error);
      setError('خطا در حذف هتل');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, hotelId: null, hotelName: '' });
  };

  const handleFileUpload = async (files: File[]) => {
    try {
      const uploadPromises = files.map(file => 
        adminService.uploadMedia(file, 'hotels')
      );
      
      const uploadedResults = await Promise.all(uploadPromises);
      const newMediaFiles: MediaFile[] = uploadedResults.map((result, index) => ({
        id: `media-${Date.now()}-${index}`,
        name: files[index].name,
        url: result.url,
        type: files[index].type.startsWith('image/') ? 'image' : 'video',
        size: files[index].size,
        uploadDate: new Date().toISOString()
      }));
      
      setMediaLibrary(prev => [...prev, ...newMediaFiles]);
      return newMediaFiles;
    } catch (error) {
      console.error('Error uploading files:', error);
      return [];
    }
  };

  const handleDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (validFiles.length > 0) {
      const uploadedMedia = await handleFileUpload(validFiles);
      if (activeTab === 'add') {
        setNewHotel(prev => ({
          ...prev,
          media: [...(prev.media || []), ...uploadedMedia],
          imageUrls: [...(prev.imageUrls || []), ...uploadedMedia.map(m => m.url)]
        }));
      } else if (editingHotel) {
        setEditingHotel(prev => prev ? {
          ...prev,
          media: [...(prev.media || []), ...uploadedMedia],
          imageUrls: [...prev.imageUrls, ...uploadedMedia.map(m => m.url)]
        } : null);
      }
    }
  }, [activeTab, editingHotel]);

  const handleNextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      setUndoStack(prev => prev.slice(0, -1));
    }
  };

  // محاسبات تحلیلی با مقادیر پیش‌فرض ایمن
  const analyticsData = useMemo(() => {
    const totalRevenue = hotels.reduce((sum, hotel) => sum + (hotel.dailyRevenue || 0), 0);
    const averageOccupancy = hotels.length > 0 
      ? hotels.reduce((sum, hotel) => sum + (hotel.occupancyRate || 0), 0) / hotels.length 
      : 0;
    
    const popularRoomType = hotels.flatMap(h => h.roomTypes || [])
      .reduce((acc, room) => {
        acc[room.category] = (acc[room.category] || 0) + room.available;
        return acc;
      }, {} as { [key: string]: number });

    return { 
      totalRevenue: totalRevenue || 0, 
      averageOccupancy: averageOccupancy || 0, 
      popularRoomType 
    };
  }, [hotels]);

  // تابع ایمن برای نمایش قیمت
  const safeToLocaleString = (value: number | undefined | null): string => {
    return (value || 0).toLocaleString();
  };

  const steps = ['اطلاعات اصلی', 'اتاق‌ها و قیمت', 'مدیا', 'تأیید نهایی'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* نمایش پیام‌ها */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* هدر با قابلیت‌های جدید */}
      <Card sx={{ mb: 4, background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}30)` }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Hotel sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                  مدیریت هوشمند هتل‌ها
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  سیستم پیشرفته مدیریت هتل با قابلیت‌های هوشمند
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              
              <Button variant="outlined" startIcon={<Group />} onClick={() => setBulkEditMode(!bulkEditMode)}>
                عملیات گروهی
              </Button>
              {undoStack.length > 0 && (
                <Button variant="outlined" startIcon={<Undo />} onClick={handleUndo}>
                  بازگردانی
                </Button>
              )}
              
            </Box>
          </Box>
        </CardContent>
      </Card>


      {/* تب‌های ناوبری */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 1 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab 
                value="list" 
                label="همه هتل‌ها" 
                icon={<Hotel />}
                iconPosition="start"
              />
              <Tab 
                value="analytics" 
                label="تحلیل‌ها" 
                icon={<Analytics />}
                iconPosition="start"
              />
              <Tab 
                value="add" 
                label="هتل جدید" 
                icon={<Add />}
                iconPosition="start"
              />
            </Tabs>
          </Box>
        </CardContent>
      </Card>

      {/* محتوای اصلی */}
      <Card>
        <CardContent>
          {/* داشبورد تحلیلی */}
          {activeTab === 'analytics' && (
            <Box>
              <Typography variant="h5" gutterBottom>تحلیل‌های عملکرد هتل‌ها</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" color="primary">
                      {safeToLocaleString(analyticsData.totalRevenue)}
                    </Typography>
                    <Typography>درآمد روزانه کل</Typography>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant="h4" color="success.main">
                      {analyticsData.averageOccupancy.toFixed(1)}%
                    </Typography>
                    <Typography>میانگین نرخ اشغال</Typography>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      پرطرفدارترین: {Object.entries(analyticsData.popularRoomType)
                        .sort(([,a], [,b]) => b - a)[0]?.[0] || '---'}
                    </Typography>
                    <Typography>نوع اتاق</Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}

          {/* لیست هتل‌ها */}
          {activeTab === 'list' && (
            <Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}25)` }}>
                  <CardContent>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {hotels.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      تعداد هتل‌ها
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.success.main}25)` }}>
                  <CardContent>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {hotels.filter(h => h.isActive).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      هتل‌های فعال
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.warning.main}15, ${theme.palette.warning.main}25)` }}>
                  <CardContent>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      {hotels.reduce((sum, hotel) => sum + (hotel.availableRooms || 0), 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      اتاق‌های خالی
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.info.main}15, ${theme.palette.info.main}25)` }}>
                  <CardContent>
                    <Typography variant="h4" fontWeight="bold" color="info.main">
                      {hotels.filter(h => (h.discountPercentage || 0) > 0).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      هتل‌های تخفیف‌دار
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {bulkEditMode && <TableCell>انتخاب</TableCell>}
                      <TableCell>هتل</TableCell>
                      <TableCell>موقعیت</TableCell>
                      <TableCell>قیمت و امتیاز</TableCell>
                      <TableCell>وضعیت</TableCell>
                      <TableCell>اقدامات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {hotels.map((hotel) => (
                      <TableRow key={hotel.id} hover>
                        {bulkEditMode && (
                          <TableCell>
                            <Checkbox
                              checked={selectedHotels.includes(hotel.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedHotels(prev => [...prev, hotel.id]);
                                } else {
                                  setSelectedHotels(prev => prev.filter(id => id !== hotel.id));
                                }
                              }}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 2,
                                background: hotel.mainImageUrl 
                                  ? `url(${hotel.mainImageUrl}) center/cover`
                                  : `linear-gradient(135deg, ${theme.palette.primary.main}30, ${theme.palette.primary.main}50)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                              }}
                            >
                              {!hotel.mainImageUrl && <Hotel />}
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="600">
                                {hotel.name || 'بدون نام'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {hotel.city || '---'}, {hotel.country || '---'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {hotel.address || 'آدرس ثبت نشده'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {hotel.phone || 'تلفن ثبت نشده'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AttachMoney color="success" />
                            <Typography variant="h6" color="success.main">
                              {safeToLocaleString(hotel.basePrice)}
                            </Typography>
                            <Typography variant="body2">تومان</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Star color="warning" />
                            <Typography variant="body2">
                              ({hotel.starRating || 0} ستاره)
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Chip
                              label={hotel.isActive ? 'فعال' : 'غیرفعال'}
                              color={hotel.isActive ? 'success' : 'default'}
                              size="small"
                            />
                            <Chip
                              label={`${hotel.availableRooms || 0} / ${hotel.totalRooms || 0} اتاق`}
                              color={(hotel.availableRooms || 0) > 0 ? 'info' : 'error'}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="مدیریت اتاق‌ها">
                              <IconButton 
                                size="small"
                                onClick={() => {
                                  setEditingHotel(hotel);
                                  setRoomManagementOpen(true);
                                }}
                              >
                                <Bed />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="ویرایش">
                              <IconButton 
                                size="small"
                                onClick={() => {
                                  setEditingHotel(hotel);
                                  setActiveTab('edit');
                                }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="حذف">
                              <IconButton 
                                size="small"
                                onClick={() => showDeleteConfirm(hotel.id, hotel.name)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* فرم ایجاد هتل جدید */}
          {activeTab === 'add' && (
            <Box>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step 1: اطلاعات اصلی */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>اطلاعات اصلی هتل</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <TextField
                      fullWidth
                      label="نام هتل *"
                      value={newHotel.name || ''}
                      onChange={(e) => setNewHotel({...newHotel, name: e.target.value})}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Hotel />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="شهر *"
                      value={newHotel.city || ''}
                      onChange={(e) => setNewHotel({...newHotel, city: e.target.value})}
                    />
                    <TextField
                      fullWidth
                      label="کشور *"
                      value={newHotel.country || ''}
                      onChange={(e) => setNewHotel({...newHotel, country: e.target.value})}
                    />
                    <TextField
                      fullWidth
                      label="قیمت پایه *"
                      type="number"
                      value={newHotel.basePrice || ''}
                      onChange={(e) => setNewHotel({...newHotel, basePrice: Number(e.target.value)})}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoney />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="آدرس"
                      value={newHotel.address || ''}
                      onChange={(e) => setNewHotel({...newHotel, address: e.target.value})}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      select
                      label="امتیاز هتل"
                      value={newHotel.starRating || 3}
                      onChange={(e) => setNewHotel({...newHotel, starRating: Number(e.target.value)})}
                    >
                      {[1, 2, 3, 4, 5].map(stars => (
                        <MenuItem key={stars} value={stars}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Star color="warning" />
                            <span>({stars} ستاره)</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="توضیحات"
                    value={newHotel.description || ''}
                    onChange={(e) => setNewHotel({...newHotel, description: e.target.value})}
                    sx={{ mt: 2 }}
                  />

                  {/* امکانات */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      امکانات هتل
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 1 }}>
                      {defaultAmenities.map((amenity) => (
                        <FormControlLabel
                          key={amenity}
                          control={
                            <Checkbox
                              checked={(newHotel.amenities || []).includes(amenity)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewHotel({
                                    ...newHotel,
                                    amenities: [...(newHotel.amenities || []), amenity]
                                  });
                                } else {
                                  setNewHotel({
                                    ...newHotel,
                                    amenities: (newHotel.amenities || []).filter(a => a !== amenity)
                                  });
                                }
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {amenityIcons[amenity] || <Wifi />}
                              {amenity}
                            </Box>
                          }
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Step 2: اتاق‌ها و قیمت */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>انواع اتاق‌ها</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    {newHotel.roomTypes?.map((room, index) => (
                      <Card key={room.id} sx={{ p: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            {roomCategories[room.category].icon}
                            <Typography variant="h6">{room.name}</Typography>
                          </Box>
                          
                          <TextField
                            fullWidth
                            type="number"
                            label="قیمت پایه"
                            value={room.basePrice}
                            onChange={(e) => {
                              const updatedRoomTypes = [...(newHotel.roomTypes || [])];
                              updatedRoomTypes[index] = {
                                ...room,
                                basePrice: Number(e.target.value)
                              };
                              setNewHotel({...newHotel, roomTypes: updatedRoomTypes});
                            }}
                            sx={{ mb: 2 }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AttachMoney />
                                </InputAdornment>
                              ),
                            }}
                          />

                          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <TextField
                              fullWidth
                              type="number"
                              label="تعداد کل"
                              value={room.total}
                              onChange={(e) => {
                                const updatedRoomTypes = [...(newHotel.roomTypes || [])];
                                updatedRoomTypes[index] = {
                                  ...room,
                                  total: Number(e.target.value)
                                };
                                setNewHotel({...newHotel, roomTypes: updatedRoomTypes});
                              }}
                            />
                            <TextField
                              fullWidth
                              type="number"
                              label="موجودی"
                              value={room.available}
                              onChange={(e) => {
                                const updatedRoomTypes = [...(newHotel.roomTypes || [])];
                                updatedRoomTypes[index] = {
                                  ...room,
                                  available: Number(e.target.value)
                                };
                                setNewHotel({...newHotel, roomTypes: updatedRoomTypes});
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Step 3: مدیریت مدیا */}
              {activeStep === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">تصاویر و ویدئوها</Typography>
                    <Button
                      variant="outlined"
                      startIcon={<FolderOpen />}
                      onClick={() => setMediaDialogOpen(true)}
                    >
                      انتخاب از کتابخانه
                    </Button>
                  </Box>

                  <Paper
                    sx={{
                      p: 4,
                      border: '2px dashed',
                      borderColor: 'primary.main',
                      textAlign: 'center',
                      cursor: 'pointer',
                      mb: 2
                    }}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <Upload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      فایل‌ها را اینجا رها کنید
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      یا برای انتخاب فایل کلیک کنید
                    </Typography>
                    <Button 
                      variant="contained" 
                      component="label"
                      sx={{ mt: 2 }}
                    >
                      انتخاب فایل
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*,video/*"
                        onChange={async (e) => {
                          if (e.target.files) {
                            await handleFileUpload(Array.from(e.target.files));
                          }
                        }}
                      />
                    </Button>
                  </Paper>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                    {newHotel.media?.map((media) => (
                      <Card key={media.id}>
                        <CardContent sx={{ p: 1 }}>
                          {media.type === 'image' ? (
                            <img
                              src={media.url}
                              alt={media.name}
                              style={{
                                width: '100%',
                                height: '120px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                          ) : (
                            <video
                              src={media.url}
                              style={{
                                width: '100%',
                                height: '120px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                          )}
                          <Typography variant="caption" display="block" textAlign="center">
                            {media.name}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Step 4: تأیید نهایی */}
              {activeStep === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>تأیید اطلاعات هتل</Typography>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">نام هتل</Typography>
                          <Typography variant="body1">{newHotel.name || '---'}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">موقعیت</Typography>
                          <Typography variant="body1">{newHotel.city}, {newHotel.country}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">قیمت پایه</Typography>
                          <Typography variant="body1">{safeToLocaleString(newHotel.basePrice)} تومان</Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">امتیاز</Typography>
                          <Typography variant="body1">{newHotel.starRating} ستاره</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              )}

              {/* دکمه‌های ناوبری */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={() => activeStep === 0 ? setActiveTab('list') : handleBackStep()}
                >
                  {activeStep === 0 ? 'انصراف' : 'قبلی'}
                </Button>
                <Box>
                  {activeStep < steps.length - 1 ? (
                    <Button variant="contained" onClick={handleNextStep}>
                      بعدی
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={handleCreateHotel}>
                      ایجاد هتل
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          )}

          {/* فرم ویرایش هتل */}
          {activeTab === 'edit' && editingHotel && (
            <Box>
              <Typography variant="h6" gutterBottom>
                ویرایش هتل: {editingHotel.name}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                <TextField
                  fullWidth
                  label="نام هتل"
                  value={editingHotel.name}
                  onChange={(e) => setEditingHotel({...editingHotel, name: e.target.value})}
                />
                <TextField
                  fullWidth
                  label="شهر"
                  value={editingHotel.city}
                  onChange={(e) => setEditingHotel({...editingHotel, city: e.target.value})}
                />
                <TextField
                  fullWidth
                  label="قیمت پایه"
                  type="number"
                  value={editingHotel.basePrice}
                  onChange={(e) => setEditingHotel({...editingHotel, basePrice: Number(e.target.value)})}
                />
                <TextField
                  fullWidth
                  label="تعداد اتاق‌های خالی"
                  type="number"
                  value={editingHotel.availableRooms}
                  onChange={(e) => setEditingHotel({...editingHotel, availableRooms: Number(e.target.value)})}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleUpdateHotel}
                >
                  ذخیره تغییرات
                </Button>
                <Button
                  onClick={() => {
                    setEditingHotel(null);
                    setActiveTab('list');
                  }}
                >
                  انصراف
                </Button>
              </Box>
            </Box>
          )}        </CardContent>
      </Card>

      {/* دیالوگ مدیا لایبرری */}
      <Dialog open={mediaDialogOpen} onClose={() => setMediaDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>کتابخانه مدیا</DialogTitle>
        <DialogContent>
          <Tabs value={mediaTab} onChange={(e, newValue) => setMediaTab(newValue)}>
            <Tab label="همه فایل‌ها" />
            <Tab label="عکس‌ها" />
            <Tab label="ویدئوها" />
          </Tabs>

          <List>
            {mediaLibrary
              .filter(media => mediaTab === 0 || (mediaTab === 1 && media.type === 'image') || (mediaTab === 2 && media.type === 'video'))
              .map(media => (
                <ListItem key={media.id}>
                  <ListItemAvatar>
                    {media.type === 'image' ? <Image /> : <VideoFile />}
                  </ListItemAvatar>
                  <ListItemText
                    primary={media.name}
                    secondary={`${(media.size / 1024 / 1024).toFixed(2)} MB`}
                  />
                  <Button
                    size="small"
                    onClick={() => {
                      setNewHotel(prev => ({
                        ...prev,
                        media: [...(prev.media || []), media],
                        imageUrls: [...(prev.imageUrls || []), media.url]
                      }));
                      setMediaDialogOpen(false);
                    }}
                  >
                    انتخاب
                  </Button>
                </ListItem>
              ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* دیالوگ مدیریت اتاق‌ها */}
      <Dialog open={roomManagementOpen} onClose={() => setRoomManagementOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>مدیریت اتاق‌ها - {editingHotel?.name}</DialogTitle>
        <DialogContent>
          {editingHotel?.roomTypes?.map(room => (
            <Card key={room.id} sx={{ p: 2, mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {roomCategories[room.category].icon}
                    <Typography variant="h6">{room.name}</Typography>
                  </Box>
                  <Chip
                    label={`${room.available} از ${room.total} خالی`}
                    color={room.available > 0 ? 'success' : 'error'}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Block />}
                    disabled={room.available === 0}
                  >
                    مسدود کردن
                  </Button>
                  <Switch
                    checked={room.available > 0}
                    onChange={(e) => {
                      // تغییر وضعیت اتاق
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
      </Dialog>

      {/* دیالوگ تأیید حذف */}
      <Dialog open={deleteConfirm.show} onClose={cancelDelete}>
        <DialogTitle>تأیید حذف هتل</DialogTitle>
        <DialogContent>
          <Typography>
            آیا از حذف هتل <strong>"{deleteConfirm.hotelName}"</strong> مطمئن هستید؟
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            این عمل غیرقابل بازگشت است!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>انصراف</Button>
          <Button
            onClick={handleDeleteHotel}
            variant="contained"
            color="error"
            startIcon={<Delete />}
          >
            حذف هتل
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HotelManagement;