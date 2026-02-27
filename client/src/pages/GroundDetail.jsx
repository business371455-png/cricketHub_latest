import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroundById } from '../services/groundService.js';
import { createBooking, verifyPayment } from '../services/bookingService.js';

export default function GroundDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ground, setGround] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        const fetchGround = async () => {
            try {
                const data = await getGroundById(id);
                setGround(data);
            } catch (err) {
                console.error("Failed to load ground", err);
                alert("Ground not found");
                navigate('/grounds');
            } finally {
                setLoading(false);
            }
        };
        fetchGround();
    }, [id, navigate]);

    const handleBook = async () => {
        if (!selectedSlot) return;

        try {
            setIsBooking(true);

            // 1. Create Booking (Locks Slot)
            const booking = await createBooking({
                groundId: ground._id,
                date: new Date().toISOString().split('T')[0], // Today for demo
                slotTime: selectedSlot.time
            });

            // 2. Mock Razorpay/Gateway Payment
            // In a real app, we'd open the Razorpay widget here
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 3. Verify Payment
            await verifyPayment({
                bookingId: booking._id,
                paymentId: 'mock_pay_' + Date.now(),
                signature: 'mock_sig'
            });

            alert('Booking Successful!');
            navigate('/bookings');
        } catch (err) {
            console.error("Booking error", err);
            alert(err.response?.data?.message || 'Booking failed. Try again.');
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (!ground) return null;

    // Use actual slots from DB if available, else fallback
    const displaySlots = ground.slots?.length > 0 ? ground.slots : [
        { id: '1', time: '06:00 AM - 08:00 AM', isBooked: false, priceMod: 0 },
        { id: '2', time: '08:00 AM - 10:00 AM', isBooked: true, priceMod: 0 },
        { id: '3', time: '10:00 AM - 12:00 PM', isBooked: false, priceMod: 0 },
        { id: '4', time: '04:00 PM - 06:00 PM', isBooked: false, priceMod: 0 },
        { id: '5', time: '06:00 PM - 08:00 PM', isBooked: false, priceMod: 200 },
    ];

    return (
        <div className="min-h-screen bg-[#0F172A] pb-24">
            <div className="h-64 sm:h-80 relative bg-cover bg-center" style={{ backgroundImage: `url(${ground.images?.[0] || 'https://images.unsplash.com/photo-1540747913346-19e32fc3e620?w=1000&q=80'})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent p-4 flex flex-col justify-between">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-colors mt-2 ml-2">
                        ←
                    </button>
                    <div>
                        <span className="bg-[#28A745] text-white text-xs px-2 py-1 rounded font-bold uppercase tracking-wider mb-2 inline-block">Premium</span>
                        <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">{ground.name}</h1>
                        <p className="text-gray-200 font-medium flex items-center gap-1 drop-shadow-md">📍 {ground.address || 'Location not set'}</p>
                    </div>
                </div>
            </div>

            <div className="p-4 lg:p-8 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2 bg-[#1E293B] border border-[#ffffff10] px-3 py-1.5 rounded-lg shadow-sm">
                        ⭐ <span className="text-white font-bold">{ground.ratings?.average || '4.5'}</span> <span className="text-gray-400 text-sm">({ground.ratings?.count || 0} Reviews)</span>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Price Starts</p>
                        <p className="text-2xl font-bold text-[#28A745]">₹{ground.pricePerHour}<span className="text-sm text-gray-400 font-normal">/hr</span></p>
                    </div>
                </div>

                <div className="mb-8 bg-[#1E293B] p-6 rounded-2xl border border-[#ffffff10]">
                    <h3 className="text-lg font-bold text-white mb-4">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                        {(ground.amenities || ['Floodlights', 'Grass Outfield']).map(am => (
                            <span key={am} className="bg-[#0F172A] border border-[#ffffff05] text-gray-300 px-3 py-2 rounded-xl text-sm flex items-center gap-2">
                                ✓ {am}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Select Slot <span className="text-sm text-[#28A745] font-normal ml-2">Available Today</span></h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                        {displaySlots.map(slot => (
                            <button
                                key={slot.id || slot._id || slot.time}
                                disabled={slot.isBooked}
                                onClick={() => setSelectedSlot(slot)}
                                className={`p-4 rounded-xl border text-left transition-all ${slot.isBooked
                                    ? 'bg-red-500/5 border-red-500/10 text-red-500/40 cursor-not-allowed'
                                    : selectedSlot?.time === slot.time
                                        ? 'bg-[#28A745]/20 border-[#28A745] text-white shadow-lg shadow-[#28A745]/20 scale-[1.02]'
                                        : 'bg-[#1E293B] border-[#ffffff10] text-gray-300 hover:bg-[#ffffff05] hover:border-gray-500'
                                    }`}
                            >
                                <div className="font-semibold text-sm">{slot.time}</div>
                                {slot.priceMod > 0 && <div className="text-xs text-[#28A745] mt-1 font-medium">+₹{slot.priceMod} (Lights)</div>}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={!selectedSlot || isBooking}
                        onClick={handleBook}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${selectedSlot
                            ? 'bg-[#28A745] text-white shadow-xl shadow-[#28A745]/30 hover:bg-[#218838] active:scale-[0.98]'
                            : 'bg-[#1E293B] border border-[#ffffff10] text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isBooking ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> Processing...
                            </span>
                        ) : selectedSlot ? `Pay ₹${ground.pricePerHour + (selectedSlot.priceMod || 0)} & Book` : 'Select a Slot'}
                    </button>
                </div>
            </div>
        </div>
    );
}
