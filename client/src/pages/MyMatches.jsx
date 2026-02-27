import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as matchService from '../services/matchService.js';
import MatchCard from '../components/MatchCard.jsx';

export default function MyMatches() {
    const { user } = useSelector(state => state.auth);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, open, confirmed, completed

    useEffect(() => {
        const fetchMyMatches = async () => {
            try {
                const data = await matchService.getMyMatches();
                setMatches(data);
            } catch (err) {
                console.error('Error fetching my matches:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyMatches();
    }, []);

    const filteredMatches = filter === 'all'
        ? matches
        : matches.filter(m => m.status.toLowerCase() === filter);

    const statusFilters = ['all', 'open', 'confirmed', 'completed', 'cancelled'];

    return (
        <div className="p-4 lg:p-8 pb-24 min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-4">My Matches</h1>

            {/* Filter Chips */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {statusFilters.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${filter === f
                            ? 'bg-[#28A745] text-white border-[#28A745] shadow-lg shadow-[#28A745]/30'
                            : 'bg-transparent text-gray-400 border-[#ffffff15] hover:border-[#28A745]/50'}`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-2 border-[#28A745] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filteredMatches.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🏏</div>
                    <h3 className="text-xl font-bold text-white mb-2">No Matches Found</h3>
                    <p className="text-gray-400">
                        {filter === 'all'
                            ? "You haven't joined any matches yet."
                            : `No ${filter} matches.`}
                    </p>
                </div>
            ) : (
                <div>
                    {filteredMatches.map((match, index) => (
                        <MatchCard key={match._id} match={match} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
}
