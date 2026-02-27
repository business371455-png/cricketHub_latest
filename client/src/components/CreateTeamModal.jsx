import { useState } from 'react';
import { useSelector } from 'react-redux';
import * as teamService from '../services/teamService.js';

export default function CreateTeamModal({ isOpen, onClose, onTeamCreated }) {
    const { user } = useSelector(state => state.auth);
    const [step, setStep] = useState(1);
    const [teamName, setTeamName] = useState('');
    const [matchType, setMatchType] = useState('');
    const [maxSize, setMaxSize] = useState(11);
    const [whatsappLink, setWhatsappLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const matchTypes = ['Tennis', 'Leather', 'Box'];

    const handleNext = () => {
        if (step === 1 && !teamName.trim()) {
            setError('Team name is required');
            return;
        }
        if (step === 2 && !matchType) {
            setError('Select a match type');
            return;
        }
        setError('');
        setStep(step + 1);
    };

    const handleBack = () => {
        setError('');
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            const newTeam = await teamService.createTeam({
                name: teamName.trim(),
                matchType,
                maxSize,
                whatsappLink: whatsappLink.trim(),
            });
            onTeamCreated?.(newTeam);
            // Reset form
            setStep(1);
            setTeamName('');
            setMatchType('');
            setMaxSize(11);
            setWhatsappLink('');
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create team');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
            <div className="bg-[#1E293B] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto border border-[#ffffff10]">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Create Team</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>

                {/* Step Indicator */}
                <div className="flex gap-2 mb-6">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-[#28A745]' : 'bg-gray-700'}`} />
                    ))}
                </div>

                {/* Error */}
                {error && <div className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 border border-red-500/30">{error}</div>}

                {/* Step 1 — Team Name */}
                {step === 1 && (
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Team Name</label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="e.g. Thunder XI"
                            className="w-full bg-[#0F172A] text-white border border-[#ffffff10] rounded-xl px-4 py-3 focus:outline-none focus:border-[#28A745] transition-colors"
                            maxLength={50}
                        />
                    </div>
                )}

                {/* Step 2 — Match Type */}
                {step === 2 && (
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-3">Match Type</label>
                        <div className="flex gap-3">
                            {matchTypes.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setMatchType(type)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${matchType === type
                                        ? 'bg-[#28A745] text-white border-[#28A745] shadow-lg shadow-[#28A745]/30'
                                        : 'bg-[#0F172A] text-gray-300 border-[#ffffff10] hover:border-[#28A745]/50'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3 — Players & WhatsApp */}
                {step === 3 && (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Max Players: <span className="text-[#28A745] font-bold">{maxSize}</span>
                            </label>
                            <input
                                type="range"
                                min={2}
                                max={22}
                                value={maxSize}
                                onChange={(e) => setMaxSize(Number(e.target.value))}
                                className="w-full accent-[#28A745]"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>2</span>
                                <span>11</span>
                                <span>22</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">WhatsApp Group Link (optional)</label>
                            <input
                                type="url"
                                value={whatsappLink}
                                onChange={(e) => setWhatsappLink(e.target.value)}
                                placeholder="https://chat.whatsapp.com/..."
                                className="w-full bg-[#0F172A] text-white border border-[#ffffff10] rounded-xl px-4 py-3 focus:outline-none focus:border-[#28A745] transition-colors"
                            />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-8">
                    {step > 1 && (
                        <button
                            onClick={handleBack}
                            className="flex-1 py-3 rounded-xl text-gray-300 border border-[#ffffff10] hover:bg-[#ffffff05] transition-colors font-medium"
                        >
                            Back
                        </button>
                    )}
                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            className="flex-1 py-3 rounded-xl bg-[#28A745] text-white font-bold hover:bg-[#218838] active:scale-[0.98] transition-all shadow-lg shadow-[#28A745]/30"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 py-3 rounded-xl bg-[#28A745] text-white font-bold hover:bg-[#218838] active:scale-[0.98] transition-all shadow-lg shadow-[#28A745]/30 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Team'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
