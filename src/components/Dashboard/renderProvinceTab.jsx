import { Typography } from 'antd';
import { provincesData } from '../../utils/province-stats';
import renderColumnChart from './renderColumnChart';
import renderPieChart from './renderPieChart';
import { useEffect, useState } from 'react';
import { fetchTopAffectedAreas } from '../../services/apiService';
const { Title } = Typography;


export default function renderProvincesTab (diseaseFilter) {



    // Format data for charts
    const top5Provinces = provincesData;

    const provinceCasesData = top5Provinces.map(province => ({
        province: province.Province,
        cases: province.TotalInfections
    }));

    const provinceActiveData = top5Provinces.map(province => ({
        province: province.Province,
        active: province.TotalInfections
    }));

    return (
        <div className="p-5">
            <div className="flex items-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <Title level={4} style={{ margin: 0 }}>Theo tỉnh/thành phố</Title>
            </div>

            <div className="mb-6 bg-white/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <Title level={5} style={{ margin: 0 }}>Các tỉnh có số ca nhiễm cao nhất</Title>
                </div>
                <div className="bg-white rounded-lg overflow-hidden">
                    {renderColumnChart(
                        provinceCasesData,
                        'province',
                        'cases',
                        'Số ca nhiễm theo tỉnh/thành',
                        ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef']
                    )}
                </div>
            </div>

            <div className="mb-6 bg-white/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    <Title level={5} style={{ margin: 0 }}>Tỷ lệ ca đang điều trị</Title>
                </div>
                <div className="bg-white rounded-lg overflow-hidden">
                    {renderPieChart(
                        provinceActiveData,
                        'active',
                        'province',
                        'Tỷ lệ ca đang điều trị',
                        ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef']
                    )}
                </div>
            </div>

            <div className="bg-white/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        <Title level={5} style={{ margin: 0 }}>Dữ liệu chi tiết theo tỉnh</Title>
                    </div>
                    <div className="text-xs text-blue-500 cursor-pointer hover:underline">
                        Xem tất cả
                    </div>
                </div>
                <div className="overflow-auto max-h-64 rounded-lg">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Tỉnh/Thành</th>
                                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Ca nhiễm</th>
                                <th className="py-2 px-3 text-left text-xs font-medium text-orange-500 uppercase tracking-wider border-b">Đang điều trị</th>
                                <th className="py-2 px-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider border-b">Khỏi bệnh</th>
                                <th className="py-2 px-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider border-b">Tử vong</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {provincesData.map((province, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-white hover:bg-blue-50 transition-colors" : "bg-gray-50 hover:bg-blue-50 transition-colors"}>
                                    <td className="py-2 px-3 text-sm font-medium text-gray-900">{province.Province}</td>
                                    <td className="py-2 px-3 text-sm text-gray-700">{province.TotalInfections.toLocaleString()}</td>
                                    <td className="py-2 px-3 text-sm text-orange-500 font-medium">{province.TotalTreatment.toLocaleString()}</td>
                                    <td className="py-2 px-3 text-sm text-green-500 font-medium">{province.TotalRecover.toLocaleString()}</td>
                                    <td className="py-2 px-3 text-sm text-red-500 font-medium">{province.TotalDeath.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
