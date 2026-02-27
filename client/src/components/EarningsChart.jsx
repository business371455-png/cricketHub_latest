import { useState, useEffect } from 'react';
import * as earningsService from '../services/earningsService.js';

export default function EarningsChart() {
    const [earnings, setEarnings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('monthly');

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const data = await earningsService.getEarningsSummary();
                setEarnings(data);
            } catch (err) {
                console.error('Failed to fetch earnings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEarnings();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#ffffff10] animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-4" />
                <div className="h-32 bg-gray-700/50 rounded-xl" />
            </div>
        );
    }

    const periods = ['daily', 'weekly', 'monthly'];
    const currentAmount =
        period === 'daily' ? (earnings?.daily || 0) :
            period === 'weekly' ? (earnings?.weekly || 0) :
                (earnings?.monthly || 0);

    return (
        <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#ffffff10]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-lg">📊 Earnings</h3>
                <div className="flex gap-1 bg-[#0F172A] rounded-xl p-1">
                    {periods.map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${period === p
                                ? 'bg-[#28A745] text-white'
                                : 'text-gray-400 hover:text-white'}`}
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Revenue Display */}
            <div className="text-center py-6 bg-[#0F172A] rounded-xl border border-[#ffffff05] mb-4">
                <p className="text-sm text-gray-400 font-medium mb-1">{period.charAt(0).toUpperCase() + period.slice(1)} Revenue</p>
                <p className="text-4xl font-bold text-[#28A745]">₹{currentAmount.toLocaleString()}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#0F172A] p-3 rounded-xl border border-[#ffffff05] text-center">
                    <p className="text-xs text-gray-500 mb-1">Daily</p>
                    <p className="text-sm font-bold text-white">₹{(earnings?.daily || 0).toLocaleString()}</p>
                </div>
                <div className="bg-[#0F172A] p-3 rounded-xl border border-[#ffffff05] text-center">
                    <p className="text-xs text-gray-500 mb-1">Weekly</p>
                    <p className="text-sm font-bold text-white">₹{(earnings?.weekly || 0).toLocaleString()}</p>
                </div>
                <div className="bg-[#0F172A] p-3 rounded-xl border border-[#ffffff05] text-center">
                    <p className="text-xs text-gray-500 mb-1">Total Bookings</p>
                    <p className="text-sm font-bold text-white">{earnings?.totalBookings || 0}</p>
                </div>
            </div>
        </div>
    );
}
