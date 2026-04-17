import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProtectedRoute from '@/components/ui/ProtectedRoute';

const Home = lazy(() => import('@/pages/Home'));
const Trips = lazy(() => import('@/pages/Trips'));
const TripDetail = lazy(() => import('@/pages/TripDetail'));
const OneDayTripDetail = lazy(() => import('@/pages/OneDayTripDetail'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const CorporateTreks = lazy(() => import('@/pages/CorporateTreks'));
const BookingPage = lazy(() => import('@/pages/BookingPage'));
const TourBookingPage = lazy(() => import('@/pages/TourBookingPage'));
const MyBookings = lazy(() => import('@/pages/MyBookings'));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminTrips = lazy(() => import('@/pages/admin/AdminTrips'));
const AdminBookings = lazy(() => import('@/pages/admin/AdminBookings'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminTours = lazy(() => import('@/pages/admin/AdminTours'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
        {/* Public routes with main layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:slug" element={<TripDetail />} />
          <Route path="/tours/:slug" element={<OneDayTripDetail />} />
          <Route path="/weekend-trips" element={<Navigate to="/trips" replace />} />
          <Route path="/weekday-trips" element={<Navigate to="/trips" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/corporate-treks" element={<CorporateTreks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected user routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/booking/:tripId/:scheduleId" element={<BookingPage />} />
            <Route path="/tour-booking/:slug" element={<TourBookingPage />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin routes */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="trips" element={<AdminTrips />} />
            <Route path="tours" element={<AdminTours />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="messages" element={<Navigate to="/admin" replace />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
