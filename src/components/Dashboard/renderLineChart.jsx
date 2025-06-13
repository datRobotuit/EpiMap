import { Line } from '@ant-design/charts';
import { Card } from 'antd';

const renderLineChart = (data, xField, yField, title, color = '#1890ff') => {

    const config = {
        data,
        xField,
        yField,
        point: {
            size: 5,
            shape: 'diamond',
            style: {
                fill: 'white',
                stroke: color,
                lineWidth: 2,
            },
        },
        meta: {
            [yField]: {
                alias: 'Số ca nhiễm',
                formatter: (val) => `${val.toLocaleString()} ca`,
            },
        },
        color,
        lineStyle: {
            lineWidth: 3,
            strokeOpacity: 0.7,
        },
        label: {},
        smooth: true,
        areaStyle: {
            fill: color,
            fillOpacity: 0.2,
        },
        animation: {
            appear: {
                animation: 'path-in',
                duration: 1000,
            },
        },
        title: {
            text: title,
            visible: !!title,
        },
        yAxis: {
            grid: {
                line: {
                    style: {
                        stroke: '#eee',
                        lineDash: [4, 4],
                    },
                },
            },
            label: {
                formatter: (text) => {
                    return text.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
            },
        },
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: false,
            },
        },
    };

    return (
        <Card title={title} size="small">
            <Line {...config} />
        </Card>
    );
};

export default renderLineChart;