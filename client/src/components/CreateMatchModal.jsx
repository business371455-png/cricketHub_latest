import { useState } from 'react';
import { createMatch } from '../services/matchService.js';
import { useDispatch } from 'react-redux';
import { setMatches } from '../features/match/matchSlice.js';
import { getNearbyMatches } from '../services/matchService.js';

export default function CreateMatchModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [teamName, setTeamName] = useState('');
    const [matchType, setMatchType] = useState('Tennis');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [playersNeeded, setPlayersNeeded] = useState(1);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!date || !time) {
            alert("Date and time are required");
            return;
        }

        try {
            setLoading(true);
            const startTime = new Date(`${date}T${time}`).toISOString();

            await createMatch({
                teamName,
                matchType,
                playersNeeded: Number(playersNeeded),
                startTime
            });

            // Refresh matches
            const data = await getNearbyMatches({ type: '' });
            dispatch(setMatches(data));

            alert('Match Created Successfully!');
            onClose();
        } catch (err) {
            console.error('Failed to create match', err);
            alert(err.response?.data?.message || 'Failed to create match');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#1E293B] w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Host a Match</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Team Name</label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full bg-[#0F172A] border border-[#ffffff20] text-white px-4 py-3 rounded-xl focus:border-[#28A745] focus:outline-none"
                            placeholder="e.g. Royal Challengers"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Match Type</label>
                            <select
                                value={matchType}
                                onChange={(e) => setMatchType(e.target.value)}
                                className="w-full bg-[#0F172A] border border-[#ffffff20] text-white px-4 py-3 rounded-xl focus:border-[#28A745] focus:outline-none appearance-none"
                            >
                                <option>Tennis</option>
                                <option>Leather</option>
                                <option>Box</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Players Needed</label>
                            <input
                                type="number"
                                min="1"
                                max="11"
                                value={playersNeeded}
                                onChange={(e) => setPlayersNeeded(e.target.value)}
                                className="w-full bg-[#0F172A] border border-[#ffffff20] text-white px-4 py-3 rounded-xl focus:border-[#28A745] focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Date</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-[#0F172A] border border-[#ffffff20] text-white px-4 py-3 rounded-xl text-sm" required />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Time</label>
                            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-[#0F172A] border border-[#ffffff20] text-white px-4 py-3 rounded-xl text-sm" required />
                        </div>
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-[#28A745] text-white py-3 rounded-xl font-bold mt-4 shadow-lg shadow-[#28A745]/20 hover:bg-[#218838]">
                        {loading ? 'Creating...' : 'Create Match'}
                    </button>
                </form>
            </div>
        </div>
    );
}
