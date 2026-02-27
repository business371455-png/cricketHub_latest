import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendOtp as sendOtpApi, verifyOtpToken } from '../services/authService.js';
import { setCredentials } from '../features/auth/authSlice.js';
import ParticleBackground from '../components/ParticleBackground.jsx';

export default function Login() {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (phone.length >= 10) {
            try {
                const response = await sendOtpApi(phone);
                setStep(2);
                alert(`Mock SMS Sent! Your OTP is: ${response.mockOtp}`);
            } catch (err) {
                console.error('Failed to send OTP', err);
                alert('Failed to send OTP. Try again.');
            }
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const userData = await verifyOtpToken(phone, otp);
            dispatch(setCredentials({ user: userData, token: userData.token }));

            // Save token to localStorage for axios interceptor
            localStorage.setItem('token', userData.token);

            if (userData.isNewUser) {
                navigate('/profile-setup');
            } else {
                navigate('/home');
            }
        } catch (err) {
            console.error('OTP Verification Error', err);
            alert('Invalid OTP. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center relative px-4">
            <ParticleBackground />
            <div className="bg-[#1E293B] p-8 rounded-2xl shadow-2xl z-10 w-full max-w-md border border-[#ffffff10]">
                <div className="text-center mb-8">
                    <span className="text-5xl block mb-4">🏏</span>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Cricket Connect</h1>
                    <p className="text-gray-400 mt-2">The Digital Pavilion 2.0</p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="text-sm text-gray-400 block mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-[#0F172A] border border-[#ffffff20] text-white px-4 py-3 rounded-xl focus:border-[#28A745] focus:outline-none transition-colors"
                                placeholder="+91 99999 99999"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-[#28A745] text-white hover:bg-[#218838] transition-colors py-3 rounded-xl font-semibold shadow-lg shadow-[#28A745]/30">
                            Send OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div>
                            <label className="text-sm text-gray-400 block mb-2">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-[#0F172A] border border-[#ffffff20] text-white px-4 py-3 rounded-xl text-center text-2xl tracking-widest focus:border-[#28A745] focus:outline-none transition-colors"
                                placeholder="••••••"
                                maxLength={6}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-[#28A745] text-white hover:bg-[#218838] transition-colors py-3 rounded-xl font-semibold shadow-lg shadow-[#28A745]/30">
                            Verify & Enter
                        </button>
                        <button type="button" onClick={() => setStep(1)} className="w-full text-gray-400 text-sm hover:text-white transition-colors">
                            Back to Phone
                        </button>
                    </form>
                )}
            </div>
            <div id="recaptcha-container"></div>
        </div>
    );
}
