import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomTabNav from './BottomTabNav';
import FAB from './FAB';
import CreateMatchModal from '../CreateMatchModal.jsx';

const AppLayout = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div className="flex h-screen bg-surface text-text overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 border-r border-[#1E293B] bg-[#0F172A] z-10">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto pb-16 lg:pb-0 relative bg-[#0F172A]">
                <header className="sticky top-0 z-10 bg-[#0F172A]/80 backdrop-blur-md p-4 border-b border-[#1E293B] hidden lg:block">
                    <h1 className="text-xl font-bold text-primary">Cricket Connect</h1>
                </header>

                <main className="min-h-full">
                    <Outlet />
                </main>

                <FAB onClick={() => setModalOpen(true)} />
            </div>

            <CreateMatchModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

            {/* Mobile Bottom Tab Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
                <BottomTabNav />
            </div>
        </div>
    );
};

export default AppLayout;
