import { Typography } from 'antd';
import renderBarChart from './renderBarChart';
import renderPieChart from './renderPieChart';
const { Title } = Typography;
import { demographics } from '../../utils/province-stats'; // Assuming you have a demographics data file

const renderDemographicsTab = () => {
    // Format data for charts
    const ageData = Object.entries(demographics.age).map(([range, count]) => ({
        range,
        count
    }));

    const genderData = Object.entries(demographics.gender).map(([gender, count]) => ({
        gender: gender === 'male' ? 'Nam' : 'Nữ',
        count
    }));

    return (
        <div className="p-5">
            <div className="flex items-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <Title level={4} style={{ margin: 0 }}>Thống kê nhân khẩu học</Title>
            </div>

            <div className="mb-6 bg-white/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <Title level={5} style={{ margin: 0 }}>Phân bố theo độ tuổi</Title>
                </div>
                <div className="bg-white rounded-lg overflow-hidden">
                    {renderBarChart(
                        ageData,
                        'range',
                        'count',
                        'Số ca nhiễm theo độ tuổi',
                        ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef']
                    )}
                </div>
                <div className="mt-3 grid grid-cols-5 gap-2">
                    {ageData.map((age, index) => (
                        <div key={index} className="text-center">
                            <div className="text-xs font-medium">{age.range}</div>
                            <div className="text-sm text-blue-600 font-bold">{age.count.toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6 bg-white/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <Title level={5} style={{ margin: 0 }}>Phân bố theo giới tính</Title>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg overflow-hidden">
                        {renderPieChart(
                            genderData,
                            'count',
                            'gender',
                            'Phân bố theo giới tính',
                            ['#3b82f6', '#ec4899']
                        )}
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <div className="grid grid-cols-2 gap-6 mt-2 w-full">
                            <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                                <div className="text-sm text-blue-600 font-medium">Nam</div>
                                <div className="text-lg font-bold text-blue-700">{demographics.gender.male.toLocaleString()}</div>
                                <div className="text-xs text-blue-500">
                                    {Math.round(demographics.gender.male / (demographics.gender.male + demographics.gender.female) * 100)}%
                                </div>
                            </div>
                            <div className="bg-pink-50 rounded-lg p-3 text-center border border-pink-100">
                                <div className="text-sm text-pink-600 font-medium">Nữ</div>
                                <div className="text-lg font-bold text-pink-700">{demographics.gender.female.toLocaleString()}</div>
                                <div className="text-xs text-pink-500">
                                    {Math.round(demographics.gender.female / (demographics.gender.male + demographics.gender.female) * 100)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default renderDemographicsTab;