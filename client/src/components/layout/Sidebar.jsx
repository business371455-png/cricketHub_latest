import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice.js';

const Sidebar = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isOwner = user?.isOwner;

    const navItems = isOwner ? [
        { name: 'Dashboard', path: '/owner', icon: '📊' },
        { name: 'Add Ground', path: '/owner/add-ground', icon: '🏟️' },
        { name: 'Profile', path: '/profile', icon: '👤' },
    ] : [
        { name: 'Player Dashboard', path: '/home', icon: '🏏' },
        { name: 'Ground Search', path: '/grounds', icon: '🔍' },
        { name: 'My Bookings', path: '/bookings', icon: '📅' },
        { name: 'Profile', path: '/profile', icon: '👤' },
    ];

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <aside className="h-full flex flex-col p-6">
            <div className="mb-10 flex items-center gap-3">
                <span className="text-3xl">🏏</span>
                <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">Cricket<br />Connect</h2>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-[#28A745]/20 text-[#28A745] font-semibold'
                                : 'text-gray-400 hover:bg-[#1E293B] hover:text-white'
                            }`
                        }
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-[#1E293B] hover:bg-red-500/20 text-red-400 px-4 py-3 rounded-xl transition-colors"
                >
                    🚪 Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
