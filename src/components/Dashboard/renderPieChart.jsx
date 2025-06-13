import { Pie } from '@ant-design/charts';
import { Card } from 'antd';

const renderPieChart = (data, angleField, colorField, title, colors) => {
    const config = {
        appendPadding: 10,
        data,
        angleField,
        colorField,
        color: colors,
        radius: 0.8,
        // label: {
        //     type: 'outer',
        //     formatter: (datum) => {
        //         return `${datum[colorField]}: ${(datum[angleField] / data.reduce((sum, item) => sum + item[angleField], 0) * 100).toFixed(1)}%`;
        //     },
        // },
        tooltip: {
            // formatter: (datum) => {
            //     return { name: datum[colorField] };
            // },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
        height: 250,
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