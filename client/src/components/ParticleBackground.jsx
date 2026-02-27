import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ParticleBackground() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        for (let i = 0; i < 20; i++) {
            const div = document.createElement('div');
            div.className = 'absolute inline-block w-2 h-2 rounded-full bg-[#28A745]/30 z-0';
            div.style.left = `${Math.random() * 100}%`;
            div.style.top = `${Math.random() * 100}%`;
            container.appendChild(div);

            gsap.to(div, {
                y: `+=${Math.random() * 100 - 50}`,
                x: `+=${Math.random() * 100 - 50}`,
                opacity: 0,
                duration: Math.random() * 3 + 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 2,
            });
        }

        return () => {
            container.innerHTML = '';
        };
    }, []);

    return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
}
