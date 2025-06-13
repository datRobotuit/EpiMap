import React, { useEffect, useState } from "react";
import { Area, Column } from '@ant-design/plots';
import 'antd/dist/reset.css';
import axios from "axios";
import { Card, Typography } from 'antd';
import renderColumnChart from "../../components/Dashboard/renderColumnChart";
const { Title, Text } = Typography;

export default function AdminCharts({ onData, filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async (customFilters) => {
    setLoading(true);
    try {
      const params = {
        type: customFilters?.typeDisease || filters.typeDisease,
        startDate: customFilters?.fromDate || filters.fromDate,
        endDate: customFilters?.toDate || filters.toDate,
      };
      // Only add province if not 'all' or 'Toàn quốc'
      const province = customFilters?.province || filters.province;
      if (province && province !== 'all' && province !== 'Toàn quốc') {
        params.province = province;
      }
      const res = await axios.get(
        "http://localhost:3000/admin/daily-report",
        {
          params,
          withCredentials: true
        }
      );
      console.log('API response:', res.data);
      const patients = res.data.data || [];
      setData(patients);
      if (onData) {
        onData({ patients });
      }
    } catch (err) {
      setData([]);
      if (onData) onData({ patients: [] });
      console.error('API error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line
  }, [filters]);

  // Group patients by date and count cases per day
  const groupedData = data.reduce((acc, item) => {
    // Lấy ngày chuẩn yyyy-mm-dd để group
    const dateObj = item.Date ? new Date(item.Date) : null;
    const date = dateObj ? dateObj.toISOString().slice(0, 10) : '';
    if (!date) return acc;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  // Sắp xếp ngày tăng dần, lấy toàn bộ các ngày có dữ liệu
  const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b));
  const chartData = data
    .filter(item => item.Date && typeof item.DailyInfection === 'number')
    .map(item => ({
      date: new Date(item.Date).toISOString().slice(0, 10),
      value: item.DailyInfection,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
//   // Tính width động cho chart: mỗi cột ~60px, tối thiểu 400px
//     console.log("Chart Data:", chartData);
// const uniqueDates = new Set(chartData.map(d => d.date));
// console.log('Total:', chartData.length, 'Unique:', uniqueDates.size);
//   const chartWidth = Math.max(chartData.length * 60, 400);
//   const maxValue = Math.max(...chartData.map(item => item.value || 0));
//   const roundedMax = Math.ceil((maxValue + 5) / 10) * 10;

//   // Column chart config giống demo, hiển thị số ca mắc theo ngày
//   const columnConfig = {
//     data: chartData,
//     xField: 'date',
//     yField: 'value',
//     color: ({ value }) => value > 0 ? 'l(90) 0:#38bdf8 0.5:#6366f1 1:#a21caf' : '#e0e7ef',
//     barWidthRatio: 0.25,
//     minColumnWidth: 8,
//     maxColumnWidth: 32,
//     autoFit: false, // Không tự fit theo container
//     width: chartWidth,
//     columnStyle: {
//       borderRadius: [8, 8, 0, 0],
//       shadowColor: '#6366f155',
//       shadowBlur: 8,
//     },
//     label: {
//       position: 'top',
//       style: {
//         fill: '#6366f1',
//         fontWeight: 700,
//         fontSize: 13,
//         textShadow: '0 1px 2px #fff',
//       },
//       formatter: (v) => (v.value > 0 ? v.value : ''),
//     },
//     xAxis: {
//       title: { text: 'Ngày', style: { fill: '#6366f1', fontWeight: 700, fontSize: 15 } },
//       label: { style: { fill: '#334155', fontWeight: 600, fontSize: 12 } },
//       grid: null,
//       type: 'cat',
//     },
//     yAxis: {
//       min: 0,
//       max: roundedMax,
//       tickInterval: 5,
//       title: { text: 'Số ca mắc', style: { fill: '#6366f1', fontWeight: 700, fontSize: 15 } },
//       label: { style: { fill: '#334155', fontWeight: 600, fontSize: 12 } },
//       grid: { line: { style: { stroke: '#e0e7ef', lineDash: [4, 4] } } },
//     },
//     height: 340,
//     style: { background: 'linear-gradient(135deg,#f8fafc 60%,#e0e7ef 100%)', borderRadius: 16, padding: 24, minHeight: 220, boxShadow: '0 2px 12px #6366f122', border: '1px solid #e0e7ef' },
//     loading,
//     tooltip: {
//       showMarkers: false,
//     },
//     legend: false,
//     animation: { appear: { animation: 'scale-in-y', duration: 800 } },
//     onReady: ({ chart }) => {
//       if (chartData.length > 0) {
//         try {
//           const { height } = chart._container.getBoundingClientRect();
//           const tooltipItem = chartData[Math.floor(Math.random() * chartData.length)];
//           chart.on(
//             'afterrender',
//             () => {
//               chart.emit('tooltip:show', {
//                 data: {
//                   data: tooltipItem,
//                 },
//                 offsetY: height / 2 - 60,
//               });
//             },
//             true,
//           );
//         } catch (e) {
//           // ignore
//         }
//       }
//     },
//   };

  return (
    <Card
      bordered={false}
      style={{ borderRadius: 16, overflow: 'hidden', position: 'relative' }}
      bodyStyle={{ padding: 0 }}
    >
      {chartData.length === 0 ? (
        <div style={{height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 12, border: '1px solid #eee', minHeight: 220, boxShadow: '0 1px 4px #0001'}}>
          <span style={{color: '#888', fontSize: 16}}>Không có dữ liệu</span>
        </div>
      ) : (
        <div style={{overflowX: 'auto', width: '100%'}}>
         {renderColumnChart(
                            chartData,
                            'date',
                            'value',
                            'Tình trạng tiêm chủng (triệu người)',
                            ['#3b82f6', '#10b981', '#6366f1']
                        )}
        </div>
      )}
    </Card>
  );
}
