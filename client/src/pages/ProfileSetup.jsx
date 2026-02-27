import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../services/userService.js';
import { setCredentials } from '../features/auth/authSlice.js';

export default function ProfileSetup() {
    const [name, setName] = useState('');
    const [role, setRole] = useState('All-rounder');
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const roles = ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const updatedUser = await updateUserProfile({
                name,
                role,
                isOwner
            });
            // Update Redux state with new user info, preserving token
            const token = localStorage.getItem('token');
            dispatch(setCredentials({ user: updatedUser, token }));

            navigate(isOwner ? '/owner' : '/home');
        } catch (err) {
            console.error('Failed to update profile', err);
            alert(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
            <div className="bg-[#1E293B] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#ffffff10]">
                <h1 className="text-2xl font-bold text-white mb-6">Complete Your Profile</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-[#0F172A] border-2 border-dashed border-[#28A745] flex items-center justify-center text-3xl cursor-pointer hover:bg-white/5 transition-colors">
                            📷
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 block mb-2">Account Type</label>
                        <div className="flex bg-[#0F172A] p-1 rounded-xl border border-[#ffffff20]">
                            <button
                                type="button"
                                onClick={() => setIsOwner(false)}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${!isOwner ? 'bg-[#28A745] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                Player
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOwner(true)}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${isOwner ? 'bg-[#28A745] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                Ground Owner
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 block mb-2">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#0F172A] border border-[#ffffff20] text-white px-4 py-3 rounded-xl focus:border-[#28A745] focus:outline-none transition-colors"
                            placeholder="Virat Kohli"
                            required
                        />
                    </div>

                    {!isOwner && (
                        <div>
                            <label className="text-sm text-gray-400 block mb-3">Primary Role</label>
                            <div className="grid grid-cols-2 gap-3">
                                {roles.map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${role === r
                                            ? 'bg-[#28A745] text-white shadow-lg shadow-[#28A745]/30'
                                            : 'bg-[#0F172A] text-gray-400 border border-[#ffffff10] hover:border-[#ffffff30]'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button disabled={loading} type="submit" className="w-full bg-[#28A745] text-white hover:bg-[#218838] transition-colors py-3 rounded-xl font-semibold shadow-lg shadow-[#28A745]/30 mt-4 disabled:opacity-50">
                        {loading ? 'Saving...' : (isOwner ? 'Save & Go to Dashboard' : 'Save & Start Playing')}
                    </button>
                </form>
            </div>
        </div>
    );
}
