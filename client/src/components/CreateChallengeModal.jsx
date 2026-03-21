import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useSelector } from 'react-redux';
import * as challengeService from '../services/challengeService.js';
import * as bookingService from '../services/bookingService.js';

const matchTypes = ['Tennis', 'Leather', 'Box'];

export default function CreateChallengeModal({ isOpen, onClose, onCreated }) {
    const { user } = useSelector(state => state.auth);
    const overlayRef = useRef(null);
    const panelRef = useRef(null);
    const [step, setStep] = useState(1);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        bookingId: '',
        groundId: '',
        teamName: '',
        matchType: 'Tennis',
        overs: 10,
        playersRequired: 11,
        notes: '',
    });

    // Load user's bookings on open
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setError('');
            fetchBookings();
        }
    }, [isOpen]);

    // GSAP entrance animation
    useEffect(() => {
        if (isOpen && overlayRef.current && panelRef.current) {
            gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
            gsap.fromTo(panelRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
        }
    }, [isOpen]);

    const fetchBookings = async () => {
        try {
            const data = await bookingService.getMyBookings();
            // Only show future, paid bookings
            const future = data.filter(b => new Date(b.slotStart) > new Date());
            setBookings(future);
        } catch {
            setBookings([]);
        }
    };

    const selectBooking = (booking) => {
        setForm(prev => ({
            ...prev,
            bookingId: booking._id,
            groundId: booking.groundId?._id || booking.groundId,
        }));
    };

    const handleCreate = async () => {
        setLoading(true);
        setError('');
        try {
            await challengeService.createChallenge({
                ...form,
                teamName: form.teamName || user?.name + "'s Team",
            });
            onCreated?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create challenge');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div ref={overlayRef} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div ref={panelRef} className="bg-[#1E293B] rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-lg font-bold text-white">
                        {step === 1 ? '🎟️ Select Booking' : step === 2 ? '🏏 Challenge Details' : '✅ Review & Publish'}
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
                    {/* STEP 1 — Select Booking */}
                    {step === 1 && (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-400 mb-3">Select a pre-booked slot to open for a challenge:</p>
                            {bookings.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p className="text-3xl mb-2">📅</p>
                                    <p className="text-sm">No upcoming bookings found.</p>
                                    <p className="text-xs text-gray-600 mt-1">Book a ground slot first, then create a challenge.</p>
                                </div>
                            ) : (
                                bookings.map(b => (
                                    <div
                                        key={b._id}
                                        onClick={() => selectBooking(b)}
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
                            <button
                                disabled={!form.bookingId}
                                onClick={() => setStep(2)}
                                className="w-full mt-4 py-3 rounded-xl font-semibold transition-all bg-[#28A745] hover:bg-[#218838] text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next →
                            </button>
                        </div>
                    )}

                    {/* STEP 2 — Challenge Details */}
                    {step === 2 && (
                        <div className="space-y-4">
                            {/* Team Name */}
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Team Name</label>
                                <input
                                    value={form.teamName}
                                    onChange={e => setForm(prev => ({ ...prev, teamName: e.target.value }))}
                                    placeholder={user?.name + "'s Team"}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#28A745] outline-none"
                                />
                            </div>

                            {/* Match Type */}
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

                            {/* Overs */}
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Overs: {form.overs}</label>
                                <input
                                    type="range" min="1" max="50" value={form.overs}
                                    onChange={e => setForm(prev => ({ ...prev, overs: Number(e.target.value) }))}
                                    className="w-full accent-[#28A745]"
                                />
                                <div className="flex justify-between text-xs text-gray-500"><span>1</span><span>50</span></div>
                            </div>

                            {/* Players Required */}
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Players Required: {form.playersRequired}</label>
                                <input
                                    type="range" min="1" max="22" value={form.playersRequired}
                                    onChange={e => setForm(prev => ({ ...prev, playersRequired: Number(e.target.value) }))}
                                    className="w-full accent-[#28A745]"
                                />
                                <div className="flex justify-between text-xs text-gray-500"><span>1</span><span>22</span></div>
                            </div>

                            {/* Notes */}
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

                    {/* STEP 3 — Review & Publish */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="bg-black/30 rounded-xl p-4 border border-white/10 space-y-2">
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
