import { Bar } from "@ant-design/charts";

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
export default renderBarChart;