<script>
    import * as echarts from 'echarts/core'
	import { empty } from '$lib/helper/utils'
    import { LineChart } from 'echarts/charts'
	import { onDestroy, onMount } from 'svelte'
    import { CanvasRenderer } from 'echarts/renderers'
    import { LabelLayout, UniversalTransition } from 'echarts/features'

    import {
        TitleComponent,
        TooltipComponent,
        GridComponent,
        DatasetComponent,
        TransformComponent
    } from 'echarts/components'

    export let title = ""
    export let xTitle
    export let yTitle
    export let xPoints = []
    export let yPoints = []

    let chart
    let interval

    onMount(() => {
        echarts.use([
            LineChart,
            TitleComponent,
            TooltipComponent,
            GridComponent,
            DatasetComponent,
            TransformComponent,
            LabelLayout,
            UniversalTransition,
            CanvasRenderer
        ]);

        chart = echarts.init(document.getElementById('smooth-line-chart'))

        chart.setOption({
            xAxis: {
                boundaryGap: false,
                data: xPoints,
                axisLine: {
                    lineStyle: {
                        color: '#A0AEC0',
                        type: 'solid'
                    }
                },
            },
            yAxis: {
                axisLine: {
                    lineStyle: {
                        color: '#A0AEC0',
                        type: 'solid'
                    }
                },
            },
            series: [
                {
                    data: yPoints,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        type: "solid",
                        color: '#6D9A16'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#BFE85F' },
                            { offset: 0.9555, color: 'rgba(191, 232, 95, 0)' }
                        ]),
                        opacity: 0.1
                    }
                }
            ]
        })

        window.addEventListener('resize', () => {
            chart.resize()
        })

        interval = setInterval(() => {
            chart.setOption({
                series: [
                    {
                        data: yPoints,
                    }
                ]
            })
        }, 0)
    })

    onDestroy(() => {
        window.removeEventListener('resize', () => {
            chart.resize()
        })
        clearInterval(interval);
    })
</script>

<div class="flex flex-col items-start self-stretch rounded-xl border border-gray-200 bg-white shadow-sm">
    <div class="flex flex-col items-start self-stretch gap-5 p-6 overflow-x-auto xl:overflow-x-hidden overflow-y-hidden">
        {#if ! empty(title)}
        <div class="flex flex-col items-start self-stretch gap-5">
            <span class="text-lg font-semibold">{title}</span>
        </div>
        {/if}

        <div class="h-[200px] self-stretch">
            <div class="flex items-start flex-shrink gap-1 h-full">
                <div class="flex flex-col justify-center items-end self-stretch pb-6 mr-1 md:mr-2 w-8">
                    <span class="-rotate-90 text-gray-600 text-center text-xs leading-[18px] font-medium">{xTitle}</span>
                </div>
                <div class="flex flex-col items-start self-stretch flex-1">
                    <div class="relative flex justify-center items-center flex-1 w-full">
                        <div id="smooth-line-chart" class="absolute w-[123%] h-[275px]"></div>
                    </div>

                    <div class="flex justify-center items-start self-stretch gap-2.5 pt-2">
                        <span class="text-gray-600 text-center text-xs leading-[18px] font-medium">{yTitle}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>