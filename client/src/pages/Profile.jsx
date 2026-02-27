import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, setCredentials } from '../features/auth/authSlice.js';
import * as userService from '../services/userService.js';
import EditProfileModal from '../components/EditProfileModal.jsx';

export default function Profile() {
    const { user, token } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [toggling, setToggling] = useState(false);

    if (!user) {
        return (
            <div className="p-8 text-center text-white">
                <p>Loading profile...</p>
                <button onClick={() => navigate('/')} className="mt-4 text-[#28A745]">Go to Login</button>
            </div>
        );
    }

    const handleToggleRole = async () => {
        setToggling(true);
        try {
            const result = await userService.toggleRole();
            dispatch(setCredentials({
                user: { ...user, isOwner: result.isOwner },
                token,
            }));
        } catch (err) {
            console.error('Toggle role error:', err);
            alert(err.response?.data?.message || 'Failed to toggle role');
        } finally {
            setToggling(false);
        }
    };

    const handleSignOut = () => {
        if (!confirm('Are you sure you want to sign out?')) return;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(logout());
        navigate('/');
    };

    const handleProfileUpdated = (updatedUser) => {
        dispatch(setCredentials({ user: updatedUser, token }));
    };

    return (
        <div className="p-4 lg:p-8 pb-24 min-h-screen relative">
            <h1 className="text-2xl font-bold text-white mb-6">Player Profile</h1>
            <div className="bg-[#1E293B] rounded-3xl p-6 shadow-xl border border-[#ffffff10] text-center max-w-sm mx-auto relative overflow-hidden">
                {/* Background Banner */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-[#28A745] to-[#218838] opacity-20"></div>

                <div className="relative z-10">
                    <div className="w-24 h-24 text-4xl mb-4 mx-auto rounded-full bg-[#28A745] flex items-center justify-center border-4 border-[#0F172A] shadow-lg shadow-[#28A745]/30 overflow-hidden">
                        {user.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white font-bold">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    <p className="text-[#28A745] font-medium mb-1">{user.role || 'All-rounder'}</p>
                    <p className="text-gray-400 text-sm mb-6">{user.phone}</p>

                    <div className="flex justify-around bg-[#0F172A] p-4 rounded-2xl border border-[#ffffff05] mb-6">
                        <div>
                            <p className="text-sm text-gray-400">Mode</p>
                            <p className="text-lg font-bold text-white">{user.isOwner ? '🏟️ Owner' : '🏏 Player'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Discipline</p>
                            <p className="text-xl font-bold text-[#28A745]">{user.disciplineRating ? user.disciplineRating.toFixed(1) : '5.0'}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="w-full py-3 rounded-xl bg-[#28A745] text-white font-bold hover:bg-[#218838] active:scale-[0.98] transition-all shadow-lg shadow-[#28A745]/30"
                        >
                            ✏️ Edit Profile
                        </button>

                        <button
                            onClick={handleToggleRole}
                            disabled={toggling}
                            className="w-full py-3 rounded-xl bg-[#1A237E] text-white font-bold hover:bg-[#1A237E]/80 active:scale-[0.98] transition-all border border-[#ffffff10] disabled:opacity-50"
                        >
                            {toggling ? 'Switching...' : `Switch to ${user.isOwner ? 'Player' : 'Owner'} Mode`}
                        </button>

                        <button
                            onClick={handleSignOut}
                            className="w-full py-3 rounded-xl bg-transparent border border-red-500/40 text-red-400 font-bold hover:bg-red-500/10 active:scale-[0.98] transition-all"
                        >
                            🚪 Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onProfileUpdated={handleProfileUpdated}
            />
        </div>
    );
}
