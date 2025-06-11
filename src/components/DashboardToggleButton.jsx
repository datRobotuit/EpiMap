const DashboardToggleButton = ({ isOpen, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`fixed right-0 top-4 z-20 bg-black shadow-md rounded-l-md p-2 hover:bg-gray-100 transition-all duration-300 ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
            aria-label="Mở bảng điều khiển"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );
};

export default DashboardToggleButton;
