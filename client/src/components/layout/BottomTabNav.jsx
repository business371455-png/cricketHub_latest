import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BottomTabNav = () => {
    const { user } = useSelector(state => state.auth);
    const isOwner = user?.isOwner;

    const navItems = isOwner ? [
        { name: 'Dashboard', path: '/owner', icon: '📊' },
        { name: 'Add', path: '/owner/add-ground', icon: '🏟️' },
        { name: 'Profile', path: '/profile', icon: '👤' },
    ] : [
        { name: 'Matches', path: '/my-matches', icon: '🏏' },
        { name: 'Challenges', path: '/challenges', icon: '⚔️' },
        { name: 'Search', path: '/grounds', icon: '🔍' },
        { name: 'Bookings', path: '/bookings', icon: '📅' },
        { name: 'Profile', path: '/profile', icon: '👤' },
    ];

    return (
        <nav className="bg-[#1E293B]/90 backdrop-blur-lg border-t border-white/10 flex justify-around p-2 pb-safe">
            {navItems.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-16 h-12 transition-colors ${isActive ? 'text-[#28A745]' : 'text-gray-400 hover:text-white'
                        }`
                    }
                >
                    <span className="text-xl leading-none">{item.icon}</span>
                    <span className="text-[10px] mt-1 font-medium">{item.name}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomTabNav;
