import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import * as challengeService from '../services/challengeService.js';

const statusSteps = ['Open', 'Pending', 'ConvertedToMatch'];
const statusLabels = { Open: '🟢 Open', Pending: '🟡 Pending', ConvertedToMatch: '✅ Match Confirmed', Expired: '⏰ Expired', Cancelled: '❌ Cancelled' };

export default function ChallengeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const pageRef = useRef(null);

    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [joinForm, setJoinForm] = useState({ teamName: '', message: '' });
    const [error, setError] = useState('');

    const isCreator = user && challenge && challenge.creatorId?._id === user._id;
    const alreadyRequested = challenge?.requests?.some(r => r.captainId?._id === user?._id || r.captainId === user?._id);

    useEffect(() => {
        fetchChallenge();
    }, [id]);

    useEffect(() => {
        if (pageRef.current) {
            gsap.fromTo(pageRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        }
    }, [challenge]);

    const fetchChallenge = async () => {
        setLoading(true);
        try {
            const data = await challengeService.getChallengeById(id);
            setChallenge(data);
        } catch {
            setError('Failed to load challenge');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestJoin = async () => {
        if (!joinForm.teamName.trim()) {
            setError('Team name is required');
            return;
        }
        setActionLoading(true);
        setError('');
        try {
            await challengeService.requestToJoin(id, joinForm);
            fetchChallenge();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send request');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAccept = async (requestId) => {
        setActionLoading(true);
        try {
            const result = await challengeService.selectOpponent(id, requestId);
            setChallenge(result.challenge);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to accept');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (requestId) => {
        setActionLoading(true);
        try {
            const updated = await challengeService.rejectRequest(id, requestId);
            setChallenge(updated);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reject');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('Cancel this challenge?')) return;
        setActionLoading(true);
        try {
            const updated = await challengeService.cancelChallenge(id);
            setChallenge(updated);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-2 border-[#28A745] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="p-6 text-center text-gray-400">
                <p className="text-3xl mb-2">❌</p>
                <p>Challenge not found.</p>
            </div>
        );
    }

    const slotDate = new Date(challenge.slotStart);
    const isFinal = ['ConvertedToMatch', 'Expired', 'Cancelled'].includes(challenge.status);

    return (
        <div ref={pageRef} className="p-4 max-w-2xl mx-auto pb-20">
            {/* Back button */}
            <button onClick={() => navigate('/challenges')} className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1">
                ← Back to Challenges
            </button>

            {/* Status Timeline */}
            <div className="flex items-center gap-2 mb-6">
                {statusSteps.map((s, i) => {
                    const idx = statusSteps.indexOf(challenge.status);
                    const completed = i <= idx;
                    return (
                        <div key={s} className="flex items-center gap-2 flex-1">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                completed ? 'bg-[#28A745] border-[#28A745] text-white' : 'border-white/20 text-gray-500'
                            }`}>
                                {i + 1}
                            </div>
                            {i < statusSteps.length - 1 && (
                                <div className={`flex-1 h-0.5 ${completed ? 'bg-[#28A745]' : 'bg-white/10'}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Challenge Header Card */}
            <div className="bg-[#1E293B] rounded-2xl p-5 border border-white/10 mb-4 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-white">{challenge.teamName}</h1>
                        <p className="text-sm text-gray-400 mt-1">by {challenge.creatorId?.name || 'Unknown'}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        challenge.status === 'Open' ? 'bg-[#28A745]/20 text-[#28A745] border border-[#28A745]/30' :
                        challenge.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        challenge.status === 'ConvertedToMatch' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                        {statusLabels[challenge.status] || challenge.status}
                    </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                        <p className="text-gray-500 text-xs">🏟️ Ground</p>
                        <p className="text-white font-medium mt-1">{challenge.groundId?.name || 'Unknown'}</p>
                    </div>
                    <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                        <p className="text-gray-500 text-xs">📅 Date & Time</p>
                        <p className="text-white font-medium mt-1">{slotDate.toLocaleDateString()}</p>
                        <p className="text-gray-400 text-xs">{slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                        <p className="text-gray-500 text-xs">🏏 Match Type</p>
                        <p className="text-[#28A745] font-medium mt-1">{challenge.matchType} · {challenge.overs} Overs</p>
                    </div>
                    <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                        <p className="text-gray-500 text-xs">👥 Players Needed</p>
                        <p className="text-white font-medium mt-1">{challenge.playersRequired}</p>
                    </div>
                </div>

                {challenge.notes && (
                    <div className="bg-black/20 p-3 rounded-xl border border-white/5 mt-3">
                        <p className="text-gray-500 text-xs mb-1">📝 Notes</p>
                        <p className="text-gray-300 text-sm italic">"{challenge.notes}"</p>
                    </div>
                )}
            </div>

            {/* Error message */}
            {error && (
                <p className="text-red-400 text-sm text-center mb-4 bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>
            )}

            {/* ---- CREATOR VIEW: Requests ---- */}
            {isCreator && !isFinal && (
                <div className="mb-4">
                    <h2 className="text-lg font-bold text-white mb-3">📩 Requests ({challenge.requests?.filter(r => r.status === 'Pending').length || 0})</h2>
                    {(!challenge.requests || challenge.requests.filter(r => r.status === 'Pending').length === 0) ? (
                        <div className="bg-[#1E293B] rounded-xl p-6 text-center border border-white/10">
                            <p className="text-gray-500 text-sm">No incoming requests yet. Share your challenge!</p>
                        </div>
                    ) : (
                        challenge.requests.filter(r => r.status === 'Pending').map(req => (
                            <div key={req._id} className="bg-[#1E293B] rounded-xl p-4 border border-white/10 mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm text-white font-bold">
                                            {req.captainId?.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{req.teamName}</p>
                                            <p className="text-xs text-gray-400">{req.captainId?.name || 'Captain'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAccept(req._id)}
                                            disabled={actionLoading}
                                            className="bg-[#28A745] hover:bg-[#218838] text-white text-xs px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-40"
                                        >
                                            ✅ Accept
                                        </button>
                                        <button
                                            onClick={() => handleReject(req._id)}
                                            disabled={actionLoading}
                                            className="bg-red-500/20 hover:bg-red-500/40 text-red-400 text-xs px-4 py-2 rounded-lg font-semibold transition-all border border-red-500/30 disabled:opacity-40"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                </div>
                                {req.message && <p className="text-gray-400 text-xs italic ml-13">"{req.message}"</p>}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* CREATOR: Cancel button */}
            {isCreator && !isFinal && (
                <button
                    onClick={handleCancel}
                    disabled={actionLoading}
                    className="w-full py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-semibold transition-all disabled:opacity-40"
                >
                    🗑️ Cancel Challenge
                </button>
            )}

            {/* ---- JOINER VIEW ---- */}
            {!isCreator && !isFinal && (
                <div className="bg-[#1E293B] rounded-2xl p-5 border border-white/10">
                    {alreadyRequested ? (
                        <div className="text-center py-4">
                            <p className="text-[#28A745] font-semibold text-lg">✅ Request Sent</p>
                            <p className="text-gray-400 text-sm mt-1">Waiting for the challenge creator to respond.</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-lg font-bold text-white mb-4">🤝 Request to Join</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Your Team Name *</label>
                                    <input
                                        value={joinForm.teamName}
                                        onChange={e => setJoinForm(prev => ({ ...prev, teamName: e.target.value }))}
                                        placeholder="Enter team name"
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#28A745] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Message (optional)</label>
                                    <textarea
                                        value={joinForm.message}
                                        onChange={e => setJoinForm(prev => ({ ...prev, message: e.target.value }))}
                                        placeholder="Introduce your team…"
                                        rows={2}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#28A745] outline-none resize-none"
                                    />
                                </div>
                                <button
                                    onClick={handleRequestJoin}
                                    disabled={actionLoading}
                                    className="w-full py-3 rounded-xl font-semibold bg-[#28A745] hover:bg-[#218838] text-white transition-all disabled:opacity-40"
                                >
                                    {actionLoading ? 'Sending…' : '🏏 Send Request'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ---- CONVERTED STATE ---- */}
            {challenge.status === 'ConvertedToMatch' && challenge.matchId && (
                <div className="bg-[#28A745]/10 rounded-2xl p-5 border border-[#28A745]/30 text-center">
                    <p className="text-3xl mb-2">🎉</p>
                    <p className="text-[#28A745] font-bold text-lg">Match Confirmed!</p>
                    <p className="text-gray-400 text-sm mt-1 mb-4">Both teams are locked in. Time to play!</p>
                    <button
                        onClick={() => navigate(`/matches/${challenge.matchId._id || challenge.matchId}`)}
                        className="bg-[#28A745] hover:bg-[#218838] text-white font-semibold px-6 py-3 rounded-xl transition-all"
                    >
                        View Match Details →
                    </button>
                </div>
            )}

            {/* ---- EXPIRED / CANCELLED STATE ---- */}
            {(challenge.status === 'Expired' || challenge.status === 'Cancelled') && (
                <div className="bg-gray-500/10 rounded-2xl p-5 border border-gray-500/20 text-center">
                    <p className="text-3xl mb-2">{challenge.status === 'Expired' ? '⏰' : '❌'}</p>
                    <p className="text-gray-400 font-bold text-lg">
                        {challenge.status === 'Expired' ? 'Challenge Expired' : 'Challenge Cancelled'}
                    </p>
                </div>
            )}
        </div>
    );
}
