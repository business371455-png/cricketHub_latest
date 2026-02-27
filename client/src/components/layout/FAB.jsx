const FAB = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-20 lg:bottom-10 right-4 lg:right-10 bg-[#28A745] text-white w-14 h-14 rounded-full shadow-lg shadow-[#28A745]/30 flex items-center justify-center text-3xl font-light hover:scale-105 active:scale-95 transition-transform z-40"
            aria-label="Create Match"
            title="Create Match"
        >
            +
        </button>
    );
};

export default FAB;
