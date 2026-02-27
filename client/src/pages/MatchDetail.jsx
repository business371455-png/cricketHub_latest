import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchById, joinMatch } from '../services/matchService.js';
import { useSelector } from 'react-redux';

export default function MatchDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);

    // Get current user to see if they already joined
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
            setJoining(true);
            await joinMatch(id);
            alert("Successfully joined the match!");
            // Refresh data
            const data = await getMatchById(id);
            setMatch(data);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to join match");
        } finally {
            setJoining(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (!match) return null;

    const hasJoined = match.players.some(p => p._id === user?._id);
    const isFull = match.players.length - 1 >= match.playersNeeded; // Creator is +1

    return (
        <div className="min-h-screen bg-[#0F172A] p-4 lg:p-8 pb-24">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="text-gray-400 p-2 rounded-full hover:bg-white/5 transition-colors">
                    ← Back
                </button>
                <h1 className="text-xl font-bold text-white tracking-tight">Match Details</h1>
            </div>

            <div className="bg-[#1E293B] rounded-3xl p-6 shadow-xl border border-[#ffffff10]">
                <h2 className="text-3xl font-bold text-white mb-3">{match.teamName}</h2>
                <span className="inline-block bg-[#28A745]/20 text-[#28A745] border border-[#28A745]/30 px-3 py-1 rounded-full text-sm font-semibold mb-8">
                    {match.matchType}
                </span>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#ffffff05]">
                        <p className="text-sm text-gray-500 font-medium mb-1">Date</p>
                        <p className="font-semibold text-white">{new Date(match.startTime).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#ffffff05]">
                        <p className="text-sm text-gray-500 font-medium mb-1">Time</p>
                        <p className="font-semibold text-white">{new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>

                <div className="bg-[#0F172A] p-5 rounded-2xl border border-[#ffffff05] mb-8">
                    <h3 className="text-white font-semibold mb-4 text-lg">Players ({match.players.length}/{match.playersNeeded + 1})</h3>
                    <div className="flex -space-x-3 overflow-hidden p-2">
                        {match.players.map((p, index) => (
                            <div key={p._id || index} className="w-10 h-10 rounded-full bg-gray-700 border-2 border-[#1E293B] flex items-center justify-center text-xs text-white font-bold relative z-10" title={p.name}>
                                {p.name?.charAt(0) || 'U'}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleJoin}
                    disabled={joining || hasJoined || isFull}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-[#28A745]/20 active:scale-[0.98] ${hasJoined ? 'bg-gray-600 text-white cursor-not-allowed' :
                            isFull ? 'bg-red-900/50 text-red-500 cursor-not-allowed' :
                                'bg-[#28A745] text-white hover:bg-[#218838]'
                        }`}
                >
                    {joining ? 'Joining...' :
                        hasJoined ? 'Already Joined' :
                            isFull ? 'Match Full' :
                                'Join Match'
                    }
                </button>
            </div>
        </div>
    );
}
