import { useState, useEffect } from 'react';
import { getMyBookings } from '../services/bookingService.js';

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await getMyBookings();
                setBookings(data);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-[#28A745]/20 text-[#28A745] border-[#28A745]/30';
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <div className="p-4 lg:p-8 pb-24 min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-6">My Bookings</h1>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-2 border-[#28A745] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🏟️</div>
                    <h3 className="text-xl font-bold text-white mb-2">No Bookings Yet</h3>
                    <p className="text-gray-400">Book a ground to see your bookings here!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-[#1E293B] rounded-2xl p-5 shadow-xl border border-[#ffffff10]">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{booking.groundId?.name || 'Ground'}</h3>
                                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                                        📍 {booking.groundId?.address || 'Location'}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.paymentStatus)}`}>
                                    {booking.paymentStatus}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mt-4 pt-4 border-t border-[#ffffff05]">
                                <div className="flex items-center gap-1">
                                    📅 {new Date(booking.slotStart).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    ⏰ {new Date(booking.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="ml-auto font-bold text-white text-lg">₹{booking.amount}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
