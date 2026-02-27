import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    // If no user is logged in, perhaps redirect or show loading
    if (!user) {
        return (
            <div className="p-8 text-center text-white">
                <p>Loading profile...</p>
                <button onClick={() => navigate('/')} className="mt-4 text-[#28A745]">Go to Login</button>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 pb-24 min-h-screen relative">
            <h1 className="text-2xl font-bold text-white mb-6">Player Profile</h1>
            <div className="bg-[#1E293B] rounded-3xl p-6 shadow-xl border border-[#ffffff10] text-center max-w-sm mx-auto relative overflow-hidden">
                {/* Background Banner */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-[#28A745] to-[#218838] opacity-20"></div>

                <div className="relative z-10">
                    <div className="w-24 h-24 text-4xl mb-4 mx-auto rounded-full bg-[#28A745] flex items-center justify-center border-4 border-[#0F172A] shadow-lg shadow-[#28A745]/30 overflow-hidden">
                        {user.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white font-bold">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    <p className="text-[#28A745] font-medium mb-1">{user.role || 'All-rounder'}</p>
                    <p className="text-gray-400 text-sm mb-6">{user.phone}</p>

                    <div className="flex justify-around bg-[#0F172A] p-4 rounded-2xl border border-[#ffffff05]">
                        <div>
                            <p className="text-sm text-gray-400">Owner</p>
                            <p className="text-lg font-bold text-white">{user.isOwner ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Discipline</p>
                            <p className="text-xl font-bold text-[#28A745]">{user.disciplineRating ? user.disciplineRating.toFixed(1) : '5.0'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
