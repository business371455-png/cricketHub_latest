import { useState } from 'react';
import { useSelector } from 'react-redux';
import * as userService from '../services/userService.js';

export default function EditProfileModal({ isOpen, onClose, onProfileUpdated }) {
    const { user } = useSelector(state => state.auth);
    const [name, setName] = useState(user?.name || '');
    const [role, setRole] = useState(user?.role || 'All-rounder');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const roles = ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'];

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Name is required');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const updated = await userService.updateProfile({ name: name.trim(), role });
            onProfileUpdated?.(updated);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
            <div className="bg-[#1E293B] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 border border-[#ffffff10]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>

                {error && <div className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 border border-red-500/30">{error}</div>}

                <div className="space-y-5">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#0F172A] text-white border border-[#ffffff10] rounded-xl px-4 py-3 focus:outline-none focus:border-[#28A745] transition-colors"
                            maxLength={50}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-3">Playing Role</label>
                        <div className="grid grid-cols-2 gap-2">
                            {roles.map(r => (
                                <button
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${role === r
                                        ? 'bg-[#28A745] text-white border-[#28A745] shadow-lg shadow-[#28A745]/30'
                                        : 'bg-[#0F172A] text-gray-300 border-[#ffffff10] hover:border-[#28A745]/50'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-3 rounded-xl bg-[#28A745] text-white font-bold mt-6 hover:bg-[#218838] active:scale-[0.98] transition-all shadow-lg shadow-[#28A745]/30 disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
