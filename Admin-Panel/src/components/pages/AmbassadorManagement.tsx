import React, { useState, useEffect } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Paper,
    Container,
    Typography,
    CircularProgress,
    Alert,
    Breadcrumbs,
    Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MessageIcon from '@mui/icons-material/Message';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';

// Import Tab Components (will create them step by step)
import AmbassadorList from './ambassadors/AmbassadorList';
import AmbassadorRequests from './ambassadors/AmbassadorRequests';
import AmbassadorAnalytics from './ambassadors/AmbassadorAnalytics';
import AmbassadorMessaging from './ambassadors/AmbassadorMessaging';
import AmbassadorShow from './ambassadors/AmbassadorShow';

// Import service
import ambassadorService from '../../services/ambassadorService';
import { Ambassador } from '../../services/ambassadorService';

// ============ STYLED COMPONENTS ============
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginTop: theme.spacing(2),
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTabs-indicator': {
        height: 3,
        borderRadius: '3px 3px 0 0',
    },
    '& .MuiTab-root': {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.95rem',
        minHeight: 60,
        '&.Mui-selected': {
            fontWeight: 600,
        },
    },
}));

// ============ TAB PANEL COMPONENT ============
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`ambassador-tabpanel-${index}`}
            aria-labelledby={`ambassador-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

// ============ MAIN COMPONENT ============
const AmbassadorManagement: React.FC = () => {
    // State management
    const [tabValue, setTabValue] = useState<number>(0);
    const [selectedAmbassador, setSelectedAmbassador] = useState<Ambassador | null>(null);
    const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch pending requests count on mount
    useEffect(() => {
        fetchPendingRequestsCount();
    }, []);

    const fetchPendingRequestsCount = async () => {
        try {
            setLoading(true);
            const result = await ambassadorService.getPendingRequests({ limit: 1 });
            setPendingRequestsCount(result.total || 0);
        } catch (err) {
            console.error('Error fetching pending requests count:', err);
            setError('دریافت تعداد درخواست‌ها با خطا مواجه شد');
        } finally {
            setLoading(false);
        }
    };

    // Handle tab change
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setSelectedAmbassador(null); // Reset selected ambassador when changing tabs
    };

    // Handle ambassador selection (for edit/view)
    const handleSelectAmbassador = (ambassador: Ambassador) => {
        setSelectedAmbassador(ambassador);
        setTabValue(4); // Switch to show/edit tab
    };

    // Handle back to list
    const handleBackToList = () => {
        setSelectedAmbassador(null);
        setTabValue(0);
    };

    // Tab configurations
    const tabs = [
        {
            label: 'لیست سفیران',
            icon: <PeopleIcon />,
            badge: null,
        },
        {
            label: 'درخواست‌های جدید',
            icon: <PendingActionsIcon />,
            badge: pendingRequestsCount > 0 ? pendingRequestsCount : null,
        },
        {
            label: 'آمار و گزارشات',
            icon: <AnalyticsIcon />,
            badge: null,
        },
        {
            label: 'ارسال پیام',
            icon: <MessageIcon />,
            badge: null,
        },
        {
            label: selectedAmbassador ? 'مشاهده سفیر' : 'ویرایش',
            icon: <EditIcon />,
            badge: null,
            disabled: !selectedAmbassador,
        },
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Breadcrumb */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    href="/"
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    داشبورد
                </Link>
                <Typography color="text.primary">
                    مدیریت سفیران
                </Typography>
            </Breadcrumbs>

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    مدیریت سفیران
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {selectedAmbassador ? `در حال مشاهده: ${selectedAmbassador.user?.firstName} ${selectedAmbassador.user?.lastName}` : ''}
                </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Main Content */}
            <StyledPaper>
                {/* Tabs Navigation */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <StyledTabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="ambassador management tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {tabs.map((tab, index) => (
                            <Tab
                                key={index}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {tab.icon}
                                        <span>{tab.label}</span>
                                        {tab.badge !== null && tab.badge > 0 && (
                                            <Box
                                                sx={{
                                                    bgcolor: 'error.main',
                                                    color: 'error.contrastText',
                                                    fontSize: '0.7rem',
                                                    borderRadius: '50%',
                                                    width: 20,
                                                    height: 20,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {tab.badge}
                                            </Box>
                                        )}
                                    </Box>
                                }
                                disabled={tab.disabled}
                                sx={{ opacity: tab.disabled ? 0.5 : 1 }}
                            />
                        ))}
                    </StyledTabs>
                </Box>

                {/* Loading State */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Tab Panels */}
                {!loading && (
                    <>
                        {/* Tab 1: Ambassador List */}
                        <TabPanel value={tabValue} index={0}>
                            <AmbassadorList onSelectAmbassador={handleSelectAmbassador} />
                        </TabPanel>

                        {/* Tab 2: Pending Requests */}
                        <TabPanel value={tabValue} index={1}>
                            <AmbassadorRequests
                                onRequestReviewed={fetchPendingRequestsCount}
                            />
                        </TabPanel>

                        {/* Tab 3: Analytics */}
                        <TabPanel value={tabValue} index={2}>
                            <AmbassadorAnalytics />
                        </TabPanel>

                        {/* Tab 4: Messaging */}
                        <TabPanel value={tabValue} index={3}>
                            <AmbassadorMessaging />
                        </TabPanel>

                        {/* Tab 5: Show/Edit Ambassador */}
                        <TabPanel value={tabValue} index={4}>
                            {selectedAmbassador ? (
                                <AmbassadorShow
                                    ambassador={selectedAmbassador}
                                    onBack={handleBackToList}
                                    onUpdate={() => {
                                        // Refresh list if needed
                                        setSelectedAmbassador(null);
                                        setTabValue(0);
                                    }}
                                />
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">
                                        هیچ سفیری انتخاب نشده است
                                    </Typography>
                                </Box>
                            )}
                        </TabPanel>
                    </>
                )}
            </StyledPaper>
        </Container>
    );
};

export default AmbassadorManagement;