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
  Delete,
  Add,
} from '@mui/icons-material';
import adminService from '../../services/adminService';
import type { User } from '../../services/adminService';
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
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [success, setSuccess] = useState<string>('');

  const [newUser, setNewUser] = useState<{
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    role: string;
    emailVerified: boolean;
  }>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    role: 'USER',
    emailVerified: true,
  });
  const [createLoading, setCreateLoading] = useState(false);

  const loadUsers = useCallback(async () => {
  setLoading(true);
  setError('');
  try {
    const data = await adminService.getUsers();
    console.log('📥 Users loaded from server - FULL DATA:', data);
    
    // 🔍 بررسی کاربر خاص
    const user56 = data.find((user: any) => user.id === 56);
    console.log('🔍 User 56 details:', user56);
    
    setUsers(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error loading users:', error);
    setError('خطا در بارگذاری کاربران');
  } finally {
    setLoading(false);
  }
}, []);

  const handleCreateUser = useCallback(async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      setError('نام کاربری، ایمیل و رمز عبور ضروری هستند');
      return;
    }

    setCreateLoading(true);
    try {
      await adminService.createUser(newUser);
      setNewUser({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        role: 'USER',
        emailVerified: true,
      });
      setSuccess('کاربر جدید با موفقیت ایجاد شد');
      setActiveTab('list');
      await loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      setError('خطا در ایجاد کاربر جدید');
    } finally {
      setCreateLoading(false);
    }
  }, [newUser, loadUsers]);

const handleUpdateUser = useCallback(async () => {
  if (!editingUser) return;
  
  setUpdateLoading(true);
  setError('');
  try {
    // اعتبارسنجی فیلدهای ضروری
    if (!editingUser.email || !editingUser.username) {
      setError('ایمیل و نام کاربری ضروری هستند');
      return;
    }

    // 🔍 دیباگ کامل
    console.log('emailVerified value before sending:', editingUser.emailVerified, 'Type:', typeof editingUser.emailVerified);
    console.log('Full editingUser object:', editingUser);
    
    // 🔧 ایجاد کپی از داده با اطمینان از ارسال emailVerified
    const userDataToSend = {
      ...editingUser,
      emailVerified: Boolean(editingUser.emailVerified) // اطمینان از boolean بودن
    };
    
    console.log('Data being sent after cleanup:', userDataToSend);
    
    await adminService.updateUser(editingUser.id, userDataToSend);
    setEditingUser(null);
    setSuccess('کاربر با موفقیت به‌روزرسانی شد');
    await loadUsers();
  } catch (error) {
    console.error('Error updating user:', error);
    setError('خطا در به‌روزرسانی کاربر');
  } finally {
    setUpdateLoading(false);
  }
}, [editingUser, loadUsers]);

  const handleEditUser = useCallback((user: User) => {
  setEditingUser({
    ...user,
    emailVerified: user.emailVerified !== undefined ? user.emailVerified : false  
  });
}, []);

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

  const getStatusColor = useCallback((emailVerified: boolean) => {
  return emailVerified ? 'success' : 'default';
}, []);

  // آمار کاربران
  const userStats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.emailVerified).length;
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

      {/* هدر صفحه با دکمه ایجاد کاربر */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          مدیریت کاربران
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => setActiveTab('add')}
          size="large"
        >
          کاربر جدید
        </Button>
      </Box>

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
                  {users.map((user) => {
                    console.log('🔄 Rendering user in table:', user.id, 'emailVerified:', user.emailVerified);
                    return (
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
                              label={user.emailVerified ? 'فعال' : 'غیرفعال'}
                              color={user.emailVerified ? 'success' : 'default'}
                              size="small"
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
                                onClick={() => handleEditUser(user)}
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
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* فرم ایجاد کاربر جدید */}
      {activeTab === 'add' && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight="600">
              ایجاد کاربر جدید
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 2 }}>
              <TextField 
                fullWidth 
                label="نام کاربری *" 
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              />
              <TextField 
                fullWidth 
                label="ایمیل *" 
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
              <TextField 
                fullWidth 
                label="نام" 
                value={newUser.firstName}
                onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
              />
              <TextField 
                fullWidth 
                label="نام خانوادگی" 
                value={newUser.lastName}
                onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
              />
              <TextField 
                fullWidth 
                label="شماره تماس" 
                value={newUser.phone}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
              />
              <TextField 
                fullWidth 
                label="رمز عبور *" 
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
              <TextField 
                fullWidth 
                select 
                label="نقش" 
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <MenuItem value="USER">کاربر</MenuItem>
                <MenuItem value="ADMIN">مدیر</MenuItem>
              </TextField>
              <TextField 
                fullWidth 
                select 
                label="وضعیت" 
                value={newUser.emailVerified ? "true" : "false"}
                onChange={(e) => setNewUser({...newUser, emailVerified: e.target.value === "true"})}
              >
                <MenuItem value="true">فعال</MenuItem>
                <MenuItem value="false">غیرفعال</MenuItem>
              </TextField>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button 
                variant="contained" 
                onClick={handleCreateUser}
                disabled={createLoading}
                startIcon={createLoading ? <CircularProgress size={16} /> : null}
              >
                {createLoading ? 'در حال ایجاد...' : 'ایجاد کاربر'}
              </Button>
              <Button 
                onClick={() => {
                  setActiveTab('list');
                  setNewUser({
                    username: '',
                    email: '',
                    firstName: '',
                    lastName: '',
                    phone: '',
                    password: '',
                    role: 'USER',
                    emailVerified: true,
                  });
                }}
                disabled={createLoading}
              >
                انصراف
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

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
                  <Typography variant="body1">{selectedUser.phone || selectedUser.mobile || 'ثبت نشده'}</Typography>
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
                      label={selectedUser.emailVerified ? 'فعال' : 'غیرفعال'} 
                      color={getStatusColor(selectedUser.emailVerified)}
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
                value={editingUser.mobile || ''}
                onChange={(e) => setEditingUser({...editingUser, mobile: e.target.value})}
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
  value={editingUser.emailVerified ? "true" : "false"} 
  onChange={(e) => setEditingUser({...editingUser, emailVerified: e.target.value === "true"})} 
>
  <MenuItem value="true">فعال</MenuItem>
  <MenuItem value="false">غیرفعال</MenuItem>
</TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingUser(null)} disabled={updateLoading}>
            انصراف
          </Button>
          <Button 
            onClick={handleUpdateUser} 
            variant="contained"
            disabled={updateLoading}
            startIcon={updateLoading ? <CircularProgress size={16} /> : null}
          >
            {updateLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
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