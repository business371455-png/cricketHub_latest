import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';

export default function TeamCard({ team, index }) {
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
            onClick={() => navigate(`/teams/${team._id}`)}
            className="bg-[#1E293B] rounded-2xl p-4 shadow-lg border border-[#ffffff10] mb-4 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-white">{team.name}</h3>
                <span className="bg-[#28A745]/20 text-[#28A745] text-xs px-2 py-1 rounded-full font-medium border border-[#28A745]/30">
                    {team.matchType}
                </span>
            </div>

            <div className="flex justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                    <span>👑</span> {team.captain?.name || 'Captain'}
                </div>
                <div className="flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${team.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {team.status}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#ffffff10] pt-3">
                <div className="flex -space-x-2">
                    {team.members?.slice(0, 5).map((member, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white border-2 border-[#1E293B]">
                            {member.profileImage ? (
                                <img src={member.profileImage} alt={member.name} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                member.name?.charAt(0) || 'U'
                            )}
                        </div>
                    ))}
                    {team.members?.length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-[#28A745]/20 flex items-center justify-center text-xs text-[#28A745] border-2 border-[#1E293B]">
                            +{team.members.length - 5}
                        </div>
                    )}
                </div>
                <div className="text-sm bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="text-[#28A745] font-bold">{team.members?.length || 1}</span>
                    <span className="text-gray-500"> / {team.maxSize}</span>
                </div>
            </div>
        </div>
    );
}
