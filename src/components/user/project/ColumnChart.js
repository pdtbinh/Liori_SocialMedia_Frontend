import './ColumnChart.css';
import React from 'react';
import { Tooltip } from '@mui/material';

export default function ColumnChart(props) {
    // This part make sure no color collapses and get too dark:
    // * Store all current colors, to make sure next genereated color does not collapses
    let colors = []  
    // * Use to check if two colors collapse
    const minColorDist = 200;
    const colorDistValid = ([r1, g1, b1]) => {
        for (let color of colors) {
            const [r2, g2, b2] = color;
            const rDist = (r1 - r2) * (r1 - r2);
            const gDist = (g1 - g2) * (g1 - g2);
            const bDist = (b1 - b2) * (b1 - b2);
            if (Math.sqrt(rDist + gDist + bDist) < minColorDist) {
                return false;
            }
        }
        return true;
    }

    // * This makes sure no color gets too dark
    const minColorBright = 100;
    const colorBrightEnough = ([r, g, b]) => {
        return (r + g + b) / 3 > minColorBright;
    }

    // Generate the next random color
    const findColor = () => {
        // Start off as [0,0,0], so it will be too dark
        let r = 0;
        let g = 0;
        let b = 0;
        // Keep generating until color is valid
        let count = 0; // This is a safe precedure to make sure nothing loops forever
        while ( count < 100 && (!colorDistValid([r,g,b]) || !colorBrightEnough([r,g,b])) ) {
            r = Math.min(Math.random() * 255 + Math.random() * 50, 255);
            g = Math.min(Math.random() * 255 + Math.random() * 50, 255);
            b = Math.min(Math.random() * 255 + Math.random() * 50, 255);
            count += 1
        }
        // Add valid color for later comparision
        colors.push([r,g,b]);
        return `rgb(${r}, ${g}, ${b})`;
    }

    const tags = [...props.tags].sort((a,b) => a.name.localeCompare(b.name));

    let tagMaxPercent = 100;
    let tagMaxOrder = 5;

    if (tags.length > 0) {
        tagMaxPercent = Math.min([...tags].sort((a, b) => b.percent - a.percent)[0].percent + 5, 100);
        tagMaxOrder = [...tags].sort((a, b) => b.order - a.order)[0].order + 1;
    }

    let tagsRange = []
    for (let i = 0; i < tags.length; i++) {
        tagsRange.push(i + 1);
    }

    const xViewBox = 120;
    const yViewBox = Math.min(40 * tags.length, 200);

    const frameWidth = 0.15;

    const xLength = xViewBox - 20;
    const yLength = yViewBox - 20;

    const xStart = 10;
    const yStart = 10;

    const xEnd = xStart + xLength;
    const yEnd = yStart + yLength;

    const xLines = 4;
    let xLinesRange = [];
    for (let i = 0; i <= xLines; i++) {
        xLinesRange.push(i);
    }
    const xStep = xLength / xLines;
    const yStep = yLength / (tags.length + 1);

    const colWidth = yStep / 2;

    const lineChartPath = () => {
        let path = '';
        for (let i = 0; i < tags.length; i++) {
            const add = ` ${(i === 0) ? 'M ' : 'L'} 
            ${tags[i].order / tagMaxOrder * xLength + xStart} 
            ${yStart + yStep * (i+1)} `
            path = path.concat(add);
        }
        return path;
    }

    
    return (
        <svg 
            className='ColumnChart' 
            preserveAspectRatio='xMidYMin meet' 
            viewBox={`0 0 ${xViewBox} ${yViewBox}`}
            >
            <path
                d={` M ${xStart} ${yStart} L ${xEnd} ${yStart} 
                M ${xStart} ${yEnd} L ${xEnd} ${yEnd} `}
                fillOpacity={0}
                strokeWidth={`fit-content`}
                stroke='white'
                strokeOpacity={0.1}
            />
            {
                xLinesRange.map(xl => {
                    return (<g key={xl}>
                        <path
                            d={` M ${xStart + xStep * xl} ${yStart} L ${xStart + xStep * xl} ${yEnd} `}
                            fillOpacity={0}
                            strokeWidth={`${frameWidth}%`}
                            stroke='white'
                        />
                        <text 
                            textAnchor="middle" 
                            x={xLength / xLines * xl + xStart} 
                            y={yStart - 1}
                            className='ColumnText'
                            >
                            {Math.round(tagMaxPercent/xLines * xl)}%
                        </text>
                        <text 
                            textAnchor="middle" 
                            x={xLength / xLines * xl + xStart} 
                            y={yEnd + 2}
                            className='ColumnText'
                            >
                            {(tagMaxOrder/xLines * xl).toFixed(1)}
                        </text>
                    </g>)
                })
            }

            {
                tagsRange.map(i => {
                    return (<g key={i}>
                        <path
                            d={` M ${xStart} ${yStart + yStep * i} L ${xEnd} ${yStart + yStep * i} 
                            `}
                            fillOpacity={0}
                            strokeWidth={`${frameWidth}%`}
                            stroke='white'
                        />
                        <Tooltip title={`${tags[i-1].name}: ${tags[i-1].percent.toFixed(1)}%`}>
                            <path
                                d={` M ${xStart + xViewBox * frameWidth / 100 / 2} ${yStart + yStep * i} 
                                    L ${xStart + xViewBox * frameWidth / 100 / 2 + tags[i-1].percent/tagMaxPercent * xLength} ${yStart + yStep * i} `}
                                fillOpacity={0}
                                stroke={findColor()}
                                strokeWidth='5%'
                                className='ColumnChartPath'
                            />
                        </Tooltip>
                        
                    </g>)
                })
            }
            <path 
                d={lineChartPath()}
                fillOpacity={0}
                stroke='orange'
            />
            {
                tagsRange.map(i => {
                    return (<Tooltip key={i} title={`${tags[i-1].name}: order ${tags[i-1].order.toFixed(1)}`}>
                            <circle
                                cx={tags[i-1].order / tagMaxOrder * xLength + xStart} 
                                cy={yStart + yStep * i}
                                r='2%' 
                                fillOpacity={1}
                                fill='red'
                                stroke='purple'
                                strokeWidth='1%'
                                className='ColumnChartCircle'
                            />
                        </Tooltip>)
                })
            }
        </svg>)      
}