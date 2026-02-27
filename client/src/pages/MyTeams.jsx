import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTeams, setTeamLoading } from '../features/team/teamSlice.js';
import * as teamService from '../services/teamService.js';
import TeamCard from '../components/TeamCard.jsx';
import CreateTeamModal from '../components/CreateTeamModal.jsx';

export default function MyTeams() {
    const dispatch = useDispatch();
    const { teams, isLoading } = useSelector(state => state.teams);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchTeams = async () => {
        dispatch(setTeamLoading(true));
        try {
            const data = await teamService.getMyTeams();
            dispatch(setTeams(data));
        } catch (err) {
            console.error('Error fetching teams:', err);
        } finally {
            dispatch(setTeamLoading(false));
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    return (
        <div className="p-4 lg:p-8 pb-24 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">My Teams</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-[#28A745] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#218838] active:scale-[0.98] transition-all shadow-lg shadow-[#28A745]/30"
                >
                    + Create Team
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-2 border-[#28A745] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : teams.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🏏</div>
                    <h3 className="text-xl font-bold text-white mb-2">No Teams Yet</h3>
                    <p className="text-gray-400 mb-6">Create or join a team to start playing!</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-[#28A745] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#218838] transition-all"
                    >
                        Create Your First Team
                    </button>
                </div>
            ) : (
                <div>
                    {teams.map((team, index) => (
                        <TeamCard key={team._id} team={team} index={index} />
                    ))}
                </div>
            )}

            <CreateTeamModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onTeamCreated={() => fetchTeams()}
            />
        </div>
    );
}
