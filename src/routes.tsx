import { RouteObject } from 'react-router-dom';
import Layout from './components/Layout';
import App from './App';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import CreateItem from './pages/CreateItem';
import EditItem from './pages/EditItem';
import Search from './pages/Search';
import ProductDetail from './pages/ProductDetail';
import Messages from './pages/Messages';
import DonorProfile from './pages/DonorProfile';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Resources from './pages/Resources';
import NotFound from './pages/NotFound';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <App /> },
      { path: 'profile', element: <Profile /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'create-item', element: <CreateItem /> },
      { path: 'edit-item/:id', element: <EditItem /> },
      { path: 'search', element: <Search /> },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: 'donor/:id', element: <DonorProfile /> },
      { path: 'messages', element: <Messages /> },
      { path: 'privacy', element: <PrivacyPolicy /> },
      { path: 'terms', element: <TermsAndConditions /> },
      { path: 'resources', element: <Resources /> },
      { path: 'contact', element: <ContactUs /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

