import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNearbyMatches } from '../services/matchService.js';
import { setMatches } from '../features/match/matchSlice.js';
import MatchCard from '../components/MatchCard.jsx';

export default function PlayerHome() {
    const dispatch = useDispatch();
    const { matches } = useSelector((state) => state.matches);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await getNearbyMatches({ type: '' });
                dispatch(setMatches(data));
            } catch (err) {
                console.error('Failed to fetch matches', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, [dispatch]);

    return (
        <div className="p-4 lg:p-8 pb-24">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white tracking-tight">Discover Matches</h1>
                <button className="bg-[#1E293B] hover:bg-[#28A745]/20 border border-[#ffffff10] text-gray-300 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors">
                    <span>⚙️</span> Filter
                </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
                {['All', 'Tennis', 'Leather', 'Box'].map((type, i) => (
                    <button key={type} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium shadow-sm transition-colors ${i === 0 ? 'bg-[#28A745] text-white' : 'bg-[#1E293B] text-gray-400 border border-white/5 hover:text-white'
                        }`}>
                        {type}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-400">Loading matches...</div>
            ) : matches.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4 animate-bounce">🏏</div>
                    <h3 className="text-xl text-white font-semibold mb-2">No Matches Nearby</h3>
                    <p className="text-gray-400">Be the first to create one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {matches.map((match, i) => (
                        <MatchCard key={match._id} match={match} index={i} />
                    ))}
                </div>
            )}
        </div>
    );
}
