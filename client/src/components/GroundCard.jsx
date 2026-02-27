import { useNavigate } from 'react-router-dom';

export default function GroundCard({ ground }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/grounds/${ground._id}`)}
            className="bg-[#1E293B] rounded-2xl overflow-hidden shadow-lg border border-[#ffffff10] mb-4 cursor-pointer hover:scale-[1.02] transition-transform"
        >
            <div className="h-40 bg-gray-800 relative bg-cover bg-center" style={{ backgroundImage: `url(${ground.images?.[0] || 'https://images.unsplash.com/photo-1540747913346-19e32fc3e620?w=500&q=80'})` }}>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-white text-sm font-semibold flex items-center gap-1 border border-white/10 shadow-lg">
                    ⭐ {ground.ratings?.average || '4.5'}
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-white truncate pr-4">{ground.name}</h3>
                    <span className="text-[#28A745] font-bold">₹{ground.pricePerHour}<span className="text-xs font-normal text-gray-400">/hr</span></span>
                </div>
                <p className="text-gray-400 text-sm mb-1">📍 {ground.address || 'Location not set'}</p>
                {ground.groundType && (
                    <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-lg border border-blue-500/20 mb-3 inline-block">{ground.groundType}</span>
                )}

                <div className="flex gap-2">
                    {ground.amenities?.slice(0, 3).map((amenity, i) => (
                        <span key={i} className="text-xs bg-[#0F172A] text-gray-300 px-2 py-1 rounded border border-[#ffffff05]">
                            {amenity}
                        </span>
                    ))}
                    {ground.amenities?.length > 3 && (
                        <span className="text-xs bg-[#0F172A] text-gray-300 px-2 py-1 rounded border border-[#ffffff05]">
                            +{ground.amenities.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
