import { useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Book as BookIcon,
  Lightbulb as LightbulbIcon,
  AutoStories as AutoStoriesIcon,
  BarChart as BarChartIcon,
  HelpOutline as HelpOutlineIcon,
  FeedbackOutlined as FeedbackOutlinedIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const drawerWidth = 220;

const menuItems = [
  { text: '首页', icon: <HomeIcon />, path: '/' },
  { text: '项目管理', icon: <BookIcon />, path: '/projects' },
  { text: '发布单管理', icon: <AssignmentIcon />, path: '/release-orders' },
  { text: '灵感广场', icon: <LightbulbIcon />, path: '/inspiration' },
  { text: 'AI拆节', icon: <AutoStoriesIcon />, path: '/ai-chapter' },
  { text: '收益分析', icon: <BarChartIcon />, path: '/income' },
];

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'center', mt: 2, mb: 2 }}>
        <img src={logo} alt="logo" style={{ width: 36, marginRight: 8 }} />
        <Typography variant="h6" fontWeight={700} color="primary">
          御九创作平台
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{ borderRadius: 2, mx: 1, my: 0.5 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f7f8fa', width: '100vw', minWidth: 0 }}>
      <AppBar
        position="fixed"
        elevation={0}
        color="inherit"
        sx={{
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#fff',
          borderBottom: '1px solid #ececec',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="帮助">
              <IconButton color="primary">
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="反馈">
              <IconButton color="primary">
                <FeedbackOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Button
              startIcon={<Avatar sx={{ width: 28, height: 28 }}>2</Avatar>}
              onClick={handleAvatarClick}
              sx={{ textTransform: 'none', color: '#333', fontWeight: 500 }}
            >
              2008081129
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>个人中心</MenuItem>
              <MenuItem onClick={handleMenuClose}>退出登录</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 1, sm: 3 },
          bgcolor: '#f7f8fa',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 