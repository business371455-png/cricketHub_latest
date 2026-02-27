import { useState, useEffect } from 'react';
import { getNearbyGrounds } from '../services/groundService.js';
import GroundCard from '../components/GroundCard.jsx';

export default function GroundSearch() {
    const [grounds, setGrounds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchGrounds = async () => {
            try {
                // In a real app we'd pass lat/lng
                const data = await getNearbyGrounds({});
                setGrounds(data);
            } catch (err) {
                console.error("Failed to load grounds", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGrounds();
    }, []);

    const filteredGrounds = grounds.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 lg:p-8 pb-24">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white tracking-tight">Book a Ground</h1>
                <button className="bg-[#1E293B] hover:bg-[#28A745]/20 transition-colors border border-[#ffffff10] text-gray-300 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
                    <span>⚙️</span> Filter
                </button>
            </div>

            <div className="relative mb-6">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search ground or location..."
                    className="w-full bg-[#1E293B] border border-[#ffffff10] text-white pl-10 pr-4 py-3 rounded-xl focus:border-[#28A745] focus:outline-none placeholder-gray-500 shadow-inner"
                />
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-400">Loading grounds...</div>
            ) : filteredGrounds.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p>No grounds found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGrounds.map(ground => (
                        <GroundCard key={ground._id} ground={ground} />
                    ))}
                </div>
            )}
        </div>
    );
}
