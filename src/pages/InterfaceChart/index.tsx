import {PageContainer, ProCard} from '@ant-design/pro-components';
import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import {getChartCallTrend} from "@/services/ant-design-pro/api";
import {useModel} from "@@/exports";

const InterfaceChart: React.FC = () => {
  const domRef = useRef();
  const { initialState } = useModel('@@initialState');
  const [callTrendData, setCallTrendData] = useState<number[]>([]);

  useEffect(() => {
    // 调用API获取调用趋势数据
    getChartCallTrend().then((data) => {
      setCallTrendData(data);
    });
  }, []);

  const chartInit = () => {
    const myChart = echarts.init(domRef.current);

    // 构造时间数据，假设日期是最近5天
    const currentDate = new Date();
    const timeData = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      timeData.push(dateString);
    }

    myChart.setOption({
      title: {
        text: '接口调用趋势',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: timeData,
      },
      yAxis: {
        type: 'value',
        name: '调用次数',
      },
      series: [
        {
          name: '调用次数',
          type: 'line',
          data: callTrendData, // 使用从API获取的调用趋势数据
        },
      ],
    });
  };

  useEffect(() => {
    if (callTrendData.length > 0) {
      chartInit();
    }
  }, [callTrendData]);

  return (
    <PageContainer>
      <ProCard
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div ref={domRef} style={{ width: '100%', height: '400px' }}></div>
      </ProCard>
    </PageContainer>
  );
};

export default InterfaceChart;
