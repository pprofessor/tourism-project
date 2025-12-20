import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Chip,
    Avatar,
    Divider,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Rating,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Stack,
    Badge,
    Stepper,
    Step,
    StepLabel,
    Fab
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Delete as DeleteIcon,
    LocationOn as LocationIcon,
    Language as LanguageIcon,
    Work as WorkIcon,
    Star as StarIcon,
    AccountCircle as AccountIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    CalendarToday as CalendarIcon,
    AccessTime as TimeIcon,
    AttachMoney as MoneyIcon,
    Message as MessageIcon,
    Visibility as ViewIcon,
    Download as DownloadIcon,
    Verified as VerifiedIcon,
    Warning as WarningIcon,
    Block as BlockIcon,
    CheckCircle as CheckIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    School as SchoolIcon,
    Badge as BadgeIcon,
    Security as SecurityIcon,
    History as HistoryIcon,
    Assessment as AssessmentIcon,
    Chat as ChatIcon,
    Receipt as ReceiptIcon,
    Map as MapIcon,
    PhotoCamera as CameraIcon,
    VideoLibrary as VideoIcon,
    Description as DocumentIcon,
    PlayArrow as PlayIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

// ایمپورت سرویس و تایپ‌ها
import ambassadorService, { Ambassador } from '../../../services/ambassadorService';

// ============ کامپوننت‌های استایل شده ============

/**
 * آواتار پروفایل سفیر با استایل مخصوص
 */
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    border: `4px solid ${theme.palette.background.paper}`,
    boxShadow: theme.shadows[3],
}));

/**
 * کارت آمار با استایل مخصوص
 */
const StatCard = styled(Card)(({ theme }) => ({
    height: '100%',
    borderRadius: 12,
    backgroundColor: theme.palette.background.default,
}));

/**
 * نشانگر وضعیت سفیر با رنگ‌بندی متناسب
 */
const StatusBadge = styled(Chip)<{ status: string }>(({ theme, status }) => {
    let color = '';
    let bgColor = '';

    switch (status) {
        case 'APPROVED':
            color = '#059669';
            bgColor = '#d1fae5';
            break;
        case 'PENDING_REVIEW':
            color = '#d97706';
            bgColor = '#fef3c7';
            break;
        case 'REJECTED':
            color = '#dc2626';
            bgColor = '#fee2e2';
            break;
        case 'SUSPENDED':
            color = '#6b7280';
            bgColor = '#f3f4f6';
            break;
        default:
            color = '#6b7280';
            bgColor = '#f3f4f6';
    }

    return {
        color,
        backgroundColor: bgColor,
        fontWeight: 600,
        fontSize: '0.875rem',
        height: 32,
        '& .MuiChip-icon': {
            color: 'inherit',
        },
    };
});

// ============ تایپ‌های TypeScript ============

/**
 * Props کامپوننت AmbassadorShow
 */
interface AmbassadorShowProps {
    ambassador: Ambassador;
    onBack: () => void;
    onUpdate: () => void;
}

/**
 * ساختار داده‌های دیالوگ ویرایش
 */
interface EditDialogData {
    field: keyof Ambassador;
    value: any;
    label: string;
    type: 'text' | 'select' | 'multiselect' | 'number' | 'textarea';
    options?: Array<{ label: string; value: any }>;
}

// ============ MAIN COMPONENT - AmbassadorShow ============

/**
 * کامپوننت نمایش و مدیریت جزئیات سفیر
 * شامل نمایش کامل اطلاعات، ویرایش، حذف و گزارش‌گیری
 */
