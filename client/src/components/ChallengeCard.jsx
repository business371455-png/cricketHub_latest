import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
    Open: { bg: 'bg-[#28A745]/20', text: 'text-[#28A745]', border: 'border-[#28A745]/30', label: '🟢 Open' },
    Pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', label: '🟡 Pending' },
    Expired: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', label: '⏰ Expired' },
    ConvertedToMatch: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: '✅ Matched' },
    Cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: '❌ Cancelled' },
};

export default function ChallengeCard({ challenge, index }) {
    const cardRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.4, delay: index * 0.1, ease: 'power2.out' }
        );
    }, [index]);

    const status = statusConfig[challenge.status] || statusConfig.Open;
    const slotDate = new Date(challenge.slotStart);

    return (
        <div
            ref={cardRef}
            onClick={() => navigate(`/challenges/${challenge._id}`)}
            className="bg-[#1E293B] rounded-2xl p-4 shadow-lg border border-[#ffffff10] mb-4 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
            {/* Top Row — Team name + Status badge */}
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-white truncate mr-2">{challenge.teamName}</h3>
                <span className={`${status.bg} ${status.text} text-xs px-2 py-1 rounded-full font-medium border ${status.border} whitespace-nowrap`}>
                    {status.label}
                </span>
            </div>

            {/* Match type + Overs */}
            <div className="flex gap-2 mb-3">
                <span className="bg-[#28A745]/20 text-[#28A745] text-xs px-2 py-1 rounded-full font-medium border border-[#28A745]/30">
                    {challenge.matchType}
                </span>
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full font-medium border border-blue-500/30">
                    {challenge.overs} Overs
                </span>
                <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full font-medium border border-purple-500/30">
                    {challenge.playersRequired} Players
                </span>
            </div>

            {/* Ground + Date/Time */}
            <div className="flex justify-between text-sm text-gray-400 mb-3">
                <div className="flex items-center gap-1 truncate">
                    <span>🏟️</span>
                    <span className="truncate">{challenge.groundId?.name || 'Ground'}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span>📅 {slotDate.toLocaleDateString()}</span>
                    <span>⏰ {slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>

            {/* Notes (if any) */}
            {challenge.notes && (
                <p className="text-xs text-gray-500 mb-3 italic truncate">"{challenge.notes}"</p>
            )}

            {/* Footer — Creator + Requests count */}
            <div className="flex items-center justify-between border-t border-[#ffffff10] pt-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                        {challenge.creatorId?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm text-gray-300 font-medium truncate max-w-[100px]">
                        {challenge.creatorId?.name || 'Creator'}
                    </span>
                </div>
                <div className="text-sm bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="text-amber-400 font-bold">{challenge.requests?.length || 0}</span>
                    <span className="text-gray-500"> request{challenge.requests?.length !== 1 ? 's' : ''}</span>
                </div>
            </div>
        </div>
    );
}
