import { Alert, Select, Spin, Tabs, Typography } from 'antd';
import { useEffect, useState } from "react";
import { fetchDiseaseTotals, fetchDiseaseTypes, fetchRecentDiseaseData } from '../services/apiService';
import { dailyCases, nationalStats } from '../utils/province-stats';
import renderDemographicsTab from './Dashboard/renderDemographicsTab';
import renderLineChart from './Dashboard/renderLineChart';
import renderProvincesTab from './Dashboard/renderProvinceTab';
const { Title, Text } = Typography;

const DashboardPanel = ({ isOpen, onToggle }) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [diseaseFilter, setDiseaseFilter] = useState("covid19");
    const [diseaseOptions, setDiseaseOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [diseaseData, setDiseaseData] = useState({
        totals: null,
        recentData: [],
    });

    // Fetch disease types on component mount
    useEffect(() => {
        const fetchDiseaseTypeOptions = async () => {
            try {
                const types = await fetchDiseaseTypes();
                const options = types.map(type => ({
                    value: type,
                    label: type === 'covid19' ? 'COVID-19' : type
                }));

                // // Add "All" option
                // options.unshift({ value: "all", label: "Tất cả" });

                setDiseaseOptions(options);
            } catch (error) {
                console.error('Failed to fetch disease types:', error);
                // Fallback to default options if API fails
                setDiseaseOptions([
                    // { value: "all", label: "Tất cả" },
                    { value: "covid19", label: "COVID-19" },
                    { value: "Sốt xuất huyết", label: "Sốt xuất huyết" },
                    { value: "Đậu mùa khỉ", label: "Đậu mùa khỉ" },
                ]);
            }
        };

        fetchDiseaseTypeOptions();
    }, []);

    // Fetch disease data when filter changes
    useEffect(() => {
        const fetchData = async () => {
            if (diseaseFilter === "all") {
                // If "all" is selected, use the mock data
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const [totalsData, recentData] = await Promise.all([
                    fetchDiseaseTotals(diseaseFilter),
                    fetchRecentDiseaseData(diseaseFilter)
                ]);

                setDiseaseData({
                    totals: totalsData,
                    recentData: recentData
                });
            } catch (error) {
                setError('Failed to fetch disease data. Please try again later.');
                console.error('Error fetching disease data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [diseaseFilter]);

    const renderOverviewTab = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" tip="Đang tải dữ liệu..." />
                </div>
            );
        }

        if (error) {
            return (
                <Alert
                    message="Lỗi"
                    description={error}
                    type="error"
                    showIcon
                    className="m-5"
                />
            );
        }

        let filteredStats = { ...nationalStats };
        let filteredDailyCases = [...dailyCases];

        // Use API data if available and a specific disease is selected
        if (diseaseFilter !== "all" && diseaseData.totals) {
            const apiData = diseaseData.totals;

            filteredStats = {
                totalCases: apiData.TotalInfections || 0,
                activeCases: apiData.TotalTreatment || 0,
                recovered: apiData.TotalRecovered || apiData.TotalRecover || 0,
                deaths: apiData.TotalDeath || 0,
            };

            // Format recent data for chart
            if (diseaseData.recentData && diseaseData.recentData.length > 0) {
                filteredDailyCases = diseaseData.recentData.map(day => ({
                    date: day.Date ? new Date(day.Date).toISOString().substring(0, 10) : "",
                    cases: day.DailyInfection || 0
                })).reverse(); // Reverse to show oldest to newest
            }
        }
        // } else {
        //     // If "all" is selected or API data not available, simulate different data
        //     const multiplier = {
        //         "covid19": 0.2,
        //         "Sốt xuất huyết": 0.5,
        //         "Đậu mùa khỉ": 0.3
        //     }[diseaseFilter] || 1.0;

        //     filteredStats = {
        //         ...nationalStats,
        //         totalCases: Math.floor(nationalStats.totalCases * multiplier),
        //         activeCases: Math.floor(nationalStats.activeCases * multiplier),
        //         recovered: Math.floor(nationalStats.recovered * multiplier),
        //         deaths: Math.floor(nationalStats.deaths * multiplier),
        //         vaccinated: {
        //             firstDose: nationalStats.vaccinated.firstDose * multiplier,
        //             secondDose: nationalStats.vaccinated.secondDose * multiplier,
        //             booster: nationalStats.vaccinated.booster * multiplier,
        //         }
        //     };

        //     filteredDailyCases = dailyCases.map(day => ({
        //         ...day,
        //         cases: Math.floor(day.cases * multiplier)
        //     }));
        // }
            // Modify the daily cases data
            // filteredDailyCases = dailyCases.map(day => ({
            //     ...day,
            //     cases: Math.floor(day.TotalInfections * multiplier)
            // }));
        }

        // Format data for charts
        const dailyCasesData = dailyCases.map(d => ({
            date: d.Date.substring(6, 10), // Only show MM-DD
            cases: d.TotalInfections
        }));



        const selectedDiseaseName = diseaseFilter !== "all"
            ? diseaseOptions.find(opt => opt.value === diseaseFilter)?.label
            : null;

        const lastUpdatedDate = diseaseData.totals?.Date
            ? new Date(diseaseData.totals.Date).toLocaleDateString('vi-VN')
            : "11/06/2025";

        return (
            <div className="p-5">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <Title level={4} style={{ margin: 0 }}>Tổng quan dịch bệnh</Title>
                        {selectedDiseaseName && (
                            <span className="text-sm text-blue-500 font-medium">
                                Đang xem: {selectedDiseaseName}
                            </span>
                        )}
                    </div>
                    <Select
                        value={diseaseFilter}
                        onChange={setDiseaseFilter}
                        options={diseaseOptions}
                        style={{ width: 160 }}
                        placeholder="Chọn loại bệnh"
                        dropdownStyle={{ borderRadius: '8px' }}
                        className="hover:shadow-md transition-shadow"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-200">
                        <div className="flex justify-between">
                            <Text className="text-xs text-blue-700 font-medium">Tổng ca nhiễm</Text>
                            <div className="bg-blue-500 p-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xl font-bold text-blue-600 mt-1">{filteredStats.totalCases.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-orange-200">
                        <div className="flex justify-between">
                            <Text className="text-xs text-orange-700 font-medium">Ca đang điều trị</Text>
                            <div className="bg-orange-500 p-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12M8 17h12M3 7l1 1M3 12l1 1M3 17l1 1" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xl font-bold text-orange-600 mt-1">{filteredStats.activeCases.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-green-200">
                        <div className="flex justify-between">
                            <Text className="text-xs text-green-700 font-medium">Khỏi bệnh</Text>
                            <div className="bg-green-500 p-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xl font-bold text-green-600 mt-1">{filteredStats.recovered.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-red-200">
                        <div className="flex justify-between">
                            <Text className="text-xs text-red-700 font-medium">Tử vong</Text>
                            <div className="bg-red-500 p-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xl font-bold text-red-600 mt-1">{filteredStats.deaths.toLocaleString()}</p>
                    </div>
                </div>

                <div className="mb-6 bg-white/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                    <div className="flex items-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        <Title level={5} style={{ margin: 0 }}>Số ca nhiễm theo ngày {selectedDiseaseName && `- ${selectedDiseaseName}`}</Title>
                    </div>
                    <div className="bg-white rounded-lg overflow-hidden">
                        {renderLineChart(dailyCasesData, 'date', 'cases', 'Diễn biến ca nhiễm')}
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div
            className={`fixed top-2 right-0 h-[90vh] mt-12 w-[25%] z-10 mr-2 transition-transform duration-300 ease-in-out backdrop-blur-md bg-white/80 shadow-xl border-l border-white/20 rounded-l-xl ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
            <div className="flex justify-between items-center p-4 border-b border-white/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <div className="flex items-center">
                    <div className="w-8 h-8 mr-2 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <Title level={3} style={{ margin: 0 }}>Dịch bệnh Việt Nam</Title>
                </div>
                <button
                    onClick={onToggle}
                    className="p-2 rounded-full hover:bg-white/30 transition-all hover:rotate-90 duration-300"
                    title="Đóng bảng điều khiển"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="mx-3 mt-3"
                type="card"
                animated={true}
                items={[
                    {
                        key: 'overview',
                        label: (
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Tổng quan
                            </span>
                        ),
                        children: <></>
                    },
                    {
                        key: 'provinces',
                        label: (
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Theo tỉnh
                            </span>
                        ),
                        children: <></>
                    },
                    {
                        key: 'demographics',
                        label: (
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Nhân khẩu
                            </span>
                        ),
                        children: <></>
                    }
                ]}
            />

            <div className="overflow-y-auto scrollbar-thin mb-[25px] scrollbar-thumb-gray-300 scrollbar-track-transparent" style={{ height: "calc(100% - 175px)" }}>
                {activeTab === "overview" && renderOverviewTab()}
                {activeTab === "provinces" && renderProvincesTab()}
                {activeTab === "demographics" && renderDemographicsTab()}
            </div>

            <div className="absolute bottom-0 left-0 right-0 pt-1 text-center text-xs text-gray-500 rounded-b-lg border-t border-white/30 bg-white/50 backdrop-blur-sm">
                <p>Dữ liệu được cập nhật theo API - Cập nhật lần cuối: {diseaseData.totals?.Date ? new Date(diseaseData.totals.Date).toLocaleDateString('vi-VN') : "11/06/2025"}</p>
                <p className="text-blue-500 hover:underline cursor-pointer">Xem nguồn dữ liệu</p>
            </div>
        </div>
    );
};

export default DashboardPanel;
