import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Checkbox,
    FormControlLabel,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    IconButton,
    Tabs,
    Tab,
    Stepper,
    Step,
    StepLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    RadioGroup,
    Radio,
    FormLabel,
    Switch
} from '@mui/material';
import {
    Send as SendIcon,
    Schedule as ScheduleIcon,
    Drafts as DraftsIcon,
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
    Visibility as ViewIcon,
    Add as AddIcon,
    Message as MessageIcon,
    Sms as SmsIcon,
    Email as EmailIcon,
    Notifications as NotificationIcon,
    People as PeopleIcon,
    Group as GroupIcon,
    Public as PublicIcon,
    Edit as EditIcon,
    CopyAll as CopyIcon,
    ArrowBack as BackIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

// ============ STYLED COMPONENTS ============
const MessageCard = styled(Card)(({ theme }) => ({
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2],
        transform: 'translateY(-2px)',
    },
    '&.selected': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary['50' as keyof typeof theme.palette.primary],
    },
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
    let color = '';
    let bgColor = '';

    switch (status) {
        case 'SENT':
            color = '#059669';
            bgColor = '#d1fae5';
            break;
        case 'SCHEDULED':
            color = '#2563eb';
            bgColor = '#dbeafe';
            break;
        case 'DRAFT':
            color = '#6b7280';
            bgColor = '#f3f4f6';
            break;
        case 'FAILED':
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
        fontWeight: 500,
        fontSize: '0.75rem',
    };
});

// ============ TYPES ============
interface MessageTemplate {
    id: number;
    title: string;
    subject: string;
    body: string;
    category: string;
    isActive: boolean;
    createdAt: string;
}

interface MessageRecipient {
    id: number;
    name: string;
    avatar?: string;
    mobile: string;
    email?: string;
    status: string;
    isSelected: boolean;
}

