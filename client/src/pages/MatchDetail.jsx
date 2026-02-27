import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchById, joinMatch, leaveMatch, cancelMatch } from '../services/matchService.js';
import { useSelector } from 'react-redux';
import RatingModal from '../components/RatingModal.jsx';

export default function MatchDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState('');
    const [showRating, setShowRating] = useState(false);

    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const data = await getMatchById(id);
                setMatch(data);
            } catch (err) {
                console.error("Match fetch error", err);
                alert("Match not found");
                navigate('/home');
            } finally {
                setLoading(false);
            }
        };
        fetchMatch();
    }, [id, navigate]);

    const handleJoin = async () => {
        try {
            setActionLoading('join');
            await joinMatch(id);
            const data = await getMatchById(id);
            setMatch(data);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to join match");
        } finally {
            setActionLoading('');
        }
    };

    const handleLeave = async () => {
        if (!confirm('Are you sure you want to leave this match?')) return;
        try {
            setActionLoading('leave');
            await leaveMatch(id);
            const data = await getMatchById(id);
            setMatch(data);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to leave match");
        } finally {
            setActionLoading('');
        }
    };

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this match?')) return;
        try {
            setActionLoading('cancel');
            await cancelMatch(id);
            const data = await getMatchById(id);
            setMatch(data);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to cancel match");
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
    if (!match) return null;

    const hasJoined = match.players.some(p => p._id === user?._id);
    const isCreator = match.creatorId?._id === user?._id;
    const isFull = match.players.length - 1 >= match.playersNeeded;
    const isCompleted = match.status === 'Completed';
    const isCancelled = match.status === 'Cancelled';

    return (
        <div className="min-h-screen bg-[#0F172A] p-4 lg:p-8 pb-24">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="text-gray-400 p-2 rounded-full hover:bg-white/5 transition-colors">
                    ← Back
                </button>
                <h1 className="text-xl font-bold text-white tracking-tight">Match Details</h1>
            </div>

            <div className="bg-[#1E293B] rounded-3xl p-6 shadow-xl border border-[#ffffff10]">
                <div className="flex justify-between items-start mb-3">
                    <h2 className="text-3xl font-bold text-white">{match.teamName}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${match.status === 'Open' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            match.status === 'Confirmed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                match.status === 'Completed' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' :
                                    'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                        {match.status}
                    </span>
                </div>
                <span className="inline-block bg-[#28A745]/20 text-[#28A745] border border-[#28A745]/30 px-3 py-1 rounded-full text-sm font-semibold mb-6">
                    {match.matchType}
                </span>

                <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#ffffff05]">
                        <p className="text-sm text-gray-500 font-medium mb-1">📅 Date</p>
                        <p className="font-semibold text-white text-sm">{new Date(match.startTime).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#ffffff05]">
                        <p className="text-sm text-gray-500 font-medium mb-1">⏰ Time</p>
                        <p className="font-semibold text-white text-sm">{new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#ffffff05]">
                        <p className="text-sm text-gray-500 font-medium mb-1">🏏 Overs</p>
                        <p className="font-semibold text-white text-sm">{match.overs || '—'}</p>
                    </div>
                </div>

                {/* WhatsApp Link */}
                {match.whatsappLink && (
                    <a
                        href={match.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-xl px-4 py-3 mb-6 hover:bg-green-600/30 transition-colors"
                    >
                        <span className="text-xl">💬</span>
                        <span className="font-medium">Join WhatsApp Group</span>
                    </a>
                )}

                {/* Players List */}
                <div className="bg-[#0F172A] p-5 rounded-2xl border border-[#ffffff05] mb-8">
                    <h3 className="text-white font-semibold mb-4 text-lg">Players ({match.players.length}/{match.playersNeeded + 1})</h3>
                    <div className="space-y-2">
                        {match.players.map((p, index) => (
                            <div key={p._id || index} className="flex items-center gap-3 p-2 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-[#1E293B] flex items-center justify-center text-xs text-white font-bold overflow-hidden">
                                    {p.profileImage ? (
                                        <img src={p.profileImage} alt={p.name} className="w-full h-full object-cover" />
                                    ) : (
                                        p.name?.charAt(0) || 'U'
                                    )}
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium">{p.name}</p>
                                    <p className="text-gray-500 text-xs">{p.role} • ⭐ {p.disciplineRating?.toFixed(1) || '5.0'}</p>
                                </div>
                                {p._id === match.creatorId?._id && (
                                    <span className="ml-auto text-yellow-400 text-xs bg-yellow-500/20 px-2 py-0.5 rounded-lg border border-yellow-500/30">Creator</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {/* Join */}
                    {!hasJoined && match.status === 'Open' && !isFull && (
                        <button
                            onClick={handleJoin}
                            disabled={actionLoading === 'join'}
                            className="w-full py-4 rounded-2xl font-bold text-lg bg-[#28A745] text-white hover:bg-[#218838] active:scale-[0.98] transition-all shadow-xl shadow-[#28A745]/20 disabled:opacity-50"
                        >
                            {actionLoading === 'join' ? 'Joining...' : '🤝 Join Match'}
                        </button>
                    )}

                    {/* Match Full */}
                    {!hasJoined && isFull && match.status === 'Open' && (
                        <div className="w-full py-4 rounded-2xl font-bold text-lg bg-gray-700/50 text-gray-400 text-center">
                            Match Full
                        </div>
                    )}

                    {/* Leave (non-creator) */}
                    {hasJoined && !isCreator && !isCancelled && (
                        <button
                            onClick={handleLeave}
                            disabled={actionLoading === 'leave'}
                            className="w-full py-3 rounded-xl bg-transparent border border-red-500/40 text-red-400 font-bold hover:bg-red-500/10 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {actionLoading === 'leave' ? 'Leaving...' : '🚪 Leave Match'}
                        </button>
                    )}

                    {/* Cancel (creator only) */}
                    {isCreator && match.status === 'Open' && (
                        <button
                            onClick={handleCancel}
                            disabled={actionLoading === 'cancel'}
                            className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 font-bold hover:bg-red-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {actionLoading === 'cancel' ? 'Cancelling...' : '❌ Cancel Match'}
                        </button>
                    )}

                    {/* Rate (completed matches) */}
                    {isCompleted && hasJoined && (
                        <button
                            onClick={() => setShowRating(true)}
                            className="w-full py-3 rounded-xl bg-[#1A237E] text-white font-bold hover:bg-[#1A237E]/80 active:scale-[0.98] transition-all border border-[#ffffff10]"
                        >
                            ⭐ Rate Players
                        </button>
                    )}

                    {/* Already joined indicator */}
                    {hasJoined && !isCreator && !isCancelled && match.status !== 'Completed' && (
                        <div className="text-center text-sm text-green-400 bg-green-500/10 rounded-xl py-2 border border-green-500/20">
                            ✅ You've joined this match
                        </div>
                    )}
                </div>
            </div>

            <RatingModal
                isOpen={showRating}
                onClose={() => setShowRating(false)}
                matchId={match._id}
                players={match.players?.filter(p => p._id !== user?._id)}
            />
        </div>
    );
}
