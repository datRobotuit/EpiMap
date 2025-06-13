import { Column } from '@ant-design/charts';
import { Typography } from 'antd';
const { Title } = Typography;

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
export default renderColumnChart;