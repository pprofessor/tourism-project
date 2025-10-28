import React, { useState, useEffect, useMemo } from 'react';
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
  Tab,
  Tabs,
  useTheme
} from '@mui/material';
import {
  Edit,
  Visibility,
  ShoppingCart,
  Person,
  Badge,
  TrendingUp
} from '@mui/icons-material';
import adminService from '../../services/adminService';

interface User {
  id: number;
  username: string;
  email: string;
  mobile: string;
  role: string;
  userType: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  createdAt: string;
  nationalCode?: string;
  passportNumber?: string;
  address?: string;
}

interface Purchase {
  id: number;
  userId: number;
  amount: number;
  date: string;
  type: string;
  status: string;
}

const UserManagement: React.FC = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  // داده‌های نمونه برای خریدها
  const samplePurchases: Purchase[] = useMemo(() => [
    { id: 1, userId: 10, amount: 250000, date: '2024-01-15', type: 'هتل', status: 'تکمیل شده' },
    { id: 2, userId: 10, amount: 180000, date: '2024-01-20', type: 'تور', status: 'تکمیل شده' },
    { id: 3, userId: 11, amount: 120000, date: '2024-01-18', type: 'هتل', status: 'در انتظار' }
  ], []);

  useEffect(() => {
    loadUsers();
    setPurchases(samplePurchases);
  }, [samplePurchases]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers();
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      await adminService.updateUser(editingUser.id, editingUser);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'VERIFIED': return 'success';
      case 'AMBASSADOR': return 'secondary';
      case 'REGISTERED_TOURIST': return 'primary';
      default: return 'default';
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'VERIFIED': return 'تایید شده';
      case 'AMBASSADOR': return 'سفیر';
      case 'REGISTERED_TOURIST': return 'تورگردان ثبت‌نام شده';
      default: return userType;
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'ADMIN' ? 'error' : 'info';
  };

  const userStats = useMemo(() => {
    const totalUsers = users.length;
    const verifiedUsers = users.filter(u => u.userType === 'VERIFIED').length;
    const ambassadorUsers = users.filter(u => u.userType === 'AMBASSADOR').length;
    
    return { totalUsers, verifiedUsers, ambassadorUsers };
  }, [users]);

  const userPurchases = useMemo(() => {
    if (!selectedUser) return [];
    return purchases.filter(p => p.userId === selectedUser.id);
  }, [selectedUser, purchases]);

  const totalSpent = useMemo(() => {
    return userPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  }, [userPurchases]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>در حال بارگذاری...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* آمار کاربران */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
        gap: 3,
        mb: 4
      }}>
        <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}25)` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Person sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {userStats.totalUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  کاربر کل
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.success.main}25)` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge sx={{ color: theme.palette.success.main, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {userStats.verifiedUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  کاربر تایید شده
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.secondary.main}15, ${theme.palette.secondary.main}25)` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TrendingUp sx={{ color: theme.palette.secondary.main, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {userStats.ambassadorUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  کاربر سفیر
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* لیست کاربران */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="600">
            لیست کاربران
          </Typography>
          
          <TableContainer component={Paper} elevation={0}>
            <Table>
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
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
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
                        {user.mobile}
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
                          label={getUserTypeLabel(user.userType)} 
                          color={getUserTypeColor(user.userType) as any}
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
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="ویرایش کاربر">
                          <IconButton 
                            size="small"
                            onClick={() => setEditingUser(user)}
                            sx={{ color: theme.palette.primary.main }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* دیالوگ ویرایش کاربر */}
      <Dialog open={!!editingUser} onClose={() => setEditingUser(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          ویرایش کاربر
        </DialogTitle>
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
                label="شماره موبایل"
                value={editingUser.mobile}
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
                label="سطح کاربری"
                value={editingUser.userType}
                onChange={(e) => setEditingUser({...editingUser, userType: e.target.value})}
              >
                <MenuItem value="REGISTERED_TOURIST">تورگردان ثبت‌نام شده</MenuItem>
                <MenuItem value="VERIFIED">تایید شده</MenuItem>
                <MenuItem value="AMBASSADOR">سفیر</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="کد ملی"
                value={editingUser.nationalCode || ''}
                onChange={(e) => setEditingUser({...editingUser, nationalCode: e.target.value})}
              />
              <TextField
                fullWidth
                label="شماره پاسپورت"
                value={editingUser.passportNumber || ''}
                onChange={(e) => setEditingUser({...editingUser, passportNumber: e.target.value})}
              />
              <Box sx={{ gridColumn: '1 / -1' }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="آدرس"
                  value={editingUser.address || ''}
                  onChange={(e) => setEditingUser({...editingUser, address: e.target.value})}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingUser(null)}>انصراف</Button>
          <Button onClick={handleUpdateUser} variant="contained">ذخیره تغییرات</Button>
        </DialogActions>
      </Dialog>

      {/* دیالوگ مشاهده جزئیات کاربر */}
      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} maxWidth="lg" fullWidth>
        <DialogTitle>
          جزئیات کاربر
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="اطلاعات هویتی" />
                <Tab label="گزارش خریدها" />
              </Tabs>
              
              <Box sx={{ pt: 3 }}>
                {activeTab === 0 && (
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 3
                  }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">نام کامل</Typography>
                      <Typography variant="body1">
                        {selectedUser.firstName && selectedUser.lastName 
                          ? `${selectedUser.firstName} ${selectedUser.lastName}`
                          : 'تعیین نشده'
                        }
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">کد ملی</Typography>
                      <Typography variant="body1">
                        {selectedUser.nationalCode || 'تعیین نشده'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">شماره پاسپورت</Typography>
                      <Typography variant="body1">
                        {selectedUser.passportNumber || 'تعیین نشده'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">آدرس</Typography>
                      <Typography variant="body1">
                        {selectedUser.address || 'تعیین نشده'}
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                {activeTab === 1 && (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <ShoppingCart color="primary" />
                      <Typography variant="h6">گزارش خریدها</Typography>
                    </Box>
                    
                    {userPurchases.length > 0 ? (
                      <TableContainer component={Paper} elevation={0}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>تاریخ</TableCell>
                              <TableCell>نوع</TableCell>
                              <TableCell>مبلغ</TableCell>
                              <TableCell>وضعیت</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {userPurchases.map((purchase) => (
                              <TableRow key={purchase.id}>
                                <TableCell>
                                  {new Date(purchase.date).toLocaleDateString('fa-IR')}
                                </TableCell>
                                <TableCell>{purchase.type}</TableCell>
                                <TableCell>
                                  {purchase.amount.toLocaleString()} تومان
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={purchase.status}
                                    color={purchase.status === 'تکمیل شده' ? 'success' : 'warning'}
                                    size="small"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography color="text.secondary" textAlign="center" py={4}>
                        هیچ خرید‌ای یافت نشد
                      </Typography>
                    )}
                    
                    {totalSpent > 0 && (
                      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="subtitle1" fontWeight="600">
                          مجموع خریدها: {totalSpent.toLocaleString()} تومان
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUser(null)}>بستن</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;