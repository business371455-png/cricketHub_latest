import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';

export default function MatchCard({ match, index }) {
    const cardRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.4, delay: index * 0.1, ease: 'power2.out' }
        );
    }, [index]);

    return (
        <div
            ref={cardRef}
            onClick={() => navigate(`/matches/${match._id}`)}
            className="bg-[#1E293B] rounded-2xl p-4 shadow-lg border border-[#ffffff10] mb-4 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-white">{match.teamName}</h3>
                <span className="bg-[#28A745]/20 text-[#28A745] text-xs px-2 py-1 rounded-full font-medium border border-[#28A745]/30">
                    {match.matchType}
                </span>
            </div>

            <div className="flex justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                    <span>📅</span> {new Date(match.startTime).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                    <span>⏰</span> {new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#ffffff10] pt-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                        {match.creatorId?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm text-gray-300 font-medium truncate max-w-[100px]">
                        {match.creatorId?.name || 'Creator'}
                    </span>
                </div>
                <div className="text-sm bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="text-[#28A745] font-bold">{match.players?.length || 1}</span>
                    <span className="text-gray-500"> / {match.playersNeeded + 1}</span>
                </div>
            </div>
        </div>
    );
}