const AmbassadorShow: React.FC<AmbassadorShowProps> = ({
    ambassador,
    onBack,
    onUpdate
}) => {
    // ============ State Management ============

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedData, setEditedData] = useState<Partial<Ambassador>>({});

    // State برای دیالوگ‌ها
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [editDialogData, setEditDialogData] = useState<EditDialogData | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);

    // داده‌های نمونه برای تاریخچه خدمات و چت‌ها
    const [serviceHistory] = useState<any[]>([
        { id: 1, date: '2024-01-15', service: 'تور شهری', customer: 'احمدی', amount: 250000, status: 'COMPLETED' },
        { id: 2, date: '2024-01-10', service: 'راهنمای موزه', customer: 'رضایی', amount: 120000, status: 'COMPLETED' },
        { id: 3, date: '2024-01-05', service: 'ترانسفر فرودگاه', customer: 'محمدی', amount: 180000, status: 'CANCELLED' },
    ]);

    const [chatHistory] = useState<any[]>([
        { id: 1, date: '2024-01-15', customer: 'احمدی', messages: 12, lastMessage: 'ساعت چند می‌رسید؟' },
        { id: 2, date: '2024-01-14', customer: 'رضایی', messages: 8, lastMessage: 'ممنون از راهنمایی‌تون' },
        { id: 3, date: '2024-01-12', customer: 'کریمی', messages: 5, lastMessage: 'لطفاً آدرس رو بفرستید' },
    ]);

    // ============ Event Handlers ============

    /**
     * تغییر تب فعال
     */
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    /**
     * باز کردن دیالوگ ویرایش یک فیلد
     */
    const handleEditField = (field: keyof Ambassador, data: EditDialogData) => {
        setEditDialogData(data);
        setEditDialogOpen(true);
    };

    /**
     * ذخیره تغییرات ویرایش شده
     */
    const handleSaveEdit = async () => {
        if (!editDialogData) return;

        try {
            setLoading(true);
            setError(null);

            await ambassadorService.updateAmbassador(ambassador.id, {
                [editDialogData.field]: editDialogData.value
            });

            setSuccess('تغییرات با موفقیت ذخیره شد');
            onUpdate(); // اطلاع به والد برای رفرش

            // مخفی کردن پیام موفقیت بعد از ۳ ثانیه
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error updating ambassador:', err);
            setError('خطا در ذخیره تغییرات');
        } finally {
            setLoading(false);
            setEditDialogOpen(false);
            setEditDialogData(null);
        }
    };

    /**
     * حذف (غیرفعال کردن) سفیر
     */
    const handleDeleteAmbassador = async () => {
        try {
            setLoading(true);
            await ambassadorService.deleteAmbassador(ambassador.id);
            setSuccess('سفیر با موفقیت غیرفعال شد');
            setTimeout(() => {
                onBack();
            }, 1500);
        } catch (err) {
            console.error('Error deleting ambassador:', err);
            setError('خطا در غیرفعال کردن سفیر');
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
        }
    };

    /**
     * تغییر وضعیت سفیر
     */
    const handleStatusChange = async (newStatus: Ambassador['registrationStatus']) => {
        try {
            setLoading(true);
            await ambassadorService.updateAmbassador(ambassador.id, {
                registrationStatus: newStatus
            });
            setSuccess(`وضعیت سفیر به "${getStatusLabel(newStatus)}" تغییر یافت`);
            onUpdate();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error changing status:', err);
            setError('خطا در تغییر وضعیت');
        } finally {
            setLoading(false);
            setStatusDialogOpen(false);
        }
    };

    /**
     * ارسال پیام به سفیر
     */
    const handleSendMessage = () => {
        // در کامپوننت والد پیاده‌سازی می‌شود
        console.log('Send message to ambassador:', ambassador.id);
    };

    // ============ Utility Functions ============

    /**
     * فرمت تاریخ به فارسی
     */
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'yyyy/MM/dd - HH:mm', { locale: faIR });
        } catch {
            return dateString;
        }
    };

    /**
     * فرمت مبلغ به ریال
     */
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fa-IR', {
            style: 'currency',
            currency: 'IRR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    /**
     * تبدیل کد وضعیت به متن فارسی
     */
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'تأیید شده';
            case 'PENDING_REVIEW': return 'در انتظار بررسی';
            case 'REJECTED': return 'رد شده';
            case 'SUSPENDED': return 'معلق شده';
            case 'DRAFT': return 'پیش‌نویس';
            default: return status;
        }
    };

    /**
     * دریافت آیکون متناسب با وضعیت
     */
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'APPROVED': return <VerifiedIcon />;
            case 'PENDING_REVIEW': return <TimeIcon />;
            case 'REJECTED': return <WarningIcon />;
            case 'SUSPENDED': return <BlockIcon />;
            default: return <AccountIcon />;
        }
    };

    // محاسبه آمار
    const stats = {
        totalServices: ambassador.totalCompletedServices || 0,
        totalEarnings: ambassador.totalEarnings || 0,
        avgRating: ambassador.rating || 0,
        responseRate: ambassador.responseRate || 0,
        avgResponseTime: ambassador.avgResponseTime || 0,
    };

    // مراحل ثبت‌نام
    const registrationSteps = [
        { label: 'ثبت‌نام اولیه', completed: true },
        { label: 'تکمیل پروفایل', completed: ambassador.bio ? true : false },
        { label: 'ارسال مدارک', completed: (ambassador.documents?.length || 0) > 0 },
        { label: 'تأیید هویت', completed: ambassador.registrationStatus === 'APPROVED' },
        { label: 'فعال‌سازی', completed: ambassador.isActive },
    ];

    return (
        <Box>
            {/* ============ Alert Messages ============ */}

            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    onClose={() => setSuccess(null)}
                >
                    {success}
                </Alert>
            )}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            {/* ============ Header Section ============ */}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={onBack}>
                        <BackIcon />
                    </IconButton>
                    <Typography variant="h5" fontWeight="bold">
                        پروفایل سفیر
                    </Typography>
                    <StatusBadge
                        icon={getStatusIcon(ambassador.registrationStatus)}
                        label={getStatusLabel(ambassador.registrationStatus)}
                        status={ambassador.registrationStatus}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<MessageIcon />}
                        onClick={handleSendMessage}
                    >
                        ارسال پیام
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => setEditMode(!editMode)}
                    >
                        {editMode ? 'لغو ویرایش' : 'ویرایش'}
                    </Button>
                </Box>
            </Box>

            {/* ============ Registration Progress ============ */}

            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                    مراحل ثبت‌نام
                </Typography>

                <Stepper activeStep={registrationSteps.filter(step => step.completed).length} sx={{ mt: 2 }}>
                    {registrationSteps.map((step, index) => (
                        <Step key={step.label} completed={step.completed}>
                            <StepLabel>{step.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            {/* ============ Main Content Grid ============ */}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' }, gap: 3 }}>
                {/* ============ Left Column - Profile Info ============ */}

                <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 4' } }}>
                    {/* Profile Card */}
                    <Card sx={{ borderRadius: 3, mb: 3 }}>
                        <CardContent sx={{ textAlign: 'center', pt: 4 }}>
                            <ProfileAvatar sx={{ mb: 2, mx: 'auto' }}>
                                {ambassador.user?.firstName?.[0] || <PersonIcon />}
                            </ProfileAvatar>

                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {ambassador.user?.firstName} {ambassador.user?.lastName}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                کد سفیر: {ambassador.id}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                                <Rating
                                    value={stats.avgRating}
                                    readOnly
                                    size="small"
                                    precision={0.1}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    ({stats.avgRating.toFixed(1)})
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                                <Chip
                                    icon={<CheckIcon />}
                                    label="احراز هویت شده"
                                    color="success"
                                    variant="outlined"
                                    size="small"
                                />

                                <Chip
                                    icon={ambassador.isActive ? <CheckIcon /> : <BlockIcon />}
                                    label={ambassador.isActive ? "فعال" : "غیرفعال"}
                                    color={ambassador.isActive ? "success" : "error"}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Contact Info List */}
                            <List dense>
                                <ListItem>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <PhoneIcon color="action" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="شماره موبایل"
                                        secondary={ambassador.user?.mobile}
                                    />
                                    {editMode && (
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEditField('user', {
                                                field: 'user',
                                                value: ambassador.user,
                                                label: 'شماره موبایل',
                                                type: 'text'
                                            })}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </ListItem>

                                {ambassador.user?.email && (
                                    <ListItem>
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <EmailIcon color="action" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="ایمیل"
                                            secondary={ambassador.user.email}
                                        />
                                    </ListItem>
                                )}

                                <ListItem>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <LocationIcon color="action" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="موقعیت"
                                        secondary={`${ambassador.city}, ${ambassador.country}`}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <CalendarIcon color="action" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="تاریخ عضویت"
                                        secondary={formatDate(ambassador.createdAt)}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>

                    {/* Stats Grid - اصلاح شده برای MUI v6 */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                        {/* Stats Card 1 */}
                        <StatCard>
                            <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="h4" fontWeight="bold" color="primary">
                                    {stats.totalServices}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    خدمات انجام شده
                                </Typography>
                            </CardContent>
                        </StatCard>

                        {/* Stats Card 2 */}
                        <StatCard>
                            <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="h4" fontWeight="bold" color="success.main">
                                    {formatCurrency(stats.totalEarnings)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    مجموع درآمد
                                </Typography>
                            </CardContent>
                        </StatCard>

                        {/* Stats Card 3 */}
                        <StatCard>
                            <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="h4" fontWeight="bold" color="info.main">
                                    {stats.responseRate}%
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    نرخ پاسخگویی
                                </Typography>
                            </CardContent>
                        </StatCard>

                        {/* Stats Card 4 */}
                        <StatCard>
                            <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="h4" fontWeight="bold" color="warning.main">
                                    {stats.avgResponseTime}m
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    میانگین زمان پاسخ
                                </Typography>
                            </CardContent>
                        </StatCard>
                    </Box>
                </Box>

                {/* ============ Right Column - Details Tabs ============ */}

                <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 8' } }}>
                    <Paper sx={{ borderRadius: 3, mb: 3 }}>
                        {/* Tabs Navigation */}
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                '& .MuiTabs-indicator': {
                                    height: 3,
                                    borderRadius: '3px 3px 0 0',
                                }
                            }}
                        >
                            <Tab
                                icon={<AccountIcon />}
                                iconPosition="start"
                                label="اطلاعات شخصی"
                            />
                            <Tab
                                icon={<WorkIcon />}
                                iconPosition="start"
                                label="خدمات و فعالیت"
                            />
                            <Tab
                                icon={<AssessmentIcon />}
                                iconPosition="start"
                                label="گزارشات"
                            />
                            <Tab
                                icon={<HistoryIcon />}
                                iconPosition="start"
                                label="تاریخچه"
                            />
                            <Tab
                                icon={<SecurityIcon />}
                                iconPosition="start"
                                label="مدیریت"
                            />
                        </Tabs>

                        {/* Tab 1: Personal Information */}
                        {activeTab === 0 && (
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                                    {/* Bio Section */}
                                    <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                            بیوگرافی
                                        </Typography>
                                        <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                            <Typography variant="body2">
                                                {ambassador.bio || 'بیوگرافی وارد نشده است'}
                                            </Typography>
                                            {editMode && (
                                                <Box sx={{ mt: 2, textAlign: 'left' }}>
                                                    <Button
                                                        size="small"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => handleEditField('bio', {
                                                            field: 'bio',
                                                            value: ambassador.bio,
                                                            label: 'بیوگرافی',
                                                            type: 'textarea'
                                                        })}
                                                    >
                                                        ویرایش بیوگرافی
                                                    </Button>
                                                </Box>
                                            )}
                                        </Paper>
                                    </Box>

                                    {/* Address Section */}
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                            آدرس کامل
                                        </Typography>
                                        <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                            <Typography variant="body2">
                                                {ambassador.address}
                                            </Typography>
                                            {ambassador.latitude && ambassador.longitude && (
                                                <Box sx={{ mt: 1 }}>
                                                    <Chip
                                                        icon={<MapIcon />}
                                                        label="موقعیت جغرافیایی"
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            )}
                                        </Paper>
                                    </Box>

                                    {/* Languages Section */}
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                            زبان‌ها
                                        </Typography>
                                        <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {Object.entries(ambassador.languages || {}).map(([lang, level]) => (
                                                    <Chip
                                                        key={lang}
                                                        icon={<LanguageIcon />}
                                                        label={`${lang} (سطح ${level})`}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                ))}
                                            </Box>
                                            {editMode && (
                                                <Box sx={{ mt: 2, textAlign: 'left' }}>
                                                    <Button
                                                        size="small"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => handleEditField('languages', {
                                                            field: 'languages',
                                                            value: ambassador.languages,
                                                            label: 'زبان‌ها',
                                                            type: 'multiselect',
                                                            options: [
                                                                { label: 'فارسی', value: 5 },
                                                                { label: 'انگلیسی', value: 4 },
                                                                { label: 'عربی', value: 3 },
                                                                { label: 'ترکی', value: 4 },
                                                            ]
                                                        })}
                                                    >
                                                        ویرایش زبان‌ها
                                                    </Button>
                                                </Box>
                                            )}
                                        </Paper>
                                    </Box>

                                    {/* Services Section */}
                                    <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                            خدمات قابل ارائه
                                        </Typography>
                                        <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {(ambassador.services || []).map(service => (
                                                    <Chip
                                                        key={service}
                                                        icon={<WorkIcon />}
                                                        label={service}
                                                        sx={{ bgcolor: 'info.50', color: 'info.700' }}
                                                        size="small"
                                                    />
                                                ))}
                                            </Box>
                                            {editMode && (
                                                <Box sx={{ mt: 2, textAlign: 'left' }}>
                                                    <Button
                                                        size="small"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => handleEditField('services', {
                                                            field: 'services',
                                                            value: ambassador.services,
                                                            label: 'خدمات',
                                                            type: 'multiselect',
                                                            options: [
                                                                { label: 'تور شهری', value: 'تور شهری' },
                                                                { label: 'راهنمای موزه', value: 'راهنمای موزه' },
                                                                { label: 'ترانسفر فرودگاه', value: 'ترانسفر فرودگاه' },
                                                                { label: 'راهنمای خرید', value: 'راهنمای خرید' },
                                                                { label: 'مشاوره سفر', value: 'مشاوره سفر' },
                                                            ]
                                                        })}
                                                    >
                                                        ویرایش خدمات
                                                    </Button>
                                                </Box>
                                            )}
                                        </Paper>
                                    </Box>

                                    {/* Documents Section */}
                                    {ambassador.documents && ambassador.documents.length > 0 && (
                                        <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                                            <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                                مدارک ارسالی
                                            </Typography>
                                            <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                                <List dense>
                                                    {ambassador.documents.map((doc, index) => (
                                                        <ListItem
                                                            key={index}
                                                            secondaryAction={
                                                                <IconButton
                                                                    edge="end"
                                                                    size="small"
                                                                    href={doc.url}
                                                                    target="_blank"
                                                                >
                                                                    <DownloadIcon fontSize="small" />
                                                                </IconButton>
                                                            }
                                                        >
                                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                                <DocumentIcon fontSize="small" color="action" />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={doc.fileName}
                                                                secondary={`${(doc.fileSize / 1024).toFixed(1)} KB • ${doc.type}`}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Paper>
                                        </Box>
                                    )}

                                    {/* Video Selfie Section */}
                                    {ambassador.videoSelfieUrl && (
                                        <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                                            <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                                ویدئوی سلفی
                                            </Typography>
                                            <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <IconButton
                                                        color="primary"
                                                        href={ambassador.videoSelfieUrl}
                                                        target="_blank"
                                                    >
                                                        <PlayIcon />
                                                    </IconButton>
                                                    <Typography variant="body2">
                                                        ویدئوی معرفی سفیر
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        )}

                        {/* Tab 2: Services & Activity */}
                        {activeTab === 1 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom mb={3}>
                                    خدمات اخیر
                                </Typography>

                                <TableContainer component={Paper} variant="outlined">
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: 'grey.50' }}>
                                                <TableCell>تاریخ</TableCell>
                                                <TableCell>خدمت</TableCell>
                                                <TableCell>مشتری</TableCell>
                                                <TableCell align="center">مبلغ</TableCell>
                                                <TableCell align="center">وضعیت</TableCell>
                                                <TableCell align="center">عملیات</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {serviceHistory.map((service) => (
                                                <TableRow key={service.id} hover>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {formatDate(service.date)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight="medium">
                                                            {service.service}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {service.customer}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography fontWeight="bold" color="success.main">
                                                            {formatCurrency(service.amount)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={service.status === 'COMPLETED' ? 'تکمیل شده' : 'لغو شده'}
                                                            size="small"
                                                            color={service.status === 'COMPLETED' ? 'success' : 'error'}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title="مشاهده جزئیات">
                                                            <IconButton size="small">
                                                                <ViewIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Box sx={{ mt: 4 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom mb={3}>
                                        چت‌های اخیر
                                    </Typography>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                                        {chatHistory.map((chat) => (
                                            <Card key={chat.id} variant="outlined">
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Typography fontWeight="medium">
                                                            {chat.customer}
                                                        </Typography>
                                                        <Chip
                                                            label={`${chat.messages} پیام`}
                                                            size="small"
                                                            color="info"
                                                            variant="outlined"
                                                        />
                                                    </Box>

                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                                                        {chat.lastMessage}
                                                    </Typography>

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatDate(chat.date)}
                                                        </Typography>
                                                        <Button size="small" startIcon={<ChatIcon />}>
                                                            مشاهده چت
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        )}

                        {/* Tab 3: Reports */}
                        {activeTab === 2 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom mb={3}>
                                    گزارش عملکرد
                                </Typography>

                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                                    {/* Rating Distribution */}
                                    <Card>
                                        <CardContent>
                                            <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                                توزیع امتیازات
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                {[5, 4, 3, 2, 1].map((star) => (
                                                    <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <Typography variant="body2" sx={{ minWidth: 60 }}>
                                                            {star} ستاره
                                                        </Typography>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 8 : star === 2 ? 2 : 0}
                                                            sx={{ flex: 1, mx: 2, height: 8, borderRadius: 4 }}
                                                            color={star >= 4 ? "success" : star === 3 ? "warning" : "error"}
                                                        />
                                                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                                                            {star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '8%' : star === 2 ? '2%' : '0%'}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </CardContent>
                                    </Card>

                                    {/* Monthly Performance */}
                                    <Card>
                                        <CardContent>
                                            <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                                عملکرد ماهانه
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="میانگین خدمات در ماه"
                                                        secondary="8.5 خدمت"
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="میانگین درآمد ماهانه"
                                                        secondary={formatCurrency(1850000)}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="نرخ رضایت مشتری"
                                                        secondary="94%"
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="میانگین زمان پاسخ"
                                                        secondary="12 دقیقه"
                                                    />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>

                                    {/* Earnings Chart - Full Width */}
                                    <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                                    نمودار درآمد ۶ ماه اخیر
                                                </Typography>
                                                <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 2, mt: 3 }}>
                                                    {[
                                                        { month: 'مرداد', amount: 1500000 },
                                                        { month: 'شهریور', amount: 1800000 },
                                                        { month: 'مهر', amount: 2200000 },
                                                        { month: 'آبان', amount: 1900000 },
                                                        { month: 'آذر', amount: 2400000 },
                                                        { month: 'دی', amount: 2100000 },
                                                    ].map((item, index) => (
                                                        <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
                                                            <Box
                                                                sx={{
                                                                    height: `${(item.amount / 2500000) * 150}px`,
                                                                    bgcolor: 'primary.main',
                                                                    borderRadius: '4px 4px 0 0',
                                                                    mb: 1
                                                                }}
                                                            />
                                                            <Typography variant="caption">
                                                                {item.month}
                                                            </Typography>
                                                            <Typography variant="caption" display="block" color="text.secondary">
                                                                {formatCurrency(item.amount)}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Box>
                            </Box>
                        )}

                        {/* Tab 4: History */}
                        {activeTab === 3 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom mb={3}>
                                    تاریخچه فعالیت‌ها
                                </Typography>

                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <CheckIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="تأیید حساب کاربری"
                                            secondary="15 دی 1402 - توسط مدیر سیستم"
                                        />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemIcon>
                                            <MoneyIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="اولین سرویس انجام شده"
                                            secondary="20 دی 1402 - تور شهری تهران"
                                        />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemIcon>
                                            <StarIcon color="warning" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="دریافت اولین امتیاز ۵ ستاره"
                                            secondary="25 دی 1402 - از کاربر احمدی"
                                        />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemIcon>
                                            <BadgeIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="دریافت نشان سفیر برتر"
                                            secondary="5 بهمن 1402"
                                        />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemIcon>
                                            <SchoolIcon color="info" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="تکمیل دوره آموزشی پیشرفته"
                                            secondary="15 بهمن 1402"
                                        />
                                    </ListItem>
                                </List>
                            </Box>
                        )}

                        {/* Tab 5: Management */}
                        {activeTab === 4 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom mb={3}>
                                    تنظیمات مدیریتی
                                </Typography>

                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                                    {/* Account Status Card */}
                                    <Card>
                                        <CardContent>
                                            <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                                وضعیت حساب
                                            </Typography>

                                            <FormControl fullWidth sx={{ mt: 2 }}>
                                                <InputLabel>تغییر وضعیت</InputLabel>
                                                <Select
                                                    value={ambassador.registrationStatus}
                                                    label="تغییر وضعیت"
                                                    onChange={(e) => handleStatusChange(e.target.value as Ambassador['registrationStatus'])}
                                                >
                                                    <MenuItem value="APPROVED">تأیید شده</MenuItem>
                                                    <MenuItem value="PENDING_REVIEW">در انتظار بررسی</MenuItem>
                                                    <MenuItem value="SUSPENDED">معلق شده</MenuItem>
                                                    <MenuItem value="REJECTED">رد شده</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <Box sx={{ mt: 2 }}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={ambassador.isActive}
                                                            onChange={(e) => handleEditField('isActive', {
                                                                field: 'isActive',
                                                                value: e.target.checked,
                                                                label: 'وضعیت فعال',
                                                                type: 'select'
                                                            })}
                                                        />
                                                    }
                                                    label="حساب فعال است"
                                                />
                                            </Box>

                                            <Box sx={{ mt: 3 }}>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    توضیحات مدیریت:
                                                </Typography>
                                                <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                                    <Typography variant="body2">
                                                        {ambassador.adminNotes || 'هیچ توضیحاتی ثبت نشده است'}
                                                    </Typography>
                                                </Paper>
                                                <Button
                                                    size="small"
                                                    startIcon={<EditIcon />}
                                                    sx={{ mt: 1 }}
                                                    onClick={() => handleEditField('adminNotes', {
                                                        field: 'adminNotes',
                                                        value: ambassador.adminNotes,
                                                        label: 'توضیحات مدیریت',
                                                        type: 'textarea'
                                                    })}
                                                >
                                                    ویرایش توضیحات
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>

                                    {/* Danger Zone Card */}
                                    <Card sx={{ border: '2px solid', borderColor: 'error.light' }}>
                                        <CardContent>
                                            <Typography variant="subtitle1" fontWeight="bold" color="error" gutterBottom>
                                                منطقه خطر
                                            </Typography>

                                            <Alert severity="warning" sx={{ mb: 2 }}>
                                                این عملیات‌ها غیرقابل بازگشت هستند
                                            </Alert>

                                            <Stack spacing={2}>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<BlockIcon />}
                                                    fullWidth
                                                    onClick={() => setStatusDialogOpen(true)}
                                                >
                                                    تعلیق حساب
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    startIcon={<DeleteIcon />}
                                                    fullWidth
                                                    onClick={() => setDeleteDialogOpen(true)}
                                                >
                                                    حذف کامل سفیر
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>

                                    {/* System Info Card - Full Width */}
                                    <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                                    اطلاعات سیستم
                                                </Typography>

                                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                                                    <List dense>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary="آخرین ورود"
                                                                secondary={formatDate(ambassador.updatedAt)}
                                                            />
                                                        </ListItem>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary="آخرین بروزرسانی پروفایل"
                                                                secondary={formatDate(ambassador.updatedAt)}
                                                            />
                                                        </ListItem>
                                                    </List>

                                                    <List dense>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary="تعداد مشاهده پروفایل"
                                                                secondary="1,245 بار"
                                                            />
                                                        </ListItem>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary="تعداد درخواست‌های دریافت شده"
                                                                secondary="89 درخواست"
                                                            />
                                                        </ListItem>
                                                    </List>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Box>

            {/* ============ Edit Dialog ============ */}

            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    ویرایش {editDialogData?.label}
                </DialogTitle>

                <DialogContent>
                    {editDialogData && (
                        <Box sx={{ pt: 2 }}>
                            {editDialogData.type === 'textarea' ? (
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label={editDialogData.label}
                                    value={editDialogData.value || ''}
                                    onChange={(e) => setEditDialogData({
                                        ...editDialogData,
                                        value: e.target.value
                                    })}
                                />
                            ) : editDialogData.type === 'multiselect' ? (
                                <FormControl fullWidth>
                                    <InputLabel>{editDialogData.label}</InputLabel>
                                    <Select
                                        multiple
                                        value={editDialogData.value || []}
                                        label={editDialogData.label}
                                        onChange={(e) => setEditDialogData({
                                            ...editDialogData,
                                            value: e.target.value
                                        })}
                                    >
                                        {editDialogData.options?.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : editDialogData.type === 'select' ? (
                                <FormControl fullWidth>
                                    <InputLabel>{editDialogData.label}</InputLabel>
                                    <Select
                                        value={editDialogData.value || ''}
                                        label={editDialogData.label}
                                        onChange={(e) => setEditDialogData({
                                            ...editDialogData,
                                            value: e.target.value
                                        })}
                                    >
                                        {editDialogData.options?.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : (
                                <TextField
                                    fullWidth
                                    label={editDialogData.label}
                                    value={editDialogData.value || ''}
                                    onChange={(e) => setEditDialogData({
                                        ...editDialogData,
                                        value: e.target.value
                                    })}
                                />
                            )}
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="inherit">
                        انصراف
                    </Button>
                    <Button
                        onClick={handleSaveEdit}
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'ذخیره تغییرات'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ============ Delete Dialog ============ */}

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>
                    حذف سفیر
                </DialogTitle>

                <DialogContent>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        آیا از حذف کامل این سفیر مطمئن هستید؟ این عمل غیرقابل بازگشت است.
                    </Alert>
                    <Typography variant="body2" color="text.secondary">
                        سفیر: {ambassador.user?.firstName} {ambassador.user?.lastName}
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
                        انصراف
                    </Button>
                    <Button
                        onClick={handleDeleteAmbassador}
                        color="error"
                        variant="contained"
                        disabled={loading}
                        startIcon={<DeleteIcon />}
                    >
                        {loading ? <CircularProgress size={24} /> : 'حذف کامل'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AmbassadorShow;