import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChallenges } from '../features/challenge/challengeSlice.js';
import * as challengeService from '../services/challengeService.js';
import ChallengeCard from '../components/ChallengeCard.jsx';
import CreateChallengeModal from '../components/CreateChallengeModal.jsx';

const matchTypes = ['All', 'Tennis', 'Leather', 'Box'];

export default function ChallengeBoardPage() {
    const dispatch = useDispatch();
    const { challenges } = useSelector(state => state.challenges);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchChallenges = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter !== 'All') params.matchType = filter;
            const data = await challengeService.getChallenges(params);
            dispatch(setChallenges(data));
        } catch {
            dispatch(setChallenges([]));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, [filter]);

    return (
        <div className="p-4 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">🏏 Open Challenges</h1>
                    <p className="text-sm text-gray-400 mt-1">Find or create a public match invitation</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-[#28A745] hover:bg-[#218838] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95"
                >
                    + Create
                </button>
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {matchTypes.map(type => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                            filter === type
                                ? 'border-[#28A745] bg-[#28A745]/20 text-[#28A745]'
                                : 'border-white/10 text-gray-400 hover:border-white/30'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Challenge list */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="inline-block w-8 h-8 border-2 border-[#28A745] border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm mt-3">Loading challenges…</p>
                </div>
            ) : challenges.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-5xl mb-4">🏏</p>
                    <h3 className="text-lg font-semibold text-gray-400">No challenges yet</h3>
                    <p className="text-sm text-gray-500 mt-1">Be the first to throw down a challenge!</p>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="mt-6 bg-[#28A745] hover:bg-[#218838] text-white font-semibold px-6 py-3 rounded-xl transition-all"
                    >
                        🏏 Create Challenge
                    </button>
                </div>
            ) : (
                <div>
                    {challenges.map((c, i) => (
                        <ChallengeCard key={c._id} challenge={c} index={i} />
                    ))}
                </div>
            )}

            <CreateChallengeModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreated={fetchChallenges}
            />
        </div>
    );
}
