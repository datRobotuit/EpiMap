import React from 'react';
import { Card } from 'antd';
import { Line } from '@ant-design/plots';

const renderLineChart = (data, xField, yField, title) => {
    const config = {
        data,
        xField,
        yField,
        point: {
            size: 3,
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
export default renderLineChart;