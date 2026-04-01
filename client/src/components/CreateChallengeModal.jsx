import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useSelector } from 'react-redux';
import * as challengeService from '../services/challengeService.js';
import * as bookingService from '../services/bookingService.js';
import * as groundService from '../services/groundService.js';

const matchTypes = ['Tennis', 'Leather', 'Box'];

// Generate time slots for a given date
const generateSlots = (date) => {
    const d = date ? new Date(date) : new Date();
    const now = new Date();
    const slots = [
        { label: '06:00 AM – 08:00 AM', startH: 6, endH: 8, priceMod: 0 },
        { label: '08:00 AM – 10:00 AM', startH: 8, endH: 10, priceMod: 0 },
        { label: '10:00 AM – 12:00 PM', startH: 10, endH: 12, priceMod: 0 },
        { label: '02:00 PM – 04:00 PM', startH: 14, endH: 16, priceMod: 0 },
        { label: '04:00 PM – 06:00 PM', startH: 16, endH: 18, priceMod: 0 },
        { label: '06:00 PM – 08:00 PM', startH: 18, endH: 20, priceMod: 200 },
    ];
    return slots
        .map((s, i) => {
            const start = new Date(d);
            start.setHours(s.startH, 0, 0, 0);
            const end = new Date(d);
            end.setHours(s.endH, 0, 0, 0);
            return {
                ...s,
                id: String(i + 1),
                slotStart: start.toISOString(),
                slotEnd: end.toISOString(),
                isPast: start <= now,
            };
        })
        .filter(s => !s.isPast); // Only show future slots
};

