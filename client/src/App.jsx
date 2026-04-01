import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import AppLayout from './components/layout/AppLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import ProfileSetup from './pages/ProfileSetup.jsx';
import PlayerHome from './pages/PlayerHome.jsx';
import MatchDetail from './pages/MatchDetail.jsx';
import GroundSearch from './pages/GroundSearch.jsx';
import GroundDetail from './pages/GroundDetail.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import AddGroundForm from './pages/AddGroundForm.jsx';
import Profile from './pages/Profile.jsx';
import Bookings from './pages/MyBookings.jsx';
import MyTeams from './pages/MyTeams.jsx';
import TeamDetail from './pages/TeamDetail.jsx';
import MyMatches from './pages/MyMatches.jsx';
import ChallengeBoardPage from './pages/ChallengeBoardPage.jsx';
import ChallengeDetailPage from './pages/ChallengeDetailPage.jsx';
import { setCredentials, logout } from './features/auth/authSlice.js';
import { getUserProfile } from './services/userService.js';

function App() {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(!!localStorage.getItem('token'));

  // On app load, validate the stored token by hitting /users/me
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      getUserProfile()
        .then((userData) => {
          dispatch(setCredentials({ user: userData, token: storedToken }));
        })
        .catch(() => {
          // Token is invalid or expired — clear everything
          dispatch(logout());
        })
        .finally(() => {
          setIsCheckingAuth(false);
        });
    } else {
      setIsCheckingAuth(false);
    }
  }, [dispatch]);

  // Show a minimal loading spinner while validating the token
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#28A745] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Landing: always show landing page, buttons adapt based on auth */}
      <Route path="/" element={<LandingPage />} />

      {/* Login: redirect authenticated users to dashboard */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/my-matches" replace /> : <Login />}
      />

      <Route path="/profile-setup" element={<ProfileSetup />} />

      {/* Routes with Navigation Layout */}
      <Route element={<AppLayout />}>
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/owner/add-ground" element={<AddGroundForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/grounds" element={<GroundSearch />} />
        <Route path="/matches/:id" element={<MatchDetail />} />
        <Route path="/grounds/:id" element={<GroundDetail />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/my-teams" element={<MyTeams />} />
        <Route path="/teams/:id" element={<TeamDetail />} />
        <Route path="/my-matches" element={<MyMatches />} />
        <Route path="/challenges" element={<ChallengeBoardPage />} />
        <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
