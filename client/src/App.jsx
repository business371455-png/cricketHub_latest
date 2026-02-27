import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />

      {/* Routes with Navigation Layout */}
      <Route element={<AppLayout />}>
        <Route path="/home" element={<PlayerHome />} />
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
      </Route>
    </Routes>
  );
}

export default App;
