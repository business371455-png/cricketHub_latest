import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGround } from '../services/groundService.js';

export default function AddGroundForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        pricePerHour: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await createGround({
                name: formData.name,
                address: formData.location,
                location: {
                    type: 'Point',
                    coordinates: [0, 0], // Default — will be updated with real GPS later
                },
                pricePerHour: Number(formData.pricePerHour),
                amenities: ['Floodlights', 'Pavilion'] // default for MVP
            });
            alert('Ground Added Successfully!');
            navigate('/owner');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to add ground');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] p-4 lg:p-8 pb-24">
            <div className="max-w-xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="text-gray-400 p-2 rounded-full hover:bg-white/5 transition-colors">
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Add New Ground</h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#1E293B] rounded-3xl p-6 lg:p-8 shadow-2xl border border-[#ffffff10] space-y-6">

                    <div className="h-40 border-2 border-dashed border-[#28A745]/50 bg-[#0F172A] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                        <span className="text-4xl mb-2">📸</span>
                        <span className="text-gray-400 text-sm">Tap to upload ground images</span>
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 block mb-2">Ground Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[#0F172A] border border-[#ffffff20] text-white px-4 py-3 rounded-xl focus:border-[#28A745] focus:outline-none transition-colors"
                            placeholder="e.g. Lords Practice Nets"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 block mb-2">Location/Address</label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-[#0F172A] border border-[#ffffff20] text-white px-4 py-3 rounded-xl focus:border-[#28A745] focus:outline-none transition-colors"
                            placeholder="e.g. Sector 5, Salt Lake"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 block mb-2">Price Per Hour (₹)</label>
                        <input
                            type="number"
                            required
                            value={formData.pricePerHour}
                            onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                            className="w-full bg-[#0F172A] border border-[#ffffff20] text-white px-4 py-3 rounded-xl focus:border-[#28A745] focus:outline-none transition-colors"
                            placeholder="1500"
                        />
                    </div>

                    <button type="submit" className="w-full bg-[#28A745] text-white py-4 rounded-xl font-bold mt-8 shadow-lg shadow-[#28A745]/30 hover:bg-[#218838] transition-all active:scale-[0.98]">
                        Publish Ground
                    </button>
                </form>
            </div>
        </div>
    );
}
