import { Bar, Column, Line, Pie } from '@ant-design/charts';
import { Card, Tabs, Typography } from 'antd';
import { useState } from "react";
import { dailyCases, demographics, nationalStats, provincesData } from "../utils/province-stats";

const { Title, Text } = Typography;

const DashboardPanel = ({ isOpen, onToggle }) => {
    const [activeTab, setActiveTab] = useState("overview");

    // Ant Design Charts - Bar Chart
    const renderBarChart = (data, xField, yField, title, colors) => {
        const config = {
            data,
            xField: yField,
            yField: xField,
            seriesField: xField,
            legend: {
                position: 'top-left',
            },
            color: colors,
            label: {
                position: 'right',
                style: {
                    fill: '#333',
                },
            },
            xAxis: {
                title: {
                    text: title,
                },
            },
            tooltip: {
                formatter: (datum) => {
                    return { name: datum[xField], value: datum[yField] };
                },
            },
            height: 200,
            autoFit: true,
        };

        return <Bar {...config} />;
    };

    // Ant Design Charts - Column Chart
    const renderColumnChart = (data, xField, yField, title, colors) => {
        const config = {
            data,
            xField,
            yField,
            seriesField: xField,
            color: colors,
            label: {
                position: 'top',
                style: {
                    fill: '#333',
                },
            },
            xAxis: {
                label: {
                    autoRotate: true,
                    autoHide: false,
                    autoEllipsis: false,
                },
                title: {
                    text: title,
                },
            },
            height: 200,
            autoFit: true,
        };

        return <Column {...config} />;
    };

    // Ant Design Charts - Pie Chart
    const renderPieChart = (data, angleField, colorField, title, colors) => {
        const config = {
            data,
            angleField,
            colorField,
            color: colors,
            radius: 0.8,
            label: {
                type: 'outer',
                content: '{name}: {percentage}',
            },
            tooltip: {
                formatter: (datum) => {
                    return { name: datum[colorField], value: datum[angleField] };
                },
            },
            interactions: [
                {
                    type: 'element-active',
                },
            ],
            height: 200,
            autoFit: true,
            legend: {
                layout: 'horizontal',
                position: 'bottom',
            },
        };

        return (
            <Card title={title} size="small">
                <Pie {...config} />
            </Card>
        );
    };

    // Ant Design Charts - Line Chart
    const renderLineChart = (data, xField, yField, title) => {
        const config = {
            data,
            xField,
            yField,
            point: {
                size: 5,
                shape: 'circle',
            },
            color: '#3b82f6',
            lineStyle: {
                lineWidth: 3,
            },
            tooltip: {
                formatter: (datum) => {
                    return { name: 'Số ca', value: datum[yField] };
                },
            },
            xAxis: {
                title: {
                    text: 'Ngày',
                },
                tickCount: 5,
            },
            yAxis: {
                title: {
                    text: 'Số ca',
                },
            },
            height: 250,
            autoFit: true,
        };

        return (
            <Card title={title} size="small">
                <Line {...config} />
            </Card>
        );
    };

    const renderOverviewTab = () => {
        // Format data for charts
        const dailyCasesData = dailyCases.map(d => ({
            date: d.date.substring(5), // Only show MM-DD
            cases: d.cases
        }));

        const vaccinationData = [
            { category: "Mũi 1", value: nationalStats.vaccinated.firstDose / 1000000 },
            { category: "Mũi 2", value: nationalStats.vaccinated.secondDose / 1000000 },
            { category: "Mũi bổ sung", value: nationalStats.vaccinated.booster / 1000000 }
        ];

        return (
            <div className="top-0 left-0 p-4">
                <Title level={4}>Tổng quan dịch bệnh</Title>
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-blue-100 p-3 rounded-md">
                        <Text type="secondary" className="text-xs text-blue-800">Tổng ca nhiễm</Text>
                        <p className="text-xl font-bold text-blue-600">{nationalStats.totalCases.toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-md">
                        <Text type="secondary" className="text-xs text-orange-800">Ca đang điều trị</Text>
                        <p className="text-xl font-bold text-orange-600">{nationalStats.activeCases.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-md">
                        <Text type="secondary" className="text-xs text-green-800">Khỏi bệnh</Text>
                        <p className="text-xl font-bold text-green-600">{nationalStats.recovered.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-md">
                        <Text type="secondary" className="text-xs text-red-800">Tử vong</Text>
                        <p className="text-xl font-bold text-red-600">{nationalStats.deaths.toLocaleString()}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <Title level={5}>Số ca nhiễm theo ngày</Title>
                    {renderLineChart(dailyCasesData, 'date', 'cases', 'Số ca nhiễm theo ngày')}
                </div>

                <div className="mb-6">
                    <Title level={5}>Tình trạng tiêm chủng</Title>
                    {renderColumnChart(
                        vaccinationData,
                        'category',
                        'value',
                        'Tình trạng tiêm chủng (triệu người)',
                        ['#3b82f6', '#10b981', '#6366f1']
                    )}
                </div>
            </div>
        );
    };

    const renderProvincesTab = () => {
        // Format data for charts
        const top5Provinces = provincesData.slice(0, 5);

        const provinceCasesData = top5Provinces.map(province => ({
            province: province.province,
            cases: province.cases
        }));

        const provinceActiveData = top5Provinces.map(province => ({
            province: province.province,
            active: province.active
        }));

        return (
            <div className="p-4">
                <Title level={4}>Theo tỉnh/thành phố</Title>

                <div className="mb-6">
                    <Title level={5}>Các tỉnh có số ca nhiễm cao nhất</Title>
                    {renderColumnChart(
                        provinceCasesData,
                        'province',
                        'cases',
                        'Số ca nhiễm theo tỉnh/thành',
                        ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef']
                    )}
                </div>

                <div className="mb-6">
                    <Title level={5}>Tỷ lệ ca đang điều trị</Title>
                    {renderPieChart(
                        provinceActiveData,
                        'active',
                        'province',
                        'Tỷ lệ ca đang điều trị',
                        ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef']
                    )}
                </div>

                <div className="overflow-auto max-h-64 mt-6">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỉnh/Thành</th>
                                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ca nhiễm</th>
                                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đang điều trị</th>
                                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khỏi bệnh</th>
                                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tử vong</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {provincesData.map((province, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="py-2 px-3 text-sm font-medium text-gray-900">{province.province}</td>
                                    <td className="py-2 px-3 text-sm text-gray-500">{province.cases}</td>
                                    <td className="py-2 px-3 text-sm text-orange-500">{province.active}</td>
                                    <td className="py-2 px-3 text-sm text-green-500">{province.recovered}</td>
                                    <td className="py-2 px-3 text-sm text-red-500">{province.deaths}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

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
            <div className="p-4">
                <Title level={4}>Thống kê nhân khẩu học</Title>

                <div className="mb-6">
                    <Title level={5}>Phân bố theo độ tuổi</Title>
                    {renderBarChart(
                        ageData,
                        'range',
                        'count',
                        'Số ca nhiễm theo độ tuổi',
                        ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef']
                    )}
                </div>

                <div className="mb-6">
                    <Title level={5}>Phân bố theo giới tính</Title>
                    {renderPieChart(
                        genderData,
                        'count',
                        'gender',
                        'Phân bố theo giới tính',
                        ['#3b82f6', '#ec4899']
                    )}
                </div>
            </div>
        );
    };

    return (
        <div
            className={`fixed top-0 left-0 h-full bg-black w-1/4 z-10 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}
        >
            <div className="flex justify-between items-center p-4 border-b">
                <Title level={3} style={{ margin: 0 }}>Dịch bệnh Việt Nam</Title>
                <button
                    onClick={onToggle}
                    className="p-1 rounded-full hover:bg-gray-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="mx-2 mt-2"
                items={[
                    {
                        key: 'overview',
                        label: 'Tổng quan',
                        children: <></>
                    },
                    {
                        key: 'provinces',
                        label: 'Theo tỉnh',
                        children: <></>
                    },
                    {
                        key: 'demographics',
                        label: 'Nhân khẩu',
                        children: <></>
                    }
                ]}
            />

            <div className="overflow-y-auto" style={{ height: "calc(100% - 110px)" }}>
                {activeTab === "overview" && renderOverviewTab()}
                {activeTab === "provinces" && renderProvincesTab()}
                {activeTab === "demographics" && renderDemographicsTab()}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 text-center text-xs text-gray-500 border-t bg-gray-50">
                <p>Dữ liệu mẫu - Dành cho mục đích hiển thị</p>
                <p className="mt-1">Dữ liệu thực sẽ được cập nhật từ API</p>
            </div>
        </div>
    );
};

export default DashboardPanel;
