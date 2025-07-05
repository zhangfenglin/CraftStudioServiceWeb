import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Button,
  Chip,
  Badge,
  useTheme,
  Container,
  Tabs,
  Tab,
  IconButton,
  useMediaQuery,
  Paper,
} from '@mui/material';
import {
  Home as HomeIcon,
  Book as BookIcon,
  Lightbulb as LightbulbIcon,
  AutoStories as AutoStoriesIcon,
  BarChart as BarChartIcon,
  HelpOutline as HelpOutlineIcon,
  FeedbackOutlined as FeedbackOutlinedIcon,
  Assignment as AssignmentIcon,
  AccountTree as AccountTreeIcon,
  Create as CreateIcon,
  NotificationsNone as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  KeyboardArrowDown as ArrowDownIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const menuItems = [
  { 
    text: '首页', 
    icon: <HomeIcon />, 
    path: '/',
    badge: null,
    description: '平台概览和统计'
  },
  { 
    text: '小说创作', 
    icon: <CreateIcon />, 
    path: '/novel-creation',
    badge: 'NEW',
    description: '创作您的小说作品'
  },
  { 
    text: '项目管理', 
    icon: <BookIcon />, 
    path: '/projects',
    badge: null,
    description: '管理您的创意项目'
  },
  { 
    text: '发布单管理', 
    icon: <AssignmentIcon />, 
    path: '/release-orders',
    badge: '3',
    description: '管理发布请求和记录'
  },
  { 
    text: '工作流管理', 
    icon: <AccountTreeIcon />, 
    path: '/workflows',
    badge: null,
    description: '业务流程和工作流'
  },
  { 
    text: '灵感广场', 
    icon: <LightbulbIcon />, 
    path: '/inspiration',
    badge: null,
    description: '获取创作灵感'
  },
  { 
    text: 'AI拆节', 
    icon: <AutoStoriesIcon />, 
    path: '/ai-chapter',
    badge: 'AI',
    description: 'AI智能章节拆分'
  },
  { 
    text: '收益分析', 
    icon: <BarChartIcon />, 
    path: '/income',
    badge: null,
    description: '收益数据和分析'
  },
];

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);
  const moreMenuOpen = Boolean(moreMenuAnchorEl);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMoreMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchorEl(null);
  };

  // 在移动端显示的主要菜单项
  const mainMenuItems = menuItems.slice(0, 4);
  // 在更多菜单中显示的次要菜单项
  const secondaryMenuItems = menuItems.slice(4);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* 顶部导航栏 */}
      <AppBar
        position="fixed"
        elevation={0}
        color="inherit"
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.06)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 }, py: 1 }}>
            {/* Logo区域 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mr: 2
              }}>
                <img src={logo} alt="logo" style={{ width: 28, height: 28 }} />
              </Box>
                             <Typography 
                 variant="h6" 
                 sx={{ 
                   fontWeight: 700,
                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                   backgroundClip: 'text',
                   WebkitBackgroundClip: 'text',
                   WebkitTextFillColor: 'transparent',
                   display: { xs: 'none', sm: 'block' }
                 }}
               >
                 九娱创作平台
               </Typography>
            </Box>

            {/* 导航菜单 */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <Tabs 
                  value={location.pathname} 
                  onChange={(_, newValue) => navigate(newValue)}
                  sx={{
                    '& .MuiTabs-indicator': {
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      height: 3,
                      borderRadius: '3px 3px 0 0',
                    },
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      minHeight: 48,
                      px: 2,
                      borderRadius: 2,
                      transition: 'background 0.2s, color 0.2s',
                      background: 'transparent',
                      boxShadow: 'none !important',
                      border: 'none !important',
                      outline: 'none !important',
                      '&.Mui-selected': {
                        color: 'primary.main',
                        fontWeight: 700,
                        background: 'transparent',
                        boxShadow: 'none !important',
                        border: 'none !important',
                        outline: 'none !important',
                      },
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.05)',
                        color: 'primary.main',
                        boxShadow: 'none !important',
                        border: 'none !important',
                        outline: 'none !important',
                      },
                      '&:active': {
                        background: 'transparent !important',
                        boxShadow: 'none !important',
                        border: 'none !important',
                        outline: 'none !important',
                      },
                      '&:focus': {
                        boxShadow: 'none !important',
                        border: 'none !important',
                        outline: 'none !important',
                      },
                    },
                    '& .MuiTab-iconWrapper': {
                      mr: 1,
                    },
                  }}
                >
                  {mainMenuItems.map((item) => (
                    <Tab
                      key={item.path}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {item.icon}
                          <Typography variant="body2">{item.text}</Typography>
                          {item.badge && (
                            <Chip
                              label={item.badge}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                background: item.badge === 'NEW' 
                                  ? 'linear-gradient(45deg, #ff6b6b, #ee5a24)' 
                                  : item.badge === 'AI'
                                  ? 'linear-gradient(45deg, #4ecdc4, #44a08d)'
                                  : 'primary.main',
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Box>
                      }
                      value={item.path}
                      disableRipple
                    />
                  ))}
                </Tabs>

                {/* 更多菜单按钮 */}
                <Tooltip title="更多功能">
                  <IconButton
                    onClick={handleMoreMenuClick}
                    sx={{
                      ml: 1,
                      borderRadius: 2,
                      background: 'transparent',
                      boxShadow: 'none !important',
                      border: 'none !important',
                      outline: 'none !important',
                      transition: 'background 0.2s',
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.05)',
                        boxShadow: 'none !important',
                        border: 'none !important',
                        outline: 'none !important',
                      },
                      '&:active': {
                        background: 'transparent !important',
                        boxShadow: 'none !important',
                        border: 'none !important',
                        outline: 'none !important',
                      },
                      '&:focus': {
                        boxShadow: 'none !important',
                        border: 'none !important',
                        outline: 'none !important',
                      },
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            {/* 右侧工具栏 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* 通知按钮 */}
              <Tooltip title="通知">
                <IconButton
                  onClick={handleNotificationClick}
                  sx={{
                    borderRadius: 2,
                    background: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                    outline: 'none',
                    transition: 'background 0.2s',
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.05)',
                    },
                    '&:active': {
                      background: 'transparent !important',
                      boxShadow: 'none !important',
                      border: 'none !important',
                      outline: 'none !important',
                    },
                    '&:focus': {
                      background: 'transparent !important',
                      boxShadow: 'none !important',
                      border: 'none !important',
                      outline: 'none !important',
                    },
                  }}
                >
                  <Badge badgeContent={5} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* 帮助按钮 */}
              <Tooltip title="帮助中心">
                <IconButton
                  sx={{
                    borderRadius: 2,
                    background: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                    outline: 'none',
                    transition: 'background 0.2s',
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.05)',
                    },
                    '&:active': {
                      background: 'transparent !important',
                      boxShadow: 'none !important',
                      border: 'none !important',
                      outline: 'none !important',
                    },
                    '&:focus': {
                      background: 'transparent !important',
                      boxShadow: 'none !important',
                      border: 'none !important',
                      outline: 'none !important',
                    },
                  }}
                >
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>

              {/* 反馈按钮 */}
              <Tooltip title="意见反馈">
                <IconButton
                  sx={{
                    borderRadius: 2,
                    background: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                    outline: 'none',
                    transition: 'background 0.2s',
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.05)',
                    },
                    '&:active': {
                      background: 'transparent !important',
                      boxShadow: 'none !important',
                      border: 'none !important',
                      outline: 'none !important',
                    },
                    '&:focus': {
                      background: 'transparent !important',
                      boxShadow: 'none !important',
                      border: 'none !important',
                      outline: 'none !important',
                    },
                  }}
                >
                  <FeedbackOutlinedIcon />
                </IconButton>
              </Tooltip>

              {/* 用户菜单 */}
              <Button
                onClick={handleAvatarClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 1.5,
                  py: 0.5,
                  minHeight: 40,
                  borderRadius: 999,
                  background: 'transparent',
                  boxShadow: 'none !important',
                  border: 'none !important',
                  outline: 'none !important',
                  textTransform: 'none',
                  color: 'text.primary',
                  fontWeight: 500,
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.05)',
                    boxShadow: 'none !important',
                    border: 'none !important',
                    outline: 'none !important',
                  },
                  '&:active': {
                    background: 'transparent !important',
                    boxShadow: 'none !important',
                    border: 'none !important',
                    outline: 'none !important',
                  },
                  '&:focus': {
                    boxShadow: 'none !important',
                    border: 'none !important',
                    outline: 'none !important',
                  },
                  '& .MuiAvatar-root': {
                    width: 36,
                    height: 36,
                    fontWeight: 700,
                    fontSize: 18,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  },
                }}
                endIcon={<ArrowDownIcon sx={{ ml: -1, fontSize: 22 }} />}
              >
                <Avatar>2</Avatar>
                <Box sx={{ textAlign: 'left', lineHeight: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: 16, lineHeight: 1.2 }}>
                    2008081129
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                    创作者
                  </Typography>
                </Box>
              </Button>

              {/* 用户下拉菜单 */}
              <Menu 
                anchorEl={anchorEl} 
                open={open} 
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 3,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    border: '1px solid',
                    borderColor: 'rgba(0,0,0,0.06)',
                    minWidth: 200,
                  }
                }}
              >
                <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
                  <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                  个人中心
                </MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
                  <SettingsIcon sx={{ mr: 2, color: 'primary.main' }} />
                  设置
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, color: 'error.main' }}>
                  <LogoutIcon sx={{ mr: 2 }} />
                  退出登录
                </MenuItem>
              </Menu>

              {/* 通知下拉菜单 */}
              <Menu 
                anchorEl={notificationAnchorEl} 
                open={notificationOpen} 
                onClose={handleNotificationClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 3,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    border: '1px solid',
                    borderColor: 'rgba(0,0,0,0.06)',
                    minWidth: 300,
                    maxHeight: 400,
                  }
                }}
              >
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" fontWeight={600}>通知</Typography>
                </Box>
                <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
                  <Typography variant="body2">
                    您有新的项目审核通知
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
                  <Typography variant="body2">
                    发布单已成功创建
                  </Typography>
                </MenuItem>
              </Menu>

              {/* 更多功能菜单 */}
              <Menu 
                anchorEl={moreMenuAnchorEl} 
                open={moreMenuOpen} 
                onClose={handleMoreMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 3,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    border: '1px solid',
                    borderColor: 'rgba(0,0,0,0.06)',
                    minWidth: 200,
                  }
                }}
              >
                {secondaryMenuItems.map((item) => (
                  <MenuItem 
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      handleMoreMenuClose();
                    }}
                    sx={{ 
                      py: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.05)',
                      }
                    }}
                  >
                    <Box sx={{ color: 'primary.main' }}>
                      {item.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {item.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.65rem',
                          background: item.badge === 'NEW' 
                            ? 'linear-gradient(45deg, #ff6b6b, #ee5a24)' 
                            : item.badge === 'AI'
                            ? 'linear-gradient(45deg, #4ecdc4, #44a08d)'
                            : 'primary.main',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 移动端导航栏 */}
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          color="inherit"
          sx={{
            top: 64,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.06)',
            zIndex: theme.zIndex.drawer,
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ px: { xs: 1, sm: 2 }, py: 1, minHeight: 48 }}>
              <Tabs 
                value={location.pathname} 
                onChange={(_, newValue) => navigate(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    minHeight: 40,
                    px: 1.5,
                    '&.Mui-selected': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.05)',
                      borderRadius: 2,
                    }
                  }
                }}
              >
                {menuItems.map((item) => (
                  <Tab
                    key={item.path}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {item.icon}
                        <Typography variant="caption">{item.text}</Typography>
                        {item.badge && (
                          <Chip
                            label={item.badge}
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: '0.6rem',
                              background: item.badge === 'NEW' 
                                ? 'linear-gradient(45deg, #ff6b6b, #ee5a24)' 
                                : item.badge === 'AI'
                                ? 'linear-gradient(45deg, #4ecdc4, #44a08d)'
                                : 'primary.main',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                    }
                    value={item.path}
                    disableRipple
                  />
                ))}
              </Tabs>
            </Toolbar>
          </Container>
        </AppBar>
      )}

      {/* 主内容区域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: isMobile ? 20 : 12,
          pb: 6,
          bgcolor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          width: '100vw',
          minWidth: 0,
          px: 0,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            flex: 1,
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 3 },
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            width: '100vw',
            minWidth: 0,
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default Layout; 