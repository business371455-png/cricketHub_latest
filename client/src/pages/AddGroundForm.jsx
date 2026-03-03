import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGround } from '../services/groundService.js';
import { uploadImage } from '../services/uploadService.js';

const GROUND_TYPES = ['Open Ground', 'Net Practice', 'Box Cricket', 'Turf Ground', 'Stadium', 'Indoor'];

export default function AddGroundForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        groundType: 'Open Ground',
        location: '',
        pricePerHour: ''
    });
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);
            const result = await uploadImage(formData);
            setImages([result.url]);
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await createGround({
                name: formData.name,
                groundType: formData.groundType,
                address: formData.location,
                location: {
                    type: 'Point',
                    coordinates: [0, 0],
                },
                pricePerHour: Number(formData.pricePerHour),
                amenities: ['Floodlights', 'Pavilion'],
                images: images
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

                    <div
                        onClick={() => !uploading && fileInputRef.current.click()}
                        className="h-48 border-2 border-dashed border-[#28A745]/30 bg-[#0F172A] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all overflow-hidden relative group"
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 border-2 border-[#28A745] border-t-transparent rounded-full animate-spin mb-2"></div>
                                <span className="text-gray-400 text-sm">Uploading...</span>
                            </div>
                        ) : images.length > 0 ? (
                            <>
                                <img src={images[0]} alt="Ground" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-sm font-medium">Change Photo</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="text-4xl mb-2">📸</span>
                                <span className="text-gray-400 text-sm">Tap to upload ground images</span>
                            </>
                        )}
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                        className="hidden"
                    />

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

                    {/* Ground Type Selector */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-3">Ground Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            {GROUND_TYPES.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, groundType: type })}
                                    className={`py-2.5 px-2 rounded-xl text-xs font-medium transition-all border ${formData.groundType === type
                                        ? 'bg-[#28A745] text-white border-[#28A745] shadow-lg shadow-[#28A745]/30'
                                        : 'bg-[#0F172A] text-gray-300 border-[#ffffff10] hover:border-[#28A745]/50'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 block mb-2">Location/Address</label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-[#0F172A] border border-[#ffffff20] text-white px-4 py-3 rounded-xl focus:border-[#28A745] focus:outline-none transition-colors"
                            placeholder="e.g. Bhankrota, Jaipur"
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

                    <button type="submit" disabled={loading} className="w-full bg-[#28A745] text-white py-4 rounded-xl font-bold mt-8 shadow-lg shadow-[#28A745]/30 hover:bg-[#218838] transition-all active:scale-[0.98] disabled:opacity-50">
                        {loading ? 'Publishing...' : 'Publish Ground'}
                    </button>
                </form>
            </div>
        </div>
    );
}
