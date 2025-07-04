import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import CreateReleaseOrder from './pages/CreateReleaseOrder';
import ReleaseOrders from './pages/ReleaseOrders';
import Workflows from './pages/Workflows';
import CreateWorkflow from './pages/CreateWorkflow';
import NovelCreation from './pages/NovelCreation';
import NovelWorks from './components/NovelWorks';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/release-orders" element={<ReleaseOrders />} />
            <Route path="/release-orders/create" element={<CreateReleaseOrder />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/workflows/create" element={<CreateWorkflow />} />
            <Route path="/novel-creation" element={<NovelCreation />} />
            <Route path="/novel-creation/works" element={<NovelWorks />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
