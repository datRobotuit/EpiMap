// import { Select, Typography } from 'antd';
// import { useState } from 'react';
// import { dailyCases, nationalStats } from '../../utils/province-stats';
// import renderColumnChart from './renderColumnChart';
// import renderLineChart from './renderLineChart';

// const { Title, Text } = Typography;


// export default function renderOverviewTab() {
    
//     let filteredStats = { ...nationalStats };
//     let filteredDailyCases = [...dailyCases];
//     const [diseaseFilter, setDiseaseFilter] = useState("all");

//     // Options for disease filter
//     const diseaseOptions = [
//         { value: "all", label: "Tất cả" },
//         { value: "covid19", label: "COVID-19" },
//         { value: "dengue", label: "Sốt xuất huyết" },
//         { value: "influenza", label: "Cúm mùa" },
//     ];

//     // Simulating different data for different disease types
//     if (diseaseFilter !== "all") {
//         // Modify the stats based on the selected disease
//         const multiplier = {
//             "covid19": 0.2,  // Using the current data for COVID-19
//             "dengue": 0.5,   // 60% of COVID-19 cases for Dengue
//             "influenza": 0.3 // 80% of COVID-19 cases for Influenza
//         }[diseaseFilter] || 1.0;

//         filteredStats = {
//             ...nationalStats,
//             totalCases: Math.floor(nationalStats.totalCases * multiplier),
//             activeCases: Math.floor(nationalStats.activeCases * multiplier),
//             recovered: Math.floor(nationalStats.recovered * multiplier),
//             deaths: Math.floor(nationalStats.deaths * multiplier),
//             vaccinated: {
//                 firstDose: nationalStats.vaccinated.firstDose * multiplier,
//                 secondDose: nationalStats.vaccinated.secondDose * multiplier,
//                 booster: nationalStats.vaccinated.booster * multiplier,
//             }
//         };

//         // Modify the daily cases data
//         filteredDailyCases = dailyCases.map(day => ({
//             ...day,
//             cases: Math.floor(day.cases * multiplier)
//         }));
//     }

//     // Format data for charts
//     const dailyCasesData = filteredDailyCases.map(d => ({
//         date: d.date.substring(5), // Only show MM-DD
//         cases: d.cases
//     }));

//     const vaccinationData = [
//         { category: "Mũi 1", value: filteredStats.vaccinated.firstDose / 1000000 },
//         { category: "Mũi 2", value: filteredStats.vaccinated.secondDose / 1000000 },
//         { category: "Mũi bổ sung", value: filteredStats.vaccinated.booster / 1000000 }
//     ];

//     const selectedDiseaseName = diseaseFilter !== "all"
//         ? diseaseOptions.find(opt => opt.value === diseaseFilter)?.label
//         : null;

//     return (
//         <div className="p-5">
//             <div className="flex justify-between items-center mb-5">
//                 <div>
//                     <Title level={4} style={{ margin: 0 }}>Tổng quan dịch bệnh</Title>
//                     {selectedDiseaseName && (
//                         <span className="text-sm text-blue-500 font-medium">
//                             Đang xem: {selectedDiseaseName}
//                         </span>
//                     )}
//                 </div>
//                 <Select
//                     value={diseaseFilter}
//                     onChange={setDiseaseFilter}
//                     options={diseaseOptions}
//                     style={{ width: 160 }}
//                     placeholder="Chọn loại bệnh"
//                     dropdownStyle={{ borderRadius: '8px' }}
//                     className="hover:shadow-md transition-shadow"
//                 />
//             </div>

//             <div className="grid grid-cols-2 gap-4 mb-6">
//                 <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-200">
//                     <div className="flex justify-between">
//                         <Text className="text-xs text-blue-700 font-medium">Tổng ca nhiễm</Text>
//                         <div className="bg-blue-500 p-1 rounded-full">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                             </svg>
//                         </div>
//                     </div>
//                     <p className="text-xl font-bold text-blue-600 mt-1">{filteredStats.totalCases.toLocaleString()}</p>
//                 </div>
//                 <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-orange-200">
//                     <div className="flex justify-between">
//                         <Text className="text-xs text-orange-700 font-medium">Ca đang điều trị</Text>
//                         <div className="bg-orange-500 p-1 rounded-full">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12M8 17h12M3 7l1 1M3 12l1 1M3 17l1 1" />
//                             </svg>
//                         </div>
//                     </div>
//                     <p className="text-xl font-bold text-orange-600 mt-1">{filteredStats.activeCases.toLocaleString()}</p>
//                 </div>
//                 <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-green-200">
//                     <div className="flex justify-between">
//                         <Text className="text-xs text-green-700 font-medium">Khỏi bệnh</Text>
//                         <div className="bg-green-500 p-1 rounded-full">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                         </div>
//                     </div>
//                     <p className="text-xl font-bold text-green-600 mt-1">{filteredStats.recovered.toLocaleString()}</p>
//                 </div>
//                 <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-red-200">
//                     <div className="flex justify-between">
//                         <Text className="text-xs text-red-700 font-medium">Tử vong</Text>
//                         <div className="bg-red-500 p-1 rounded-full">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </div>
//                     </div>
//                     <p className="text-xl font-bold text-red-600 mt-1">{filteredStats.deaths.toLocaleString()}</p>
//                 </div>
//             </div>

//             <div className="mb-6 bg-white/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
//                 <div className="flex items-center mb-3">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
//                     </svg>
//                     <Title level={5} style={{ margin: 0 }}>Số ca nhiễm theo ngày {selectedDiseaseName && `- ${selectedDiseaseName}`}</Title>
//                 </div>
//                 <div className="bg-white rounded-lg overflow-hidden">
//                     {renderLineChart(dailyCasesData, 'date', 'cases', 'Diễn biến ca nhiễm')}
//                 </div>
//             </div>

//             <div className="mb-6 bg-white/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
//                 <div className="flex items-center mb-3">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//                     </svg>
//                     <Title level={5} style={{ margin: 0 }}>Tình trạng tiêm chủng {selectedDiseaseName && `- ${selectedDiseaseName}`}</Title>
//                 </div>
//                 <div className="bg-white rounded-lg overflow-hidden">
//                     {renderColumnChart(
//                         vaccinationData,
//                         'category',
//                         'value',
//                         'Tình trạng tiêm chủng (triệu người)',
//                         ['#3b82f6', '#10b981', '#6366f1']
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };