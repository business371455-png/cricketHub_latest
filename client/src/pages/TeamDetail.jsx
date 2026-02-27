import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as teamService from '../services/teamService.js';

export default function TeamDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState('');
    const [error, setError] = useState('');

    const fetchTeam = async () => {
        try {
            const data = await teamService.getTeamById(id);
            setTeam(data);
        } catch (err) {
            setError('Failed to load team details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, [id]);

    const isMember = team?.members?.some(m => m._id === user?._id);
    const isCaptain = team?.captain?._id === user?._id;
    const isTeamFull = team?.members?.length >= team?.maxSize;

    const handleJoin = async () => {
        setActionLoading('join');
        try {
            const updated = await teamService.joinTeam(id);
            setTeam(updated);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join team');
        } finally {
            setActionLoading('');
        }
    };

    const handleLeave = async () => {
        if (!confirm('Are you sure you want to leave this team?')) return;
        setActionLoading('leave');
        try {
            const updated = await teamService.leaveTeam(id);
            setTeam(updated);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to leave team');
        } finally {
            setActionLoading('');
        }
    };

    const handleDisband = async () => {
        if (!confirm('Are you sure you want to disband this team? This action cannot be undone.')) return;
        setActionLoading('disband');
        try {
            await teamService.disbandTeam(id);
            navigate('/my-teams');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to disband team');
        } finally {
            setActionLoading('');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-10 h-10 border-2 border-[#28A745] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!team) {
        return (
            <div className="p-4 text-center py-16">
                <p className="text-red-400 text-lg">{error || 'Team not found'}</p>
                <button onClick={() => navigate('/my-teams')} className="mt-4 text-[#28A745]">← Back to My Teams</button>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 pb-24 min-h-screen">
            {/* Back Button */}
            <button onClick={() => navigate('/my-teams')} className="text-gray-400 hover:text-white mb-4 text-sm flex items-center gap-1">
                ← Back to My Teams
            </button>

            {/* Team Header Card */}
            <div className="bg-[#1E293B] rounded-2xl p-6 shadow-xl border border-[#ffffff10] mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-[#28A745] to-[#218838] opacity-20" />
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-2xl font-bold text-white">{team.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${team.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                            {team.status}
                        </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-400">
                        <span className="bg-[#28A745]/10 text-[#28A745] px-2 py-0.5 rounded-lg">{team.matchType}</span>
                        <span>👥 {team.members?.length || 0} / {team.maxSize} members</span>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && <div className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 border border-red-500/30">{error}</div>}

            {/* WhatsApp Link */}
            {team.whatsappLink && (
                <a
                    href={team.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-xl px-4 py-3 mb-6 hover:bg-green-600/30 transition-colors"
                >
                    <span className="text-xl">💬</span>
                    <span className="font-medium">Join WhatsApp Group</span>
                </a>
            )}

            {/* Captain */}
            <div className="mb-6">
                <h3 className="text-sm text-gray-400 font-medium mb-3">CAPTAIN</h3>
                <div className="bg-[#1E293B] rounded-xl p-4 border border-[#ffffff10] flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#28A745]/20 flex items-center justify-center border-2 border-[#28A745]/50 overflow-hidden">
                        {team.captain?.profileImage ? (
                            <img src={team.captain.profileImage} alt={team.captain.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[#28A745] font-bold text-lg">{team.captain?.name?.charAt(0) || 'C'}</span>
                        )}
                    </div>
                    <div>
                        <p className="text-white font-bold">{team.captain?.name}</p>
                        <p className="text-gray-400 text-sm">{team.captain?.role} • ⭐ {team.captain?.disciplineRating?.toFixed(1) || '5.0'}</p>
                    </div>
                    <span className="ml-auto bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-lg text-xs font-bold border border-yellow-500/30">👑 Captain</span>
                </div>
            </div>

            {/* Members */}
            <div className="mb-6">
                <h3 className="text-sm text-gray-400 font-medium mb-3">MEMBERS ({team.members?.length || 0})</h3>
                <div className="space-y-2">
                    {team.members?.map(member => (
                        <div key={member._id} className="bg-[#1E293B] rounded-xl p-3 border border-[#ffffff10] flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm text-white overflow-hidden">
                                {member.profileImage ? (
                                    <img src={member.profileImage} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    member.name?.charAt(0) || 'U'
                                )}
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">{member.name}</p>
                                <p className="text-gray-500 text-xs">{member.role} • ⭐ {member.disciplineRating?.toFixed(1) || '5.0'}</p>
                            </div>
                            {member._id === team.captain?._id && (
                                <span className="ml-auto text-yellow-400 text-xs">👑</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                {!isMember && team.status === 'Active' && !isTeamFull && (
                    <button
                        onClick={handleJoin}
                        disabled={actionLoading === 'join'}
                        className="w-full py-3 rounded-xl bg-[#28A745] text-white font-bold hover:bg-[#218838] active:scale-[0.98] transition-all shadow-lg shadow-[#28A745]/30 disabled:opacity-50"
                    >
                        {actionLoading === 'join' ? 'Joining...' : '🤝 Join Team'}
                    </button>
                )}

                {!isMember && isTeamFull && (
                    <div className="w-full py-3 rounded-xl bg-gray-700/50 text-gray-400 font-medium text-center">
                        Team is Full
                    </div>
                )}

                {isMember && !isCaptain && (
                    <button
                        onClick={handleLeave}
                        disabled={actionLoading === 'leave'}
                        className="w-full py-3 rounded-xl bg-transparent border border-red-500/50 text-red-400 font-bold hover:bg-red-500/10 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {actionLoading === 'leave' ? 'Leaving...' : '🚪 Leave Team'}
                    </button>
                )}

                {isCaptain && (
                    <button
                        onClick={handleDisband}
                        disabled={actionLoading === 'disband'}
                        className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 font-bold hover:bg-red-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {actionLoading === 'disband' ? 'Disbanding...' : '💥 Disband Team'}
                    </button>
                )}
            </div>
        </div>
    );
}
