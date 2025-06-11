import { Pie } from '@ant-design/plots';
import { Card } from 'antd';

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
export default renderPieChart;