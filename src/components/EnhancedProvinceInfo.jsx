import { useEffect, useState } from "react";
import { provincesData } from "../utils/province-stats";

const EnhancedProvinceInfo = ({ province, position, onClose }) => {
    const [provinceData, setProvinceData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!province) return;

        // In a real application, this would be an API call
        // For now, we'll use our sample data
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const data = provincesData.find(p => p.province === province) || {
                province,
                cases: 0,
                recovered: 0,
                deaths: 0,
                active: 0,
                // You can add more detailed data here when available
            };

            setProvinceData(data);
            setLoading(false);
        }, 500);
    }, [province]);

    if (!province || !position) return null;

    return (
        <div
            className="absolute bg-white rounded-lg shadow-lg p-4 z-20 w-72"
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -100%)',
                marginTop: '-10px'
            }}
        >
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">{province}</h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-blue-100 p-2 rounded">
                            <p className="text-xs text-blue-800">Ca nhiễm</p>
                            <p className="text-lg font-bold text-blue-600">{provinceData.cases}</p>
                        </div>
                        <div className="bg-orange-100 p-2 rounded">
                            <p className="text-xs text-orange-800">Đang điều trị</p>
                            <p className="text-lg font-bold text-orange-600">{provinceData.active}</p>
                        </div>
                        <div className="bg-green-100 p-2 rounded">
                            <p className="text-xs text-green-800">Khỏi bệnh</p>
                            <p className="text-lg font-bold text-green-600">{provinceData.recovered}</p>
                        </div>
                        <div className="bg-red-100 p-2 rounded">
                            <p className="text-xs text-red-800">Tử vong</p>
                            <p className="text-lg font-bold text-red-600">{provinceData.deaths}</p>
                        </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500 border-t pt-2">
                        <span>Tỉ lệ khỏi:</span>
                        <span className="font-medium text-green-600">
                            {provinceData.cases > 0
                                ? `${Math.round((provinceData.recovered / provinceData.cases) * 100)}%`
                                : 'N/A'}
                        </span>
                    </div>

                    <div className="mt-3">
                        <button
                            className="w-full py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
                            onClick={() => {
                                // This would handle the "view details" action
                                // For now, just a placeholder
                                console.log(`View details for ${province}`);
                            }}
                        >
                            Xem chi tiết
                        </button>
                    </div>
                </>
            )}

            <div className="absolute w-4 h-4 bg-white transform rotate-45 left-1/2 -ml-2 -bottom-2"></div>
        </div>
    );
};

export default EnhancedProvinceInfo;