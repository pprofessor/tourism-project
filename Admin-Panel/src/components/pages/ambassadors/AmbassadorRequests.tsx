import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Card,
    CardContent,
    Typography,
    Button,
    IconButton,
    Chip,
    Avatar,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Divider,
    Tab,
    Tabs,
    Badge,
    Stack,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Accordion,
    AccordionSummary,
    AccordionDetails,

} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    Visibility as ViewIcon,
    Download as DownloadIcon,
    PlayCircle as PlayIcon,
    Language as LanguageIcon,
    LocationOn as LocationIcon,
    Work as WorkIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Assignment as AssignmentIcon,
    Description as DocumentIcon,
    ExpandMore as ExpandMoreIcon,
    AccessTime as TimeIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

// ============ STYLED COMPONENTS ============
const StatusBadge = styled(Chip)<{ status: string }>(({ theme, status }) => {
    let color = '';
    let bgColor = '';

    switch (status) {
        case 'PENDING':
            color = '#d97706';
            bgColor = '#fef3c7';
            break;
        case 'UNDER_REVIEW':
            color = '#2563eb';
            bgColor = '#dbeafe';
            break;
        case 'APPROVED':
            color = '#059669';
            bgColor = '#d1fae5';
            break;
        case 'REJECTED':
            color = '#dc2626';
            bgColor = '#fee2e2';
            break;
        default:
            color = '#6b7280';
            bgColor = '#f3f4f6';
    }

    return {
        color,
        backgroundColor: bgColor,
        fontWeight: 600,
        fontSize: '0.75rem',
        height: 24,
    };
});

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    '&:before': {
        display: 'none',
    },
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '8px !important',
    marginBottom: '12px !important',
    '&.Mui-expanded': {
        margin: '12px 0',
    },
}));

// ============ TYPES ============
interface ReviewDialogData {
    requestId: number;
    action: 'APPROVE' | 'REJECT';
    notes?: string;
}

interface AmbassadorRequest {
    id: number;
    ambassador: {
        user?: {
            firstName: string;
            lastName: string;
            mobile: string;
            email?: string;
        };
        languages: { [key: string]: number };
        services: string[];
        bio: string;
        city: string;
        country: string;
        address: string;
        videoSelfieUrl?: string;
        documents?: Array<{
            type: string;
            url: string;
            fileName: string;
            fileSize: number;
        }>;
        agreementAccepted: boolean;
    };
    status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
    adminNotes?: string;
    reviewedBy?: number;
    reviewedAt?: string;
    createdAt: string;
}

// ============ MAIN COMPONENT ============
interface AmbassadorRequestsProps {
    onRequestReviewed: () => void;
}

