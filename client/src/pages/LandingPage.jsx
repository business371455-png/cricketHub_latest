import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function LandingPage() {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        // Hero animations
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo('.hero-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
            .fromTo('.hero-subtitle', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')
            .fromTo('.hero-btn', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3');

        // Cards animation on scroll
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(entry.target,
                            { y: 50, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }
                        );
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        cardsRef.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    const features = [
        {
            icon: '👥',
            title: 'Join a Team',
            desc: 'Browse active teams looking for players and join the squad that fits your style.',
        },
        {
            icon: '⚔️',
            title: 'Form a Team',
            desc: 'Build your dream 11. Be the captain, recruit players, and challenge others.',
        },
        {
            icon: '🏟️',
            title: 'Play Matches',
            desc: 'Book grounds, select your ball type, and schedule matches instantly.',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0a1628] text-white font-sans overflow-x-hidden">
            {/* ───── NAVBAR ───── */}
            <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-3 sm:py-4 bg-[#0a1628]/80 backdrop-blur-md border-b border-white/5">
                <div
                    className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <span className="text-[#28A745]">CricketHub</span>
                    <span className="text-xl sm:text-2xl">🏏</span>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    className="px-4 sm:px-5 py-2 rounded-full border border-[#28A745] text-[#28A745] text-xs sm:text-sm font-semibold hover:bg-[#28A745] hover:text-white active:scale-95 transition-all duration-300 cursor-pointer"
                >
                    Log In
                </button>
            </nav>

            {/* ───── HERO ───── */}
            <section
                ref={heroRef}
                className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-16"
                style={{ minHeight: '70vh' }}
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="/cricket-hero-bg.png"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,22,40,0.80) 0%, rgba(10,22,40,0.55) 40%, rgba(10,22,40,0.95) 100%)' }} />
                </div>

                <div className="relative z-10 w-full max-w-5xl mx-auto px-2 sm:px-4" style={{ background: 'radial-gradient(ellipse at center, rgba(10,22,40,0.6) 0%, transparent 70%)', padding: '20px' }}>
                    <h1
                        className="hero-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight md:whitespace-nowrap"
                        style={{ color: '#ffffff', textShadow: '0 0 30px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.6)' }}
                    >
                        Play. Compete. Conquer.
                    </h1>
                    <p
                        className="hero-subtitle mt-4 sm:mt-6 text-sm sm:text-base md:text-lg mx-auto leading-relaxed md:whitespace-nowrap"
                        style={{ color: '#e2e8f0', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                    >
                        The ultimate platform to find teams, schedule matches, and dominate the pitch.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="hero-btn mt-6 sm:mt-10 inline-block px-8 sm:px-10 py-3 sm:py-4 rounded-lg bg-[#28A745] text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-[#28A745]/30 hover:shadow-[#28A745]/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                    >
                        Get Started
                    </button>
                </div>
            </section>

            {/* ───── HOW IT WORKS ───── */}
            <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628] pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
                        How It Works
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                ref={(el) => (cardsRef.current[i] = el)}
                                className="group bg-[#121f36] border border-white/5 rounded-2xl p-6 sm:p-8 text-center hover:border-[#28A745]/40 hover:shadow-lg hover:shadow-[#28A745]/10 active:scale-[0.98] transition-all duration-300"
                            >
                                <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">{f.icon}</div>
                                <h3 className="text-lg sm:text-xl font-semibold text-[#28A745] mb-2 sm:mb-3">
                                    {f.title}
                                </h3>
                                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── FOOTER ───── */}
            <footer className="border-t border-white/5 py-6 sm:py-8 text-center text-gray-500 text-xs sm:text-sm px-4">
                © {new Date().getFullYear()} Cricket Match Hub. All rights reserved.
            </footer>
        </div>
    );
}
