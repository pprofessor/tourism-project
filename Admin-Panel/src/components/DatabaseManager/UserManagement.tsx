import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit,
  Visibility,
  Person,
  Badge,
  TrendingUp,
  LockReset,
  Delete
} from '@mui/icons-material';
import adminService from '../../services/adminService';

// اینترفیس User منطبق با سرویس
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
  role: string;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);
  const [changePasswordUser, setChangePasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // توابع با useCallback برای بهینه‌سازی
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('خطا در بارگذاری کاربران');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateUser = useCallback(async () => {
    if (!editingUser) return;
    
    setLoading(true);
    try {
      await adminService.updateUser(editingUser.id, editingUser);
      setEditingUser(null);
      setSuccess('کاربر با موفقیت به‌روزرسانی شد');
      await loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('خطا در به‌روزرسانی کاربر');
    } finally {
      setLoading(false);
    }
  }, [editingUser, loadUsers]);

  const handleChangePassword = useCallback(async () => {
    if (!changePasswordUser) return;
    
    if (newPassword !== confirmPassword) {
      setPasswordError('رمز عبور و تأیید رمز عبور مطابقت ندارند');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }
    
    setLoading(true);
    try {
      const result = await adminService.changeUserPassword(changePasswordUser.id, newPassword);
      if (result.success) {
        setChangePasswordUser(null);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setSuccess('رمز عبور با موفقیت تغییر کرد');
      } else {
        setPasswordError('خطا در تغییر رمز عبور');
      }
    } catch (error) {
      setPasswordError('خطا در تغییر رمز عبور');
    } finally {
      setLoading(false);
    }
  }, [changePasswordUser, newPassword, confirmPassword]);

  const handleDeleteUser = useCallback(async () => {
    if (!deleteConfirmUser) return;
    
    setLoading(true);
    try {
      const result = await adminService.deleteUser(deleteConfirmUser.id);
      if (result.success) {
        setDeleteConfirmUser(null);
        setSuccess('کاربر با موفقیت حذف شد');
        await loadUsers();
      } else {
        setError('خطا در حذف کاربر');
      }
    } catch (error) {
      setError('خطا در حذف کاربر');
    } finally {
      setLoading(false);
    }
  }, [deleteConfirmUser, loadUsers]);

  // بارگذاری اولیه
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // توابع کمکی
  const getRoleColor = useCallback((role: string) => {
    return role === 'ADMIN' ? 'error' : 'info';
  }, []);

  const getStatusColor = useCallback((isActive: boolean) => {
    return isActive ? 'success' : 'default';
  }, []);

  // آمار کاربران
  const userStats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const adminUsers = users.filter(u => u.role === 'ADMIN').length;
    
    return { totalUsers, activeUsers, adminUsers };
  }, [users]);

  // پاک کردن پیام‌ها بعد از 5 ثانیه
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // کامپوننت لودینگ
  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* نمایش پیام‌های موفقیت/خطا */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* آمار کاربران */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        <Card sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}25)`,
          transition: 'transform 0.2s',
          '&:hover': { transform: 'translateY(-2px)' }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Person sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold" component="div">
                  {userStats.totalUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  کاربر کل
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.success.main}25)`,
          transition: 'transform 0.2s',
          '&:hover': { transform: 'translateY(-2px)' }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge sx={{ color: theme.palette.success.main, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold" component="div">
                  {userStats.activeUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  کاربر فعال
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.secondary.main}15, ${theme.palette.secondary.main}25)`,
          transition: 'transform 0.2s',
          '&:hover': { transform: 'translateY(-2px)' }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TrendingUp sx={{ color: theme.palette.secondary.main, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold" component="div">
                  {userStats.adminUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  کاربر مدیر
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* لیست کاربران */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="600" component="h2">
            لیست کاربران
          </Typography>
          
          {users.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                هیچ کاربری یافت نشد
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table aria-label="لیست کاربران">
                <TableHead>
                  <TableRow>
                    <TableCell>اطلاعات کاربر</TableCell>
                    <TableCell>تماس</TableCell>
                    <TableCell>وضعیت</TableCell>
                    <TableCell>اقدامات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            sx={{ bgcolor: theme.palette.primary.main }}
                            alt={user.firstName || user.username}
                          >
                            {user.firstName?.[0] || user.username?.[0] || 'U'}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="600">
                              {user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}`
                                : user.username
                              }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              @{user.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">{user.email}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.phone}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Chip 
                            label={user.role} 
                            color={getRoleColor(user.role)}
                            size="small"
                          />
                          <Chip 
                            label={user.isActive ? 'فعال' : 'غیرفعال'} 
                            color={getStatusColor(user.isActive)}
                            size="small"
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            عضویت: {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="مشاهده جزئیات">
                            <IconButton 
                              size="small"
                              onClick={() => setSelectedUser(user)}
                              sx={{ color: theme.palette.info.main }}
                              aria-label={`مشاهده جزئیات ${user.username}`}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="ویرایش کاربر">
                            <IconButton 
                              size="small"
                              onClick={() => setEditingUser(user)}
                              sx={{ color: theme.palette.primary.main }}
                              aria-label={`ویرایش ${user.username}`}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="تغییر رمز عبور">
                            <IconButton 
                              size="small"
                              onClick={() => setChangePasswordUser(user)}
                              sx={{ color: theme.palette.warning.main }}
                              aria-label={`تغییر رمز عبور ${user.username}`}
                            >
                              <LockReset />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="حذف کاربر">
                            <IconButton 
                              size="small"
                              onClick={() => setDeleteConfirmUser(user)}
                              sx={{ color: theme.palette.error.main }}
                              aria-label={`حذف ${user.username}`}
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
          )}
        </CardContent>
      </Card>

      {/* دیالوگ مشاهده جزئیات کاربر */}
      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          جزئیات کاربر
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    width: 60,
                    height: 60,
                    fontSize: '1.5rem'
                  }}
                  alt={selectedUser.firstName || selectedUser.username}
                >
                  {selectedUser.firstName?.[0] || selectedUser.username?.[0] || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {selectedUser.firstName && selectedUser.lastName 
                      ? `${selectedUser.firstName} ${selectedUser.lastName}`
                      : selectedUser.username
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{selectedUser.username}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">ایمیل</Typography>
                  <Typography variant="body1">{selectedUser.email}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">شماره تماس</Typography>
                  <Typography variant="body1">{selectedUser.phone}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">نقش</Typography>
                    <Chip 
                      label={selectedUser.role} 
                      color={getRoleColor(selectedUser.role)}
                      size="small"
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">وضعیت</Typography>
                    <Chip 
                      label={selectedUser.isActive ? 'فعال' : 'غیرفعال'} 
                      color={getStatusColor(selectedUser.isActive)}
                      size="small"
                    />
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">تاریخ عضویت</Typography>
                  <Typography variant="body1">
                    {new Date(selectedUser.createdAt).toLocaleDateString('fa-IR')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUser(null)}>بستن</Button>
        </DialogActions>
      </Dialog>

      {/* دیالوگ ویرایش کاربر */}
      <Dialog open={!!editingUser} onClose={() => setEditingUser(null)} maxWidth="md" fullWidth>
        <DialogTitle>ویرایش کاربر</DialogTitle>
        <DialogContent>
          {editingUser && (
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
              mt: 1
            }}>
              <TextField
                fullWidth
                label="نام"
                value={editingUser.firstName || ''}
                onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
              />
              <TextField
                fullWidth
                label="نام خانوادگی"
                value={editingUser.lastName || ''}
                onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
              />
              <TextField
                fullWidth
                label="ایمیل"
                value={editingUser.email}
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
              />
              <TextField
                fullWidth
                label="شماره تماس"
                value={editingUser.phone}
                onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
              />
              <TextField
                fullWidth
                select
                label="نقش"
                value={editingUser.role}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
              >
                <MenuItem value="USER">کاربر</MenuItem>
                <MenuItem value="ADMIN">مدیر</MenuItem>
              </TextField>
              <TextField
                fullWidth
                select
                label="وضعیت"
                value={editingUser.isActive ? 'active' : 'inactive'}
                onChange={(e) => setEditingUser({...editingUser, isActive: e.target.value === 'active'})}
              >
                <MenuItem value="active">فعال</MenuItem>
                <MenuItem value="inactive">غیرفعال</MenuItem>
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingUser(null)}>انصراف</Button>
          <Button 
            onClick={handleUpdateUser} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'ذخیره تغییرات'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* دیالوگ تغییر رمز عبور */}
      <Dialog open={!!changePasswordUser} onClose={() => setChangePasswordUser(null)}>
        <DialogTitle>
          تغییر رمز عبور
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            کاربر: {changePasswordUser?.username}
          </Typography>
          
          <TextField
            fullWidth
            type="password"
            label="رمز عبور جدید"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
          />
          
          <TextField
            fullWidth
            type="password"
            label="تأیید رمز عبور"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            error={!!passwordError}
            helperText={passwordError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setChangePasswordUser(null);
            setNewPassword('');
            setConfirmPassword('');
            setPasswordError('');
          }}>
            انصراف
          </Button>
          <Button 
            onClick={handleChangePassword}
            variant="contained" 
            color="warning"
            disabled={!newPassword || !confirmPassword || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'تغییر رمز'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* دیالوگ تأیید حذف کاربر */}
      <Dialog open={!!deleteConfirmUser} onClose={() => setDeleteConfirmUser(null)}>
        <DialogTitle>
          تأیید حذف کاربر
        </DialogTitle>
        <DialogContent>
          <Typography>
            آیا از حذف کاربر <strong>{deleteConfirmUser?.username}</strong> ({deleteConfirmUser?.email}) مطمئن هستید؟
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            این عمل غیرقابل بازگشت است!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmUser(null)}>
            انصراف
          </Button>
          <Button 
            onClick={handleDeleteUser}
            variant="contained" 
            color="error"
            startIcon={<Delete />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'حذف کاربر'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default React.memo(UserManagement);