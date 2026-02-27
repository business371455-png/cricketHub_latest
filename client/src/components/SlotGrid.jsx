import { useState } from 'react';

const HOURS = Array.from({ length: 14 }, (_, i) => i + 6); // 6 AM to 7 PM

export default function SlotGrid({ slots = [], onSlotSelect, selectedDate }) {
    const [selected, setSelected] = useState(null);

    const getSlotStatus = (hour) => {
        const slot = slots.find(s => {
            const slotHour = new Date(s.startTime).getHours();
            return slotHour === hour;
        });
        return slot?.status || 'Available';
    };

    const getSlotColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30';
            case 'Booked':
            case 'Reserved': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 cursor-not-allowed';
            case 'Blocked': return 'bg-red-500/20 text-red-400 border-red-500/30 cursor-not-allowed';
            default: return 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30';
        }
    };

    const handleClick = (hour) => {
        const status = getSlotStatus(hour);
        if (status !== 'Available') return;
        setSelected(hour);
        onSlotSelect?.({
            hour,
            startTime: `${selectedDate}T${hour.toString().padStart(2, '0')}:00:00`,
            endTime: `${selectedDate}T${(hour + 1).toString().padStart(2, '0')}:00:00`,
        });
    };

    return (
        <div>
            {/* Legend */}
            <div className="flex gap-4 mb-4 text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-green-500/40" />
                    <span className="text-gray-400">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-yellow-500/40" />
                    <span className="text-gray-400">Reserved</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-red-500/40" />
                    <span className="text-gray-400">Blocked</span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {HOURS.map(hour => {
                    const status = getSlotStatus(hour);
                    const isSelected = selected === hour;
                    const timeLabel = `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;

                    return (
                        <button
                            key={hour}
                            onClick={() => handleClick(hour)}
                            disabled={status !== 'Available'}
                            className={`p-3 rounded-xl text-sm font-medium transition-all border ${getSlotColor(status)} ${isSelected ? 'ring-2 ring-[#28A745] ring-offset-2 ring-offset-[#0F172A]' : ''}`}
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
