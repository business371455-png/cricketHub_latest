import { useState } from 'react';
import * as ratingService from '../services/ratingService.js';

export default function RatingModal({ isOpen, onClose, matchId, players }) {
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [score, setScore] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState([]);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!selectedPlayer) {
            setError('Select a player to rate');
            return;
        }
        if (score === 0) {
            setError('Select a rating');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            await ratingService.submitRating({
                toUser: selectedPlayer,
                matchId,
                score,
                comment: comment.trim(),
            });
            setSubmitted([...submitted, selectedPlayer]);
            setSelectedPlayer('');
            setScore(0);
            setComment('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit rating');
        } finally {
            setSubmitting(false);
        }
    };

    const unratedPlayers = players?.filter(p => !submitted.includes(p._id)) || [];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
            <div className="bg-[#1E293B] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 border border-[#ffffff10]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Rate Players</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>

                {error && <div className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 border border-red-500/30">{error}</div>}

                {submitted.length > 0 && (
                    <div className="bg-green-500/10 text-green-400 text-sm p-3 rounded-lg mb-4 border border-green-500/20">
                        ✅ Rated {submitted.length} player{submitted.length > 1 ? 's' : ''} successfully
                    </div>
                )}

                {unratedPlayers.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-5xl mb-3">🌟</div>
                        <p className="text-white font-bold text-lg">All players rated!</p>
                        <p className="text-gray-400 text-sm">Thanks for your feedback.</p>
                        <button onClick={onClose} className="mt-4 bg-[#28A745] text-white px-6 py-2 rounded-xl font-bold">Done</button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {/* Player Select */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-3">Select Player</label>
                            <div className="space-y-2 max-h-36 overflow-y-auto">
                                {unratedPlayers.map(p => (
                                    <button
                                        key={p._id}
                                        onClick={() => setSelectedPlayer(p._id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${selectedPlayer === p._id
                                            ? 'bg-[#28A745]/10 border-[#28A745]/50'
                                            : 'bg-[#0F172A] border-[#ffffff10] hover:border-[#28A745]/30'}`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                                            {p.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-white text-sm font-medium">{p.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-3">Rating</label>
                            <div className="flex gap-2 justify-center">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setScore(s)}
                                        className={`text-3xl transition-transform hover:scale-110 ${s <= score ? 'grayscale-0' : 'grayscale opacity-30'}`}
                                    >
                                        ⭐
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Comment (optional)</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Great player..."
                                rows={2}
                                className="w-full bg-[#0F172A] text-white border border-[#ffffff10] rounded-xl px-4 py-3 focus:outline-none focus:border-[#28A745] transition-colors resize-none"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full py-3 rounded-xl bg-[#28A745] text-white font-bold hover:bg-[#218838] active:scale-[0.98] transition-all shadow-lg shadow-[#28A745]/30 disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : '⭐ Submit Rating'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