const AmbassadorRequests: React.FC<AmbassadorRequestsProps> = ({ onRequestReviewed }) => {
    const [requests, setRequests] = useState<AmbassadorRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState<number>(0);

    const [reviewDialogOpen, setReviewDialogOpen] = useState<boolean>(false);
    const [reviewDialogData, setReviewDialogData] = useState<ReviewDialogData | null>(null);
    const [reviewNotes, setReviewNotes] = useState<string>('');

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Mock data
            const mockData: AmbassadorRequest[] = [
                {
                    id: 1,
                    ambassador: {
                        user: {
                            firstName: 'علی',
                            lastName: 'محمدی',
                            mobile: '09123456789',
                            email: 'ali@example.com'
                        },
                        languages: { فارسی: 5, انگلیسی: 4, عربی: 3 },
                        services: ['تور شهری', 'راهنمای موزه', 'ترانسفر فرودگاه'],
                        bio: 'سفیر با تجربه با ۵ سال سابقه راهنمایی تورهای تهران',
                        city: 'تهران',
                        country: 'ایران',
                        address: 'خیابان ولیعصر، کوچه فلان',
                        videoSelfieUrl: 'https://example.com/video.mp4',
                        documents: [
                            { type: 'شناسنامه', url: '#', fileName: 'id-card.pdf', fileSize: 2048 },
                            { type: 'عکس', url: '#', fileName: 'photo.jpg', fileSize: 1024 }
                        ],
                        agreementAccepted: true
                    },
                    status: 'PENDING',
                    createdAt: '2024-01-15T10:30:00Z'
                },
                {
                    id: 2,
                    ambassador: {
                        user: {
                            firstName: 'فاطمه',
                            lastName: 'کریمی',
                            mobile: '09129876543',
                            email: 'fatemeh@example.com'
                        },
                        languages: { فارسی: 5, انگلیسی: 3 },
                        services: ['راهنمای خرید', 'مشاوره سفر'],
                        bio: 'متخصص راهنمایی تورهای خرید در تهران',
                        city: 'تهران',
                        country: 'ایران',
                        address: 'میدان تجریش، خیابان ...',
                        agreementAccepted: true
                    },
                    status: 'PENDING',
                    createdAt: '2024-01-14T14:20:00Z'
                }
            ];

            const filteredData = tabValue === 0
                ? mockData.filter(r => r.status === 'PENDING')
                : tabValue === 1
                    ? mockData.filter(r => r.status === 'UNDER_REVIEW')
                    : mockData;

            setRequests(filteredData);
        } catch (err) {
            console.error('Error fetching ambassador requests:', err);
            setError('خطا در دریافت درخواست‌ها');
        } finally {
            setLoading(false);
        }
    }, [tabValue]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenReviewDialog = (request: AmbassadorRequest, action: 'APPROVE' | 'REJECT') => {
        setReviewDialogData({
            requestId: request.id,
            action
        });
        setReviewNotes('');
        setReviewDialogOpen(true);
    };

    const handleCloseReviewDialog = () => {
        setReviewDialogOpen(false);
        setReviewDialogData(null);
        setReviewNotes('');
    };

    const handleSubmitReview = async () => {
        if (!reviewDialogData) return;

        try {
            setLoading(true);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSuccess('عملیات با موفقیت انجام شد');

            fetchRequests();
            onRequestReviewed();

            handleCloseReviewDialog();
        } catch (err) {
            console.error('Error reviewing request:', err);
            setError('خطا در انجام عملیات');
        } finally {
            setLoading(false);
        }
    };


    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'yyyy/MM/dd - HH:mm', { locale: faIR });
        } catch {
            return dateString;
        }
    };

    const getTabLabel = (label: string, count: number) => (
        <Badge
            badgeContent={count}
            color="primary"
            sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', height: 18, minWidth: 18 } }}
        >
            {label}
        </Badge>
    );

    const stats = {
        pending: requests.filter(r => r.status === 'PENDING').length,
        underReview: requests.filter(r => r.status === 'UNDER_REVIEW').length,
        total: requests.length
    };

    return (
        <Box>
            {/* Success Alert */}
            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    onClose={() => setSuccess(null)}
                >
                    {success}
                </Alert>
            )}

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                    درخواست‌های ثبت‌نام سفیران
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {stats.total} درخواست موجود
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.100' }}>
                    <CardContent sx={{ py: 2, textAlign: 'center' }}>
                        <Typography variant="h4" component="div" fontWeight="bold" color="warning.main">
                            {stats.pending}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            در انتظار بررسی اولیه
                        </Typography>
                    </CardContent>
                </Card>

                <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.100' }}>
                    <CardContent sx={{ py: 2, textAlign: 'center' }}>
                        <Typography variant="h4" component="div" fontWeight="bold" color="info.main">
                            {stats.underReview}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            در حال بررسی
                        </Typography>
                    </CardContent>
                </Card>

                <Card sx={{ bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent sx={{ py: 2, textAlign: 'center' }}>
                        <Typography variant="h4" component="div" fontWeight="bold" color="grey.700">
                            {stats.total}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            کل درخواست‌ها
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Tabs */}
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                        '& .MuiTabs-indicator': {
                            height: 3,
                            borderRadius: '3px 3px 0 0',
                        }
                    }}
                >
                    <Tab
                        label={getTabLabel("در انتظار بررسی", stats.pending)}
                        sx={{ py: 2 }}
                    />
                    <Tab
                        label={getTabLabel("در حال بررسی", stats.underReview)}
                        sx={{ py: 2 }}
                    />
                    <Tab
                        label="همه درخواست‌ها"
                        sx={{ py: 2 }}
                    />
                </Tabs>
            </Paper>

            {/* Loading State */}
            {loading && requests.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : requests.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
                    <InfoIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        درخواستی یافت نشد
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        هیچ درخواست ثبت‌نام جدیدی وجود ندارد
                    </Typography>
                </Paper>
            ) : (
                <Box>
                    {requests.map((request) => (
                        <StyledAccordion key={request.id}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                        {request.ambassador.user?.firstName?.[0] || <PersonIcon />}
                                    </Avatar>

                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                            <Typography fontWeight="medium">
                                                {request.ambassador.user?.firstName} {request.ambassador.user?.lastName}
                                            </Typography>
                                            <StatusBadge
                                                label={
                                                    request.status === 'PENDING' ? 'در انتظار بررسی' :
                                                        request.status === 'UNDER_REVIEW' ? 'در حال بررسی' :
                                                            request.status === 'APPROVED' ? 'تایید شده' : 'رد شده'
                                                }
                                                status={request.status}
                                                size="small"
                                                sx={{ ml: 2 }}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <PhoneIcon fontSize="small" />
                                                {request.ambassador.user?.mobile}
                                            </Typography>

                                            {request.ambassador.user?.email && (
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <EmailIcon fontSize="small" />
                                                    {request.ambassador.user.email}
                                                </Typography>
                                            )}

                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <TimeIcon fontSize="small" />
                                                {formatDate(request.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box onClick={(e) => e.stopPropagation()}>
                                        <Stack direction="row" spacing={1}>
                                            <Tooltip title="مشاهده جزئیات">
                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                >
                                                    <ViewIcon />
                                                </IconButton>
                                            </Tooltip>

                                            {request.status === 'PENDING' && (
                                                <>
                                                    <Tooltip title="تایید درخواست">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenReviewDialog(request, 'APPROVE')}
                                                            color="success"
                                                        >
                                                            <CheckIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="رد درخواست">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenReviewDialog(request, 'REJECT')}
                                                            color="error"
                                                        >
                                                            <CancelIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </Stack>
                                    </Box>
                                </Box>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                                    {/* Left Column - Personal Info */}
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                            اطلاعات شخصی
                                        </Typography>

                                        <List dense>
                                            <ListItem>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <PersonIcon fontSize="small" color="action" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="نام کامل"
                                                    secondary={`${request.ambassador.user?.firstName} ${request.ambassador.user?.lastName}`}
                                                />
                                            </ListItem>

                                            <ListItem>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <PhoneIcon fontSize="small" color="action" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="شماره موبایل"
                                                    secondary={request.ambassador.user?.mobile}
                                                />
                                            </ListItem>

                                            {request.ambassador.user?.email && (
                                                <ListItem>
                                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                                        <EmailIcon fontSize="small" color="action" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary="ایمیل"
                                                        secondary={request.ambassador.user.email}
                                                    />
                                                </ListItem>
                                            )}

                                            <ListItem>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <LocationIcon fontSize="small" color="action" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="آدرس"
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="body2">
                                                                {request.ambassador.city}, {request.ambassador.country}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {request.ambassador.address}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        </List>

                                        <Divider sx={{ my: 2 }} />

                                        <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                            زبان‌ها
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                            {Object.entries(request.ambassador.languages || {}).map(([lang, level]) => (
                                                <Chip
                                                    key={lang}
                                                    label={`${lang} (${level}/5)`}
                                                    size="small"
                                                    icon={<LanguageIcon />}
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>

                                        <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                            خدمات قابل ارائه
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {(request.ambassador.services || []).map(service => (
                                                <Chip
                                                    key={service}
                                                    label={service}
                                                    size="small"
                                                    icon={<WorkIcon />}
                                                    sx={{ bgcolor: 'info.50', color: 'info.700' }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>

                                    {/* Right Column - Documents & Bio */}
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                            بیوگرافی
                                        </Typography>
                                        <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
                                            <Typography variant="body2">
                                                {request.ambassador.bio || 'بیوگرافی وارد نشده است'}
                                            </Typography>
                                        </Paper>

                                        {/* Documents */}
                                        <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                            مدارک ارسالی
                                        </Typography>
                                        <List dense>
                                            {(request.ambassador.documents || []).map((doc, index) => (
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

                                            {(request.ambassador.documents || []).length === 0 && (
                                                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                                                    هیچ مدرکی ارسال نشده است
                                                </Typography>
                                            )}
                                        </List>

                                        {/* Video Selfie */}
                                        {request.ambassador.videoSelfieUrl && (
                                            <>
                                                <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                                                    ویدئوی سلفی
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <IconButton
                                                        color="primary"
                                                        href={request.ambassador.videoSelfieUrl}
                                                        target="_blank"
                                                    >
                                                        <PlayIcon />
                                                    </IconButton>
                                                    <Typography variant="body2">
                                                        ویدئوی معرفی سفیر
                                                    </Typography>
                                                </Box>
                                            </>
                                        )}

                                        {/* Agreement */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                                            <AssignmentIcon fontSize="small" color={request.ambassador.agreementAccepted ? "success" : "error"} />
                                            <Typography variant="body2">
                                                {request.ambassador.agreementAccepted
                                                    ? "قوانین و مقررات را پذیرفته است"
                                                    : "قوانین و مقررات را نپذیرفته است"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Action Buttons */}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<ViewIcon />}
                                    >
                                        مشاهده کامل
                                    </Button>

                                    {request.status === 'PENDING' && (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<CheckIcon />}
                                                onClick={() => handleOpenReviewDialog(request, 'APPROVE')}
                                            >
                                                تایید درخواست
                                            </Button>

                                            <Button
                                                variant="contained"
                                                color="error"
                                                startIcon={<CancelIcon />}
                                                onClick={() => handleOpenReviewDialog(request, 'REJECT')}
                                            >
                                                رد درخواست
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </AccordionDetails>
                        </StyledAccordion>
                    ))}
                </Box>
            )}

            {/* Review Dialog */}
            <Dialog
                open={reviewDialogOpen}
                onClose={handleCloseReviewDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {reviewDialogData?.action === 'APPROVE' ? 'تایید درخواست سفیر' : 'رد درخواست سفیر'}
                </DialogTitle>

                <DialogContent>
                    {reviewDialogData && (
                        <Box>
                            <Alert
                                severity={reviewDialogData.action === 'APPROVE' ? 'success' : 'warning'}
                                sx={{ mb: 2 }}
                                icon={reviewDialogData.action === 'APPROVE' ? <CheckIcon /> : <CancelIcon />}
                            >
                                {reviewDialogData.action === 'APPROVE'
                                    ? 'در حال تایید درخواست'
                                    : 'در حال رد درخواست'}
                            </Alert>

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="توضیحات مدیریت (اختیاری)"
                                placeholder="در صورت نیاز توضیحات خود را وارد کنید..."
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                sx={{ mt: 2 }}
                            />

                            {reviewDialogData.action === 'REJECT' && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    <Typography variant="body2">
                                        توجه: پیام رد درخواست برای کاربر ارسال خواهد شد.
                                    </Typography>
                                </Alert>
                            )}
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseReviewDialog} color="inherit">
                        انصراف
                    </Button>
                    <Button
                        onClick={handleSubmitReview}
                        color={reviewDialogData?.action === 'APPROVE' ? 'success' : 'error'}
                        variant="contained"
                        disabled={loading}
                        startIcon={reviewDialogData?.action === 'APPROVE' ? <CheckIcon /> : <CancelIcon />}
                    >
                        {reviewDialogData?.action === 'APPROVE' ? 'تایید نهایی' : 'رد درخواست'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AmbassadorRequests;