import { useState } from 'react';

const HOURS = Array.from({ length: 14 }, (_, i) => i + 6); // 6 AM to 7 PM

export default function SlotManager({ slots = [], onSlotToggle }) {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const getSlotStatus = (hour) => {
        const slot = slots.find(s => {
            const slotDate = new Date(s.startTime).toISOString().split('T')[0];
            const slotHour = new Date(s.startTime).getHours();
            return slotDate === selectedDate && slotHour === hour;
        });
        return slot?.status || 'Available';
    };

    const handleToggle = (hour) => {
        const currentStatus = getSlotStatus(hour);
        const newStatus = currentStatus === 'Blocked' ? 'Available' : 'Blocked';
        onSlotToggle?.({
            date: selectedDate,
            hour,
            startTime: `${selectedDate}T${hour.toString().padStart(2, '0')}:00:00`,
            endTime: `${selectedDate}T${(hour + 1).toString().padStart(2, '0')}:00:00`,
            status: newStatus,
        });
    };

    const getSlotStyle = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Booked':
            case 'Reserved': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Blocked': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-green-500/20 text-green-400 border-green-500/30';
        }
    };

    return (
        <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#ffffff10]">
            <h3 className="text-white font-bold text-lg mb-4">📅 Slot Manager</h3>

            {/* Date Picker */}
            <div className="mb-4">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-[#0F172A] text-white border border-[#ffffff10] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#28A745]"
                />
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-4 text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-green-500/40" />
                    <span className="text-gray-400">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-yellow-500/40" />
                    <span className="text-gray-400">Booked</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-red-500/40" />
                    <span className="text-gray-400">Blocked</span>
                </div>
            </div>

            <p className="text-xs text-gray-500 mb-3">Tap to block/unblock slots. Booked slots cannot be changed.</p>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {HOURS.map(hour => {
                    const status = getSlotStatus(hour);
                    const timeLabel = `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
                    const isBooked = status === 'Booked' || status === 'Reserved';

                    return (
                        <button
                            key={hour}
                            onClick={() => !isBooked && handleToggle(hour)}
                            disabled={isBooked}
                            className={`p-3 rounded-xl text-sm font-medium transition-all border ${getSlotStyle(status)} ${!isBooked ? 'hover:opacity-80 active:scale-[0.98]' : 'cursor-not-allowed'}`}
                        >
                            <span className="block">{timeLabel}</span>
                            <span className="block text-xs mt-0.5 opacity-75">{status}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
