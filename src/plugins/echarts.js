/**
 * echarts 图表库
 */
import * as echarts from 'echarts'
import * as ecStat from 'echarts-stat' // 1. Import ecStat
import china from '@/assets/json/china.json'
export default {
    // echarts挂载到Vue全局
    install: (app) => {
        //Register the regression transform globally immediately
        echarts.registerTransform(ecStat.transform.regression);
        app.config.globalProperties.$line = (element, data) => {
            //加载echarts
            const myChart = echarts.init(document.getElementById(element))
            // 指定图表的配置项和数据
            const option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    top: '5%',
                    left: 'center',
                    data: ['Email', 'Union Ads', 'Video Ads']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: data
            }
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option)
        },
        app.config.globalProperties.$radar = (element) => {
                const radarChart = echarts.init(document.getElementById(element))
                const option = {
                    title: {
                        text: 'Proportion of Browsers',
                        subtext: 'Fake Data',
                        top: 10,
                        left: 10
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        type: 'scroll',
                        bottom: 10,
                        data: (function () {
                            var list = [];
                            for (var i = 1; i <= 28; i++) {
                                list.push(i + 2000 + '');
                            }
                            return list;
                        })()
                    },
                    visualMap: {
                        top: 'middle',
                        right: 10,
                        inRange: {
                            color: ['red', 'yellow']
                        },
                        calculable: true
                    },
                    radar: {
                        indicator: [
                            { name: 'IE8-', max: 400 },
                            { name: 'IE9+', max: 400 },
                            { name: 'Safari', max: 400 },
                            { name: 'Firefox', max: 400 },
                            { name: 'Chrome', max: 400 }
                        ]
                    },
                    series: (function () {
                        var series = [];
                        for (var i = 1; i <= 28; i++) {
                            series.push({
                                type: 'radar',
                                symbol: 'none',
                                lineStyle: {
                                    width: 1
                                },
                                emphasis: {
                                    areaStyle: {
                                        color: 'rgba(0,250,0,0.3)'
                                    }
                                },
                                data: [
                                    {
                                        value: [
                                            (40 - i) * 10,
                                            (38 - i) * 4 + 60,
                                            i * 5 + 10,
                                            i * 9,
                                            (i * i) / 2
                                        ],
                                        name: i + 2000 + ''
                                    }
                                ]
                            });
                        }
                        return series;
                    })()
                };
                radarChart.setOption(option)
        },
        app.config.globalProperties.$scatter = (element, data) => {
                const scatterChart = echarts.init(document.getElementById(element))
                const option = {
                    dataset: [
                        {
                            source: [
                                [1, 4862.4],
                                [2, 5294.7],
                                [3, 5934.5],
                                [4, 7171.0],
                                [5, 8964.4],
                                [6, 10202.2],
                                [7, 11962.5],
                                [8, 14928.3],
                                [9, 16909.2],
                                [10, 18547.9],
                                [11, 21617.8],
                                [12, 26638.1],
                                [13, 34634.4],
                                [14, 46759.4],
                                [15, 58478.1],
                                [16, 67884.6],
                                [17, 74462.6],
                                [18, 79395.7]
                            ]
                        },
                        {
                            transform: {
                                type: 'ecStat:regression',
                                config: {
                                    method: 'exponential'
                                    // 'end' by default
                                    // formulaOn: 'start'
                                }
                            }
                        }
                    ],
                    title: {
                        text: '1981 - 1998 gross ',
                        subtext: 'By ecStat.regression',
                        sublink: 'https://github.com/ecomfe/echarts-stat',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    xAxis: {
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },
                    yAxis: {
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },
                    series: [
                        {
                            name: 'scatter',
                            type: 'scatter',
                            datasetIndex: 0
                        },
                        {
                            name: 'line',
                            type: 'line',
                            smooth: true,
                            datasetIndex: 1,
                            symbolSize: 0.1,
                            symbol: 'circle',
                            label: { show: true, fontSize: 16 },
                            labelLayout: { dx: -20 },
                            encode: { label: 2, tooltip: 1 }
                        }
                    ]
                };
                scatterChart.setOption(option)
        },
        app.config.globalProperties.$pie = (element, data) => {
                const pieChart = echarts.init(document.getElementById(element))
                const option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        top: '5%',
                        left: 'center'
                    },
                    series: [
                        {
                            name: 'Access From',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            padAngle: 5,
                            itemStyle: {
                                borderRadius: 10
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 40,
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                { value: 1048, name: 'Search Engine' },
                                { value: 735, name: 'Direct' },
                                { value: 580, name: 'Email' },
                                { value: 484, name: 'Union Ads' },
                                { value: 300, name: 'Video Ads' }
                            ]
                        }
                    ]
                };
                pieChart.setOption(option)
        },
        app.config.globalProperties.$china = (element,data) => {
            const chinaMap = echarts.init(document.getElementById(element))
            //注册地图
            echarts.registerMap('china',china)
            const option = {
                //鼠标点击弹窗
                tooltip:{
                    triggerOn:'click', //点击触发
                    enterable:true,    //是否出现弹框
                },
                visualMap:{
                    origin:'vertical',
                    type:'piecewise',
                    pieces:[
                        {min:0,max:0,color:"#f5f5f5"},
                        {min:1,max:10,color:"#d4f1f4"},
                        {min:10,max:20,color:"#a3e4d7"},
                        {min:20,max:30,color:"#52b788"},
                        {min:30,max:40,color:"#2d6a4f"},
                        {min:40,max:100,color:"#1b4332"},
                    ]
                },
                series:[{
                    name:'中国地图',
                    type:'map',
                    map:'china',
                    zoom:1.3,      //默认地图放大倍数
                    label:{
                        show:true,  //是否显示地图上的文本信息
                        fontSize:8
                    },
                    itemStyle:{
                        areaColor:"rgba(255,255,255,1)",
                        borderColor:"rgba(0,0,0,0.2)"
                    },
                    data:[
                        {name:'黑龙江',value:9},
                        {name:'江西',value:13},
                        {name:'福建',value:24},
                        {name:'上海',value:35},
                        {name:'北京',value:36},
                        {name:'广东',value:60},
                        {name:'河南',value:80},
                    ]  
                }]
            }
            chinaMap.setOption(option)
        }
    }
}