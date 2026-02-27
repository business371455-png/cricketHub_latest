export default function MyBookings() {
    return (
        <div className="p-4 lg:p-8 pb-24 min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-6">My Bookings</h1>
            <div className="bg-[#1E293B] rounded-2xl p-5 shadow-xl border border-[#ffffff10] mb-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-white">Eden Gardens Arena</h3>
                        <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">📍 Downtown, Sector 4</p>
                    </div>
                    <span className="bg-[#28A745]/20 text-[#28A745] px-3 py-1 rounded-full text-xs font-bold border border-[#28A745]/30 shadow-sm shadow-[#28A745]/10">Confirmed</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mt-4 pt-4 border-t border-[#ffffff05]">
                    <div className="flex items-center gap-1">📅 Oct 25, 2023</div>
                    <div className="flex items-center gap-1">⏰ 06:00 PM - 08:00 PM</div>
                    <div className="ml-auto font-bold text-white text-lg">₹1700</div>
                </div>
            </div>
        </div>
    );
}
