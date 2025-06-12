import React, { useEffect, useState } from "react";
import { Column } from '@ant-design/plots';
import 'antd/dist/reset.css';
import axios from "axios";
import { Card, Typography } from 'antd';
const { Title, Text } = Typography;

export default function AdminCharts({ onData, filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async (customFilters) => {
    setLoading(true);
    try {
      const params = {
        fromDate: customFilters?.fromDate || filters.fromDate,
        toDate: customFilters?.toDate || filters.toDate,
        typeDisease: customFilters?.typeDisease || filters.typeDisease,
        province: customFilters?.province || filters.province,
        page: 1
      };
      const res = await axios.post(
        "http://localhost:3000/admin/daily-report",
        params,
        { withCredentials: true }
      );
      const patients = res.data.data?.patients || [];
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
    const date = item.Date ? new Date(item.Date).toLocaleDateString() : '';
    if (!date) return acc;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  // Sắp xếp ngày tăng dần, lấy toàn bộ các ngày có dữ liệu
  const sortedDates = Object.keys(groupedData).sort((a, b) => {
    // Chuyển dd/mm/yyyy về yyyy-mm-dd để so sánh
    const da = new Date(a.split('/').reverse().join('-'));
    const db = new Date(b.split('/').reverse().join('-'));
    return da - db;
  });
  const chartData = sortedDates.map(date => ({ date, value: groupedData[date] }));

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    color: ({ value }) =>
      value > 0
        ? 'l(90) 0:#38bdf8 0.5:#6366f1 1:#a21caf' // gradient xanh dương-tím
        : '#e0e7ef',
    barWidthRatio: 0.25, // cột nhỏ lại
    minColumnWidth: 8, // cột luôn nhỏ tối thiểu 8px
    maxColumnWidth: 32, // cột không quá to khi ít dữ liệu
    columnStyle: {
      borderRadius: [10, 10, 0, 0],
      shadowColor: '#6366f155',
      shadowBlur: 12,
    },
    label: {
      position: 'top',
      style: {
        fill: '#6366f1',
        fontWeight: 700,
        fontSize: 15,
        textShadow: '0 1px 2px #fff',
      },
      formatter: (v) => (v.value > 0 ? v.value : ''),
    },
    xAxis: {
      title: { text: 'Ngày', style: { fill: '#6366f1', fontWeight: 700, fontSize: 17 } },
      label: { style: { fill: '#334155', fontWeight: 600, fontSize: 14 } },
      grid: null,
    },
    yAxis: {
      title: { text: 'Số ca mắc', style: { fill: '#6366f1', fontWeight: 700, fontSize: 17 } },
      label: { style: { fill: '#334155', fontWeight: 600, fontSize: 14 } },
      grid: { line: { style: { stroke: '#e0e7ef', lineDash: [4, 4] } } },
    },
    height: 360,
    style: { background: 'linear-gradient(135deg,#f8fafc 60%,#e0e7ef 100%)', borderRadius: 20, padding: 32, minHeight: 260, boxShadow: '0 4px 24px #6366f122', border: '1px solid #e0e7ef' },
    loading,
    tooltip: {
      showMarkers: false,
      customContent: (title, items) => `<div style='font-weight:700;color:#6366f1;font-size:16px'>${title}</div><div style='margin-top:4px'>${items.map(i => `<span style='color:#6366f1;font-weight:600'>${i.data.value}</span> ca</div>`).join('')}</div>`
    },
    legend: false,
    animation: { appear: { animation: 'scale-in-y', duration: 900 } },
  };

  return (
    <Card
      style={{
        marginBottom: 24,
        borderRadius: 20,
        boxShadow: '0 4px 24px #6366f122',
        background: 'linear-gradient(135deg,#f8fafc 60%,#e0e7ef 100%)',
        border: '1px solid #e0e7ef',
        padding: 0,
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ padding: 32 }}>
        <Title level={4} style={{ textAlign: 'center', color: '#6366f1', fontWeight: 800, letterSpacing: 1, marginBottom: 0 }}>
          Biểu đồ số ca mắc theo ngày (30 ngày gần nhất)
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', fontSize: 14, marginBottom: 18, fontStyle: 'italic' }}>
          Số liệu được tổng hợp tự động từ hệ thống báo cáo dịch tễ. Mỗi cột là tổng số ca ghi nhận trong ngày tương ứng.
        </Text>
        {chartData.length === 0 ? (
          <div style={{height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 12, border: '1px solid #eee', minHeight: 260, boxShadow: '0 1px 4px #0001'}}>
            <span style={{color: '#888', fontSize: 16}}>Không có dữ liệu</span>
          </div>
        ) : (
          <Column {...config} />
        )}
      </div>
    </Card>
  );
}