// ============ MAIN COMPONENT ============
const AmbassadorMessaging: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [composeMode, setComposeMode] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

    const [messageForm, setMessageForm] = useState<{
        subject: string;
        message: string;
        sendViaSMS: boolean;
        sendViaEmail: boolean;
        sendViaNotification: boolean;
        ambassadorIds: number[];
        scheduledAt?: string;
        templateId?: number;
    }>({
        subject: '',
        message: '',
        sendViaSMS: true,
        sendViaEmail: false,
        sendViaNotification: true,
        ambassadorIds: [],
    });

    const [recipients, setRecipients] = useState<MessageRecipient[]>([
        {
            id: 1,
            name: 'علی محمدی',
            mobile: '09123456789',
            email: 'ali@example.com',
            status: 'ACTIVE',
            isSelected: false
        },
        {
            id: 2,
            name: 'فاطمه کریمی',
            mobile: '09129876543',
            email: 'fatemeh@example.com',
            status: 'ACTIVE',
            isSelected: false
        },
        {
            id: 3,
            name: 'رضا احمدی',
            mobile: '09121234567',
            status: 'ACTIVE',
            isSelected: false
        }
    ]);

    const [recipientFilter, setRecipientFilter] = useState<string>('ALL');
    const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);

    const [templates] = useState<MessageTemplate[]>([
        {
            id: 1,
            title: 'خوش‌آمدگویی به سفیر جدید',
            subject: 'به خانواده تورینو خوش آمدید',
            body: 'عزیز {name}،\n\nاز اینکه به عنوان سفیر به خانواده تورینو پیوستید بسیار خوشحالیم.\n\nبا افتخار،\nتیم تورینو',
            category: 'WELCOME',
            isActive: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            title: 'یادآوری تکمیل پروفایل',
            subject: 'لطفاً پروفایل خود را تکمیل کنید',
            body: 'سلام {name}،\n\nلطفاً پروفایل خود را در اسرع وقت تکمیل کنید تا خدمات بهتری ارائه دهید.\n\nممنون،\nتیم پشتیبانی تورینو',
            category: 'REMINDER',
            isActive: true,
            createdAt: new Date().toISOString()
        }
    ]);

    const [activeStep, setActiveStep] = useState<number>(0);
    const steps = ['انتخاب مخاطبین', 'تنظیم پیام', 'تنظیم ارسال', 'تأیید نهایی'];

    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);

            // Mock data
            const mockMessages = [
                {
                    id: 1,
                    subject: 'خوش آمدگویی به سفیر جدید',
                    message: 'به خانواده تورینو خوش آمدید...',
                    ambassadorIds: [1, 2],
                    sendViaSMS: true,
                    sendViaEmail: false,
                    sendViaNotification: true,
                    status: 'SENT',
                    sentAt: '2024-01-15T10:30:00Z'
                },
                {
                    id: 2,
                    subject: 'یادآوری تکمیل پروفایل',
                    message: 'لطفاً پروفایل خود را تکمیل کنید...',
                    ambassadorIds: [3],
                    sendViaSMS: false,
                    sendViaEmail: true,
                    sendViaNotification: true,
                    status: 'SCHEDULED',
                    scheduledAt: '2024-01-20T14:00:00Z'
                }
            ];

            setMessages(mockMessages);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('خطا در دریافت پیام‌ها');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        if (newValue === 0) {
            setComposeMode(false);
        }
    };

    const handleComposeNew = () => {
        setComposeMode(true);
        setActiveStep(0);
        resetForm();
    };

    const handleCancelCompose = () => {
        setComposeMode(false);
        resetForm();
    };

    const resetForm = () => {
        setMessageForm({
            subject: '',
            message: '',
            sendViaSMS: true,
            sendViaEmail: false,
            sendViaNotification: true,
            ambassadorIds: [],
        });
        setSelectedRecipients([]);
        setRecipients(prev => prev.map(r => ({ ...r, isSelected: false })));
    };

    const handleFormChange = (field: string, value: any) => {
        setMessageForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTemplateSelect = (template: MessageTemplate) => {
        setMessageForm(prev => ({
            ...prev,
            subject: template.subject,
            message: template.body,
            templateId: template.id
        }));
        setActiveStep(1);
    };

    const handleRecipientSelect = (recipientId: number, selected: boolean) => {
        setRecipients(prev =>
            prev.map(r =>
                r.id === recipientId ? { ...r, isSelected: selected } : r
            )
        );

        if (selected) {
            setSelectedRecipients(prev => [...prev, recipientId]);
        } else {
            setSelectedRecipients(prev => prev.filter(id => id !== recipientId));
        }
    };

    const handleSelectAll = (selected: boolean) => {
        const filteredRecipients = recipients.filter(r =>
            recipientFilter === 'ALL' || r.status === recipientFilter
        );

        const newRecipientIds = selected ? filteredRecipients.map(r => r.id) : [];

        setRecipients(prev =>
            prev.map(r => ({
                ...r,
                isSelected: filteredRecipients.some(fr => fr.id === r.id) ? selected : r.isSelected
            }))
        );

        setSelectedRecipients(newRecipientIds);
    };

    const handleSendMessage = async () => {
        try {
            setLoading(true);
            setError(null);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSuccess('پیام با موفقیت ارسال شد');
            setComposeMode(false);
            resetForm();
            fetchMessages();

            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error sending message:', err);
            setError('خطا در ارسال پیام');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = () => {
        setSuccess('پیام به عنوان پیش‌نویس ذخیره شد');
        setTimeout(() => setSuccess(null), 3000);
    };

    const handleScheduleMessage = () => {
        setPreviewOpen(true);
    };

    const handleNextStep = () => {
        if (activeStep === 0 && selectedRecipients.length === 0) {
            setError('لطفاً حداقل یک مخاطب انتخاب کنید');
            return;
        }

        if (activeStep === 1 && (!messageForm.subject || !messageForm.message)) {
            setError('لطفاً موضوع و متن پیام را وارد کنید');
            return;
        }

        setActiveStep(prev => prev + 1);
        setError(null);
    };

    const handlePrevStep = () => {
        setActiveStep(prev => prev - 1);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'yyyy/MM/dd - HH:mm', { locale: faIR });
        } catch {
            return dateString;
        }
    };

    const getFilteredRecipients = () => {
        return recipients.filter(r =>
            recipientFilter === 'ALL' || r.status === recipientFilter
        );
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'SENT':
                return <CheckIcon color="success" />;
            case 'FAILED':
                return <ErrorIcon color="error" />;
            case 'SCHEDULED':
                return <ScheduleIcon color="info" />;
            default:
                return <DraftsIcon color="action" />;
        }
    };

    const selectedCount = selectedRecipients.length;
    const totalRecipients = recipients.length;

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
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            {!composeMode ? (
                /* Messages List View */
                <>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                            پیام‌رسانی به سفیران
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<SendIcon />}
                            onClick={handleComposeNew}
                        >
                            ارسال پیام جدید
                        </Button>
                    </Box>

                    {/* Tabs */}
                    <Paper sx={{ mb: 3, borderRadius: 2 }}>
                        <Tabs
                            value={activeTab}
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
                                icon={<DraftsIcon />}
                                iconPosition="start"
                                label="پیام‌های ارسالی"
                                sx={{ py: 2 }}
                            />
                            <Tab
                                icon={<ScheduleIcon />}
                                iconPosition="start"
                                label="پیام‌های زمان‌بندی شده"
                                sx={{ py: 2 }}
                            />
                            <Tab
                                icon={<MessageIcon />}
                                iconPosition="start"
                                label="قالب‌های پیام"
                                sx={{ py: 2 }}
                            />
                        </Tabs>
                    </Paper>

                    {/* Content based on active tab */}
                    {activeTab === 0 && (
                        /* Sent Messages */
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    تاریخچه پیام‌ها
                                </Typography>

                                <Button
                                    startIcon={<RefreshIcon />}
                                    onClick={fetchMessages}
                                    disabled={loading}
                                >
                                    بروزرسانی
                                </Button>
                            </Box>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                                    <CircularProgress />
                                </Box>
                            ) : messages.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <MessageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        هیچ پیامی یافت نشد
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        هنوز پیامی ارسال نکرده‌اید
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {messages.map((message) => (
                                        <MessageCard
                                            key={message.id}
                                            className={selectedMessage?.id === message.id ? 'selected' : ''}
                                            onClick={() => setSelectedMessage(message)}
                                        >
                                            <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                            {message.subject}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600 }}>
                                                            {message.message.substring(0, 100)}...
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <StatusChip
                                                            label={
                                                                message.status === 'SENT' ? 'ارسال شده' :
                                                                    message.status === 'SCHEDULED' ? 'زمان‌بندی شده' :
                                                                        message.status === 'DRAFT' ? 'پیش‌نویس' : 'ناموفق'
                                                            }
                                                            status={message.status || 'DRAFT'}
                                                            size="small"
                                                        />
                                                        {getStatusIcon(message.status)}
                                                    </Box>
                                                </Box>

                                                <Divider sx={{ my: 1 }} />

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Chip
                                                            icon={<PeopleIcon />}
                                                            label={`${message.ambassadorIds?.length || 0} مخاطب`}
                                                            size="small"
                                                            variant="outlined"
                                                        />

                                                        {message.sendViaSMS && (
                                                            <Chip
                                                                icon={<SmsIcon />}
                                                                label="پیامک"
                                                                size="small"
                                                                sx={{ bgcolor: 'info.50', color: 'info.700' }}
                                                            />
                                                        )}

                                                        {message.sendViaEmail && (
                                                            <Chip
                                                                icon={<EmailIcon />}
                                                                label="ایمیل"
                                                                size="small"
                                                                sx={{ bgcolor: 'warning.50', color: 'warning.700' }}
                                                            />
                                                        )}

                                                        {message.sendViaNotification && (
                                                            <Chip
                                                                icon={<NotificationIcon />}
                                                                label="اعلان"
                                                                size="small"
                                                                sx={{ bgcolor: 'success.50', color: 'success.700' }}
                                                            />
                                                        )}
                                                    </Box>

                                                    <Typography variant="caption" color="text.secondary">
                                                        {message.sentAt ? formatDate(message.sentAt) : formatDate(message.scheduledAt)}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </MessageCard>
                                    ))}
                                </Box>
                            )}
                        </Paper>
                    )}

                    {activeTab === 1 && (
                        /* Scheduled Messages */
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                            <Typography variant="h6" fontWeight="bold" mb={3}>
                                پیام‌های زمان‌بندی شده
                            </Typography>

                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <ScheduleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    هیچ پیام زمان‌بندی‌شده‌ای وجود ندارد
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    می‌توانید پیام‌ها را برای ارسال در آینده زمان‌بندی کنید
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<ScheduleIcon />}
                                    onClick={handleComposeNew}
                                >
                                    زمان‌بندی پیام جدید
                                </Button>
                            </Box>
                        </Paper>
                    )}

                    {activeTab === 2 && (
                        /* Message Templates */
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    قالب‌های پیام
                                </Typography>

                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                >
                                    افزودن قالب جدید
                                </Button>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                                {templates.map((template) => (
                                    <Card key={template.id} sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {template.title}
                                                </Typography>
                                                <Chip
                                                    label={template.category === 'WELCOME' ? 'خوش‌آمدگویی' : 'یادآوری'}
                                                    size="small"
                                                    color={template.category === 'WELCOME' ? 'primary' : 'secondary'}
                                                />
                                            </Box>

                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                <strong>موضوع:</strong> {template.subject}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary" sx={{
                                                mb: 2,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {template.body}
                                            </Typography>

                                            <Divider sx={{ my: 1 }} />

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <FormControlLabel
                                                    control={<Switch checked={template.isActive} />}
                                                    label="فعال"
                                                />

                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="استفاده از قالب">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleTemplateSelect(template)}
                                                        >
                                                            <SendIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="ویرایش">
                                                        <IconButton size="small">
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="کپی">
                                                        <IconButton size="small">
                                                            <CopyIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Paper>
                    )}
                </>
            ) : (
                /* Compose Message View */
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton onClick={handleCancelCompose}>
                                <BackIcon />
                            </IconButton>
                            <Typography variant="h5" fontWeight="bold">
                                ارسال پیام جدید
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<SaveIcon />}
                                onClick={handleSaveDraft}
                            >
                                ذخیره پیش‌نویس
                            </Button>
                        </Box>
                    </Box>

                    {/* Stepper */}
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Step 1: Select Recipients */}
                    {activeStep === 0 && (
                        <Box>
                            <Typography variant="h6" fontWeight="bold" mb={3}>
                                انتخاب مخاطبین
                            </Typography>

                            {/* Recipient Filter */}
                            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { md: 'center' } }}>
                                    <FormControl size="small" sx={{ minWidth: 200 }}>
                                        <InputLabel>فیلتر بر اساس وضعیت</InputLabel>
                                        <Select
                                            value={recipientFilter}
                                            label="فیلتر بر اساس وضعیت"
                                            onChange={(e) => setRecipientFilter(e.target.value)}
                                        >
                                            <MenuItem value="ALL">همه سفیران</MenuItem>
                                            <MenuItem value="ACTIVE">فعال</MenuItem>
                                            <MenuItem value="PENDING">در انتظار</MenuItem>
                                            <MenuItem value="SUSPENDED">معلق</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedCount} از {totalRecipients} مخاطب انتخاب شده
                                        </Typography>

                                        <Button
                                            size="small"
                                            onClick={() => handleSelectAll(true)}
                                        >
                                            انتخاب همه
                                        </Button>

                                        <Button
                                            size="small"
                                            onClick={() => handleSelectAll(false)}
                                        >
                                            لغو همه
                                        </Button>

                                        <Chip
                                            icon={<GroupIcon />}
                                            label="ارسال گروهی"
                                            color="primary"
                                            variant="outlined"
                                        />

                                        <Chip
                                            icon={<PublicIcon />}
                                            label="ارسال عمومی"
                                            color="secondary"
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Recipients List */}
                            <TableContainer component={Paper} sx={{ borderRadius: 2, maxHeight: 400 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    indeterminate={selectedCount > 0 && selectedCount < totalRecipients}
                                                    checked={selectedCount === totalRecipients}
                                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                                />
                                            </TableCell>
                                            <TableCell>سفیر</TableCell>
                                            <TableCell>اطلاعات تماس</TableCell>
                                            <TableCell>وضعیت</TableCell>
                                            <TableCell>عملیات</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getFilteredRecipients().map((recipient) => (
                                            <TableRow key={recipient.id} hover>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={recipient.isSelected}
                                                        onChange={(e) => handleRecipientSelect(recipient.id, e.target.checked)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar>
                                                            {recipient.name[0]}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography fontWeight="medium">
                                                                {recipient.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ID: {recipient.id}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <SmsIcon fontSize="small" />
                                                            {recipient.mobile}
                                                        </Typography>
                                                        {recipient.email && (
                                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                                                <EmailIcon fontSize="small" />
                                                                {recipient.email}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusChip
                                                        label={
                                                            recipient.status === 'ACTIVE' ? 'فعال' :
                                                                recipient.status === 'PENDING' ? 'در انتظار' : 'معلق'
                                                        }
                                                        status={recipient.status}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="مشاهده پروفایل">
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
                        </Box>
                    )}

                    {/* Step 2: Compose Message */}
                    {activeStep === 1 && (
                        <Box>
                            <Typography variant="h6" fontWeight="bold" mb={3}>
                                تنظیم پیام
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    fullWidth
                                    label="موضوع پیام"
                                    value={messageForm.subject}
                                    onChange={(e) => handleFormChange('subject', e.target.value)}
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="متن پیام"
                                    value={messageForm.message}
                                    onChange={(e) => handleFormChange('message', e.target.value)}
                                    multiline
                                    rows={8}
                                    required
                                    helperText="می‌توانید از متغیرهای {name}، {mobile} و ... استفاده کنید"
                                />

                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                        قالب‌های آماده
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                        {templates.map((template) => (
                                            <Chip
                                                key={template.id}
                                                label={template.title}
                                                onClick={() => handleTemplateSelect(template)}
                                                variant="outlined"
                                                sx={{ cursor: 'pointer' }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Step 3: Send Settings */}
                    {activeStep === 2 && (
                        <Box>
                            <Typography variant="h6" fontWeight="bold" mb={3}>
                                تنظیمات ارسال
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box>
                                    <FormLabel component="legend" sx={{ mb: 2, display: 'block' }}>
                                        روش‌های ارسال
                                    </FormLabel>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                                        <Card
                                            sx={{
                                                cursor: 'pointer',
                                                border: messageForm.sendViaSMS ? '2px solid' : '1px solid',
                                                borderColor: messageForm.sendViaSMS ? 'primary.main' : 'divider',
                                                bgcolor: messageForm.sendViaSMS ? 'primary.50' : 'transparent'
                                            }}
                                            onClick={() => handleFormChange('sendViaSMS', !messageForm.sendViaSMS)}
                                        >
                                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                                <SmsIcon
                                                    sx={{
                                                        fontSize: 40,
                                                        mb: 1,
                                                        color: messageForm.sendViaSMS ? 'primary.main' : 'text.secondary'
                                                    }}
                                                />
                                                <Typography fontWeight="medium">
                                                    پیامک (SMS)
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    ارسال از طریق پیامک
                                                </Typography>
                                            </CardContent>
                                        </Card>

                                        <Card
                                            sx={{
                                                cursor: 'pointer',
                                                border: messageForm.sendViaEmail ? '2px solid' : '1px solid',
                                                borderColor: messageForm.sendViaEmail ? 'warning.main' : 'divider',
                                                bgcolor: messageForm.sendViaEmail ? 'warning.50' : 'transparent'
                                            }}
                                            onClick={() => handleFormChange('sendViaEmail', !messageForm.sendViaEmail)}
                                        >
                                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                                <EmailIcon
                                                    sx={{
                                                        fontSize: 40,
                                                        mb: 1,
                                                        color: messageForm.sendViaEmail ? 'warning.main' : 'text.secondary'
                                                    }}
                                                />
                                                <Typography fontWeight="medium">
                                                    ایمیل
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    ارسال از طریق ایمیل
                                                </Typography>
                                            </CardContent>
                                        </Card>

                                        <Card
                                            sx={{
                                                cursor: 'pointer',
                                                border: messageForm.sendViaNotification ? '2px solid' : '1px solid',
                                                borderColor: messageForm.sendViaNotification ? 'success.main' : 'divider',
                                                bgcolor: messageForm.sendViaNotification ? 'success.50' : 'transparent'
                                            }}
                                            onClick={() => handleFormChange('sendViaNotification', !messageForm.sendViaNotification)}
                                        >
                                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                                <NotificationIcon
                                                    sx={{
                                                        fontSize: 40,
                                                        mb: 1,
                                                        color: messageForm.sendViaNotification ? 'success.main' : 'text.secondary'
                                                    }}
                                                />
                                                <Typography fontWeight="medium">
                                                    اعلان درون‌برنامه‌ای
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    ارسال اعلان داخل برنامه
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box>
                                    <FormLabel component="legend" sx={{ mb: 2, display: 'block' }}>
                                        زمان‌بندی ارسال
                                    </FormLabel>

                                    <RadioGroup
                                        value={messageForm.scheduledAt ? 'scheduled' : 'now'}
                                        onChange={(e) => {
                                            if (e.target.value === 'now') {
                                                handleFormChange('scheduledAt', undefined);
                                            } else {
                                                handleFormChange('scheduledAt', new Date(Date.now() + 3600000).toISOString());
                                            }
                                        }}
                                    >
                                        <FormControlLabel
                                            value="now"
                                            control={<Radio />}
                                            label="ارسال فوری"
                                        />
                                        <FormControlLabel
                                            value="scheduled"
                                            control={<Radio />}
                                            label="زمان‌بندی برای بعد"
                                        />
                                    </RadioGroup>

                                    {messageForm.scheduledAt && (
                                        <TextField
                                            fullWidth
                                            type="datetime-local"
                                            value={messageForm.scheduledAt.substring(0, 16)}
                                            onChange={(e) => handleFormChange('scheduledAt', e.target.value + ':00Z')}
                                            sx={{ mt: 2 }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Step 4: Final Review */}
                    {activeStep === 3 && (
                        <Box>
                            <Typography variant="h6" fontWeight="bold" mb={3}>
                                تأیید نهایی
                            </Typography>

                            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                            خلاصه پیام
                                        </Typography>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    موضوع:
                                                </Typography>
                                                <Typography fontWeight="medium">
                                                    {messageForm.subject}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    متن پیام:
                                                </Typography>
                                                <Paper sx={{ p: 2, bgcolor: 'white', borderRadius: 1, mt: 0.5 }}>
                                                    <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                                                        {messageForm.message}
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                            اطلاعات ارسال
                                        </Typography>

                                        <List dense>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <PeopleIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="تعداد مخاطبین"
                                                    secondary={selectedCount + ' سفیر'}
                                                />
                                            </ListItem>

                                            <ListItem>
                                                <ListItemIcon>
                                                    <SmsIcon color={messageForm.sendViaSMS ? 'primary' : 'disabled'} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="پیامک"
                                                    secondary={messageForm.sendViaSMS ? 'فعال' : 'غیرفعال'}
                                                />
                                            </ListItem>

                                            <ListItem>
                                                <ListItemIcon>
                                                    <EmailIcon color={messageForm.sendViaEmail ? 'warning' : 'disabled'} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="ایمیل"
                                                    secondary={messageForm.sendViaEmail ? 'فعال' : 'غیرفعال'}
                                                />
                                            </ListItem>

                                            <ListItem>
                                                <ListItemIcon>
                                                    <NotificationIcon color={messageForm.sendViaNotification ? 'success' : 'disabled'} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="اعلان"
                                                    secondary={messageForm.sendViaNotification ? 'فعال' : 'غیرفعال'}
                                                />
                                            </ListItem>

                                            {messageForm.scheduledAt && (
                                                <ListItem>
                                                    <ListItemIcon>
                                                        <ScheduleIcon />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary="زمان ارسال"
                                                        secondary={formatDate(messageForm.scheduledAt)}
                                                    />
                                                </ListItem>
                                            )}
                                        </List>
                                    </Box>
                                </Box>
                            </Paper>

                            <Alert severity="info" sx={{ mb: 3 }}>
                                <Typography variant="body2">
                                    پس از تأیید نهایی، پیام به {selectedCount} سفیر ارسال خواهد شد.
                                    {messageForm.scheduledAt && ' پیام در زمان تعیین شده ارسال می‌شود.'}
                                </Typography>
                            </Alert>
                        </Box>
                    )}

                    {/* Navigation Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Box>
                            {activeStep > 0 && (
                                <Button
                                    onClick={handlePrevStep}
                                    startIcon={<BackIcon />}
                                >
                                    مرحله قبل
                                </Button>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={handleCancelCompose}
                                startIcon={<CancelIcon />}
                            >
                                انصراف
                            </Button>

                            {activeStep < steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    onClick={handleNextStep}
                                    endIcon={<SendIcon />}
                                >
                                    مرحله بعد
                                </Button>
                            ) : (
                                <>
                                    {messageForm.scheduledAt ? (
                                        <Button
                                            variant="contained"
                                            color="info"
                                            onClick={handleScheduleMessage}
                                            startIcon={<ScheduleIcon />}
                                            disabled={loading}
                                        >
                                            زمان‌بندی ارسال
                                        </Button>
                                    ) : null}

                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleSendMessage}
                                        startIcon={<SendIcon />}
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={24} /> : 'ارسال پیام'}
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                </Paper>
            )}

            {/* Preview Dialog */}
            <Dialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    پیش‌نمایش پیام زمان‌بندی شده
                </DialogTitle>

                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        پیام شما برای ارسال در {formatDate(messageForm.scheduledAt)} زمان‌بندی شد.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setPreviewOpen(false)}>
                        بستن
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            handleSendMessage();
                            setPreviewOpen(false);
                        }}
                    >
                        تأیید و زمان‌بندی
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AmbassadorMessaging;