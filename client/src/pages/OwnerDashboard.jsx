import { useState, useEffect } from 'react';
import GroundCard from '../components/GroundCard.jsx';
import EarningsChart from '../components/EarningsChart.jsx';
import SlotManager from '../components/SlotManager.jsx';
import { useNavigate } from 'react-router-dom';
import { getMyGrounds } from '../services/groundService.js';

export default function OwnerDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [myGrounds, setMyGrounds] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const groundsData = await getMyGrounds();
                setMyGrounds(groundsData);
            } catch (err) {
                console.error("Failed to load owner dashboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-8 text-white">Loading Dashboard...</div>;

    return (
        <div className="p-4 lg:p-8 pb-24">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white tracking-tight">Owner Dashboard</h1>
                <button
                    onClick={() => navigate('/owner/add-ground')}
                    className="bg-[#28A745] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-[#28A745]/30 hover:bg-[#218838] transition-colors"
                >
                    + Add Ground
                </button>
            </div>

            {/* Earnings Chart */}
            <EarningsChart />

            {/* Slot Manager for first ground */}
            {myGrounds.length > 0 && (
                <div className="my-8">
                    <SlotManager
                        slots={myGrounds[0]?.slots || []}
                        onSlotToggle={(slotData) => console.log('Slot toggled:', slotData)}
                    />
                </div>
            )}

            <h2 className="text-xl font-bold text-white mb-4">My Grounds</h2>
            {myGrounds.length === 0 ? (
                <div className="text-center py-10 bg-[#1E293B] rounded-2xl border border-[#ffffff10]">
                    <p className="text-gray-400 mb-4">You haven't added any grounds yet.</p>
                    <button onClick={() => navigate('/owner/add-ground')} className="text-[#28A745] font-semibold hover:underline">
                        Add your first ground
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myGrounds.map(ground => (
                        <GroundCard key={ground._id} ground={ground} />
                    ))}
                </div>
            )}
        </div>
    );
}