export default function CreateChallengeModal({ isOpen, onClose, onCreated }) {
    const { user } = useSelector(state => state.auth);
    const overlayRef = useRef(null);
    const panelRef = useRef(null);
    const [step, setStep] = useState(1);
    const [mode, setMode] = useState('ground'); // 'ground' or 'booking'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Ground+time mode state
    const [grounds, setGrounds] = useState([]);
    const [groundsLoading, setGroundsLoading] = useState(false);
    const [selectedGround, setSelectedGround] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);

    // Booking mode state (backward compat)
    const [bookings, setBookings] = useState([]);

    const [form, setForm] = useState({
        bookingId: '',
        groundId: '',
        slotStart: '',
        slotEnd: '',
        teamName: '',
        matchType: 'Tennis',
        overs: 10,
        playersRequired: 11,
        notes: '',
    });

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setMode('ground');
            setError('');
            setSelectedGround(null);
            setSelectedDate('');
            setSelectedSlot(null);
            setTimeSlots([]);
            setForm({
                bookingId: '', groundId: '', slotStart: '', slotEnd: '',
                teamName: '', matchType: 'Tennis', overs: 10, playersRequired: 11, notes: '',
            });
            fetchGrounds();
        }
    }, [isOpen]);

    // GSAP entrance
    useEffect(() => {
        if (isOpen && overlayRef.current && panelRef.current) {
            gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
            gsap.fromTo(panelRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
        }
    }, [isOpen]);

    // Generate time slots when date changes
    useEffect(() => {
        if (selectedDate) {
            const slots = generateSlots(selectedDate);
            setTimeSlots(slots);
            setSelectedSlot(null);
        }
    }, [selectedDate]);

    const fetchGrounds = async () => {
        setGroundsLoading(true);
        try {
            const data = await groundService.getNearbyGrounds();
            setGrounds(data);
        } catch {
            setGrounds([]);
        } finally {
            setGroundsLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
            const data = await bookingService.getMyBookings();
            const future = data.filter(b => new Date(b.slotStart) > new Date());
            setBookings(future);
        } catch {
            setBookings([]);
        }
    };

    const handleSelectGround = (ground) => {
        setSelectedGround(ground);
        setForm(prev => ({ ...prev, groundId: ground._id }));
    };

    const handleSelectSlot = (slot) => {
        setSelectedSlot(slot);
        setForm(prev => ({
            ...prev,
            slotStart: slot.slotStart,
            slotEnd: slot.slotEnd,
        }));
    };

    const handleSelectBooking = (booking) => {
        setForm(prev => ({
            ...prev,
            bookingId: booking._id,
            groundId: booking.groundId?._id || booking.groundId,
            slotStart: booking.slotStart,
            slotEnd: booking.slotEnd,
        }));
    };

    const canProceedStep1 = () => {
        if (mode === 'ground') {
            return selectedGround && selectedDate && selectedSlot;
        } else {
            return !!form.bookingId;
        }
    };

    const handleCreate = async () => {
        setLoading(true);
        setError('');
        try {
            const payload = {
                teamName: form.teamName || user?.name + "'s Team",
                groundId: form.groundId,
                matchType: form.matchType,
                overs: form.overs,
                playersRequired: form.playersRequired,
                notes: form.notes,
            };

            if (mode === 'booking' && form.bookingId) {
                // Path A: linked to booking
                payload.bookingId = form.bookingId;
            } else {
                // Path B: ground + time (no booking yet)
                payload.slotStart = form.slotStart;
                payload.slotEnd = form.slotEnd;
            }

            await challengeService.createChallenge(payload);
            onCreated?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create challenge');
        } finally {
            setLoading(false);
        }
    };

    // Min date for date picker (today)
    const today = new Date().toISOString().split('T')[0];

    if (!isOpen) return null;

    return (
        <div ref={overlayRef} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div ref={panelRef} className="bg-[#1E293B] rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-lg font-bold text-white">
                        {step === 1 ? '🏟️ Select Ground & Time' : step === 2 ? '🏏 Challenge Details' : '✅ Review & Publish'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2 px-4 pt-4">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bg-[#28A745]' : 'bg-white/10'}`} />
                    ))}
                </div>

                <div className="p-4">
                    {/* ════════ STEP 1 — Select Ground & Time ════════ */}
                    {step === 1 && (
                        <div className="space-y-4">
                            {/* Mode Toggle */}
                            <div className="flex gap-2 p-1 bg-black/30 rounded-xl">
                                <button
                                    onClick={() => { setMode('ground'); }}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                                        mode === 'ground' ? 'bg-[#28A745] text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    🏟️ Pick Ground & Time
                                </button>
                                <button
                                    onClick={() => { setMode('booking'); fetchBookings(); }}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                                        mode === 'booking' ? 'bg-[#28A745] text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    🎟️ From My Booking
                                </button>
                            </div>

                            {mode === 'ground' ? (
                                <>
                                    {/* Ground Select */}
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-2">Select Ground</label>
                                        {groundsLoading ? (
                                            <div className="text-center py-4">
                                                <div className="w-6 h-6 border-2 border-[#28A745] border-t-transparent rounded-full animate-spin mx-auto" />
                                            </div>
                                        ) : grounds.length === 0 ? (
                                            <p className="text-gray-500 text-sm text-center py-4">No grounds available nearby</p>
                                        ) : (
                                            <div className="max-h-32 overflow-y-auto space-y-2 custom-scrollbar">
                                                {grounds.map(g => (
                                                    <div
                                                        key={g._id}
                                                        onClick={() => handleSelectGround(g)}
                                                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                                            selectedGround?._id === g._id
                                                                ? 'border-[#28A745] bg-[#28A745]/10'
                                                                : 'border-white/10 bg-black/20 hover:border-white/30'
                                                        }`}
                                                    >
                                                        <div className="font-medium text-white text-sm">{g.name}</div>
                                                        <div className="text-xs text-gray-400 mt-0.5">📍 {g.address || 'Location'} · ₹{g.pricePerHour}/hr</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Date Picker */}
                                    {selectedGround && (
                                        <div>
                                            <label className="text-xs text-gray-400 block mb-2">Select Date</label>
                                            <input
                                                type="date"
                                                value={selectedDate}
                                                min={today}
                                                onChange={e => setSelectedDate(e.target.value)}
                                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#28A745] outline-none [color-scheme:dark]"
                                            />
                                        </div>
                                    )}

                                    {/* Time Slot Picker */}
                                    {selectedDate && (
                                        <div>
                                            <label className="text-xs text-gray-400 block mb-2">Select Time Slot</label>
                                            {timeSlots.length === 0 ? (
                                                <p className="text-gray-500 text-sm text-center py-3">No available slots for this date</p>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-2">
                                                    {timeSlots.map(slot => (
                                                        <button
                                                            key={slot.id}
                                                            onClick={() => handleSelectSlot(slot)}
                                                            className={`p-2.5 rounded-xl border text-left text-sm transition-all ${
                                                                selectedSlot?.id === slot.id
                                                                    ? 'border-[#28A745] bg-[#28A745]/10 text-white'
                                                                    : 'border-white/10 bg-black/20 text-gray-300 hover:border-white/30'
                                                            }`}
                                                        >
                                                            <div className="font-medium text-xs">{slot.label}</div>
                                                            {slot.priceMod > 0 && (
                                                                <div className="text-[10px] text-[#28A745] mt-0.5">+₹{slot.priceMod}</div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Booking mode (backward compat) */
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-400">Select a pre-booked slot:</p>
                                    {bookings.length === 0 ? (
                                        <div className="text-center py-6 text-gray-500">
                                            <p className="text-3xl mb-2">📅</p>
                                            <p className="text-sm">No upcoming bookings found.</p>
                                            <p className="text-xs text-gray-600 mt-1">Switch to "Pick Ground & Time" to create without a booking.</p>
                                        </div>
                                    ) : (
                                        bookings.map(b => (
                                            <div
                                                key={b._id}
                                                onClick={() => handleSelectBooking(b)}
                                                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                                    form.bookingId === b._id
                                                        ? 'border-[#28A745] bg-[#28A745]/10'
                                                        : 'border-white/10 bg-black/20 hover:border-white/30'
                                                }`}
                                            >
                                                <div className="font-medium text-white text-sm">{b.groundId?.name || 'Ground'}</div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    📅 {new Date(b.slotStart).toLocaleDateString()} &middot;
                                                    ⏰ {new Date(b.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                                                    {new Date(b.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            <button
                                disabled={!canProceedStep1()}
                                onClick={() => setStep(2)}
                                className="w-full mt-2 py-3 rounded-xl font-semibold transition-all bg-[#28A745] hover:bg-[#218838] text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next →
                            </button>
                        </div>
                    )}

                    {/* ════════ STEP 2 — Challenge Details ════════ */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Team Name</label>
                                <input
                                    value={form.teamName}
                                    onChange={e => setForm(prev => ({ ...prev, teamName: e.target.value }))}
                                    placeholder={user?.name + "'s Team"}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#28A745] outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Match Type</label>
                                <div className="flex gap-2">
                                    {matchTypes.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setForm(prev => ({ ...prev, matchType: t }))}
                                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
                                                form.matchType === t
                                                    ? 'border-[#28A745] bg-[#28A745]/20 text-[#28A745]'
                                                    : 'border-white/10 text-gray-400 hover:border-white/30'
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Overs: {form.overs}</label>
                                <input
                                    type="range" min="1" max="50" value={form.overs}
                                    onChange={e => setForm(prev => ({ ...prev, overs: Number(e.target.value) }))}
                                    className="w-full accent-[#28A745]"
                                />
                                <div className="flex justify-between text-xs text-gray-500"><span>1</span><span>50</span></div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Players Required: {form.playersRequired}</label>
                                <input
                                    type="range" min="1" max="22" value={form.playersRequired}
                                    onChange={e => setForm(prev => ({ ...prev, playersRequired: Number(e.target.value) }))}
                                    className="w-full accent-[#28A745]"
                                />
                                <div className="flex justify-between text-xs text-gray-500"><span>1</span><span>22</span></div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Notes (optional)</label>
                                <textarea
                                    value={form.notes}
                                    onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="e.g. Friendly match, competitive tryout…"
                                    rows={2}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#28A745] outline-none resize-none"
                                />
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all">← Back</button>
                                <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl font-semibold bg-[#28A745] hover:bg-[#218838] text-white transition-all">Next →</button>
                            </div>
                        </div>
                    )}

                    {/* ════════ STEP 3 — Review & Publish ════════ */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="bg-black/30 rounded-xl p-4 border border-white/10 space-y-2">
                                {mode === 'ground' && selectedGround && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Ground</span>
                                        <span className="text-white font-medium">{selectedGround.name}</span>
                                    </div>
                                )}
                                {selectedSlot && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Slot</span>
                                        <span className="text-white font-medium">{new Date(form.slotStart).toLocaleDateString()} · {selectedSlot.label}</span>
                                    </div>
                                )}
                                {mode === 'ground' && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Booking</span>
                                        <span className="text-amber-400 font-medium text-xs">Pay after opponent accepts</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Team</span>
                                    <span className="text-white font-medium">{form.teamName || user?.name + "'s Team"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Match Type</span>
                                    <span className="text-[#28A745] font-medium">{form.matchType}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Overs</span>
                                    <span className="text-white font-medium">{form.overs}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Players Required</span>
                                    <span className="text-white font-medium">{form.playersRequired}</span>
                                </div>
                                {form.notes && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Notes</span>
                                        <span className="text-white font-medium italic">"{form.notes}"</span>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            )}

                            <div className="flex gap-2">
                                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all">← Back</button>
                                <button
                                    onClick={handleCreate}
                                    disabled={loading}
                                    className="flex-1 py-3 rounded-xl font-semibold bg-[#28A745] hover:bg-[#218838] text-white transition-all disabled:opacity-40"
                                >
                                    {loading ? 'Publishing…' : '🏏 Publish Challenge'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
