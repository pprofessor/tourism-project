import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  SelectChangeEvent,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Badge,
  Stack,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  Work as WorkIcon,
  Star as StarIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

// Import types and service
import ambassadorService, { Ambassador } from '../../../services/ambassadorService';

// ============ STYLED COMPONENTS ============
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  '&.header-cell': {
    backgroundColor: theme.palette.mode === 'light'
      ? '#f8fafc'
      : '#1e293b',
    fontWeight: 600,
    fontSize: '0.875rem',
  }
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
  let color = '';
  let bgColor = '';

  switch (status) {
    case 'APPROVED':
      color = '#059669';
      bgColor = '#d1fae5';
      break;
    case 'SUSPENDED':
      color = '#dc2626';
      bgColor = '#fee2e2';
      break;
    case 'PENDING_REVIEW':
      color = '#d97706';
      bgColor = '#fef3c7';
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

// ============ MAIN COMPONENT ============
interface AmbassadorListProps {
  onSelectAmbassador: (ambassador: Ambassador) => void;
}

const AmbassadorList: React.FC<AmbassadorListProps> = ({ onSelectAmbassador }) => {
  // State management
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('APPROVED');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');

  // Pagination
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Action menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAmbassadorId, setSelectedAmbassadorId] = useState<number | null>(null);

  // Filters menu
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0
  });

  // Fetch ambassadors on mount and when filters change
  useEffect(() => {
    fetchAmbassadors();
    fetchStats();
  }, [page, rowsPerPage, statusFilter, searchTerm]);

  const fetchAmbassadors = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm || undefined,
        status: statusFilter,
        country: countryFilter || undefined,
        city: cityFilter || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const
      };

      const result = await ambassadorService.getAmbassadors(params);
      setAmbassadors(result.data);
      setTotalCount(result.total);
    } catch (err) {
      console.error('Error fetching ambassadors:', err);
      setError('خطا در دریافت لیست سفیران');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await ambassadorService.getStats();
      setStats({
        total: statsData.totalAmbassadors,
        active: statsData.activeAmbassadors,
        pending: statsData.pendingRequests,
        suspended: 0 // You might need to add this to your API
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page on new search
  };

  // Handle filter changes
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle action menu
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, ambassadorId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedAmbassadorId(ambassadorId);
  };

  const handleActionMenuClose = () => {
    setAnchorEl(null);
    setSelectedAmbassadorId(null);
  };

  // Handle ambassador actions
  const handleViewAmbassador = (ambassador: Ambassador) => {
    onSelectAmbassador(ambassador);
    handleActionMenuClose();
  };

  const handleEditAmbassador = (ambassador: Ambassador) => {
    onSelectAmbassador(ambassador);
    handleActionMenuClose();
  };

  const handleDeleteAmbassador = async (ambassadorId: number) => {
    if (!window.confirm('آیا از غیرفعال کردن این سفیر مطمئن هستید؟')) {
      return;
    }

    try {
      await ambassadorService.deleteAmbassador(ambassadorId);
      setSuccess('سفیر با موفقیت غیرفعال شد');
      fetchAmbassadors(); // Refresh list
      fetchStats(); // Refresh stats
    } catch (err) {
      console.error('Error deleting ambassador:', err);
      setError('خطا در غیرفعال کردن سفیر');
    } finally {
      handleActionMenuClose();
    }
  };

  // Handle export to Excel
  const handleExportToExcel = async () => {
    try {
      setLoading(true);
      const blob = await ambassadorService.exportToExcel({
        status: statusFilter,
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ambassadors_${format(new Date(), 'yyyy-MM-dd', { locale: faIR })}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccess('خروجی با موفقیت دانلود شد');
    } catch (err) {
      console.error('Error exporting to Excel:', err);
      setError('خطا در ایجاد خروجی اکسل');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy/MM/dd', { locale: faIR });
    } catch {
      return dateString;
    }
  };

  // Get selected ambassador for actions
  const getSelectedAmbassador = () => {
    return ambassadors.find(a => a.id === selectedAmbassadorId);
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSuccess(null);
  };

  return (
    <Box>
      {/* Header with Stats and Actions */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {/* Stats Card 1 */}
          <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.100' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" component="div" fontWeight="bold" color="primary.main">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                کل سفیران
              </Typography>
            </CardContent>
          </Card>

          {/* Stats Card 2 */}
          <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.100' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                {stats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                فعال
              </Typography>
            </CardContent>
          </Card>

          {/* Stats Card 3 */}
          <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.100' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" component="div" fontWeight="bold" color="warning.main">
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                در انتظار بررسی
              </Typography>
            </CardContent>
          </Card>

          {/* Stats Card 4 */}
          <Card sx={{ bgcolor: 'error.50', border: '1px solid', borderColor: 'error.100' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" component="div" fontWeight="bold" color="error.main">
                {stats.suspended}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                معلق شده
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' }, gap: 2, alignItems: 'center' }}>
          {/* Search Field */}
          <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 4' } }}>
            <TextField
              fullWidth
              placeholder="جستجو سفیر (نام، ایمیل، شماره موبایل، شهر)"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
              size="small"
            />
          </Box>

          {/* Status Filter */}
          <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 3' } }}>
            <FormControl fullWidth size="small">
              <InputLabel>وضعیت</InputLabel>
              <Select
                value={statusFilter}
                label="وضعیت"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="APPROVED">تأیید شده</MenuItem>
                <MenuItem value="SUSPENDED">معلق شده</MenuItem>
                <MenuItem value="PENDING_REVIEW">در انتظار بررسی</MenuItem>
                <MenuItem value="REJECTED">رد شده</MenuItem>
                <MenuItem value="ALL">همه</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Country Filter */}
          <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 3' } }}>
            <TextField
              fullWidth
              placeholder="کشور"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              size="small"
            />
          </Box>

          {/* Export Button */}
          <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExportToExcel}
                disabled={loading}
                fullWidth
              >
                خروجی
              </Button>
            </Stack>
          </Box>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {success}
        </Alert>
      </Snackbar>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell className="header-cell">سفیر</StyledTableCell>
                  <StyledTableCell className="header-cell">مکان</StyledTableCell>
                  <StyledTableCell className="header-cell">زبان‌ها</StyledTableCell>
                  <StyledTableCell className="header-cell">خدمات</StyledTableCell>
                  <StyledTableCell className="header-cell">وضعیت</StyledTableCell>
                  <StyledTableCell className="header-cell">تاریخ عضویت</StyledTableCell>
                  <StyledTableCell className="header-cell">امتیاز</StyledTableCell>
                  <StyledTableCell className="header-cell">عملیات</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {ambassadors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        سفیری یافت نشد
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  ambassadors.map((ambassador) => (
                    <TableRow
                      key={ambassador.id}
                      hover
                      sx={{
                        '&:hover': { backgroundColor: 'action.hover' },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleViewAmbassador(ambassador)}
                    >
                      {/* Ambassador Info */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {ambassador.user?.firstName?.[0] || <AccountIcon />}
                          </Avatar>
                          <Box>
                            <Typography fontWeight="medium">
                              {ambassador.user?.firstName} {ambassador.user?.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {ambassador.user?.mobile}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Location */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="body2">
                              {ambassador.city}, {ambassador.country}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {ambassador.address?.substring(0, 30)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Languages */}
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {Object.keys(ambassador.languages || {}).slice(0, 2).map(lang => (
                            <Chip
                              key={lang}
                              label={lang}
                              size="small"
                              icon={<LanguageIcon />}
                              variant="outlined"
                            />
                          ))}
                          {Object.keys(ambassador.languages || {}).length > 2 && (
                            <Chip
                              label={`+${Object.keys(ambassador.languages || {}).length - 2}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </TableCell>

                      {/* Services */}
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(ambassador.services || []).slice(0, 2).map(service => (
                            <Chip
                              key={service}
                              label={service}
                              size="small"
                              icon={<WorkIcon />}
                              sx={{ bgcolor: 'info.50', color: 'info.700' }}
                            />
                          ))}
                          {(ambassador.services || []).length > 2 && (
                            <Chip
                              label={`+${(ambassador.services || []).length - 2}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusChip
                          label={
                            ambassador.registrationStatus === 'APPROVED' ? 'تأیید شده' :
                              ambassador.registrationStatus === 'PENDING_REVIEW' ? 'در انتظار بررسی' :
                                ambassador.registrationStatus === 'SUSPENDED' ? 'معلق شده' :
                                  ambassador.registrationStatus === 'REJECTED' ? 'رد شده' : 'پیش‌نویس'
                          }
                          status={ambassador.registrationStatus}
                          size="small"
                        />
                      </TableCell>

                      {/* Join Date */}
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(ambassador.createdAt)}
                        </Typography>
                      </TableCell>

                      {/* Rating */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StarIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                          <Typography variant="body2">
                            {ambassador.rating?.toFixed(1) || 'جدید'}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Actions */}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionMenuOpen(e, ambassador.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="تعداد در هر صفحه:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} از ${count !== -1 ? count : `بیش از ${to}`}`
              }
            />
          </>
        )}
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionMenuClose}
      >
        {getSelectedAmbassador() && (
          <>
            <MenuItem onClick={() => handleViewAmbassador(getSelectedAmbassador()!)}>
              <ViewIcon fontSize="small" sx={{ mr: 1 }} />
              مشاهده جزئیات
            </MenuItem>
            <MenuItem onClick={() => handleEditAmbassador(getSelectedAmbassador()!)}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              ویرایش اطلاعات
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => handleDeleteAmbassador(selectedAmbassadorId!)}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              غیرفعال کردن
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default AmbassadorList;