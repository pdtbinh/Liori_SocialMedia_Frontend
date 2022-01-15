import './WebChart.css';
import React from 'react';
import { Tooltip } from '@mui/material';

export default function WebChart(props) {
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

    // This function find the coordinates of the vector 
    // that is aplpha degree away from an initial vector
    const findCoords = (side, angle) => {
        const x = Math.abs(side * Math.cos(angle) * Math.sin(angle));
        const y = Math.abs(side * Math.cos(angle) * Math.cos(angle));
        const vecLen = Math.sqrt(x * x + y * y);
        const scaledX = Math.abs(x / vecLen * side);
        const scaledY = Math.abs(y / vecLen * side);
        if (angle <= Math.PI / 2) {
            return {
                x: scaledX,
                y: scaledY,
            };
        }
        else if (angle >= Math.PI / 2 && angle <= Math.PI) {
            return {
                x: scaledX,
                y: -scaledY,
            };
        }
        else if (angle >= Math.PI && angle <= Math.PI * 3/2) {
            return {
                x: -scaledX,
                y: -scaledY,
            };
        }
        else {
            return {
                x: -scaledX,
                y: scaledY,
            };
        }
    }

    // This is to find the coords of the point at the end of the vector calc above,
    // to be filled in ' L x_coord y_coord '
    const findNewPoint = (from, vector) => {
        const newX = from.x + vector.x;
        const newY = from.y + vector.y;
        return { x: newX, y: newY };
    }

    // The frame anchors are equally distant from the center,
    // so only 1 distance is specified: side.
    // The data anchors, however, are at different distances from the center,
    // hence, the sides are contained in 'sides'
    const findFrameAnchors = (from, side, nofAngles) => {
        let anchors = [];
        for (let i = 0; i < nofAngles; i++) {
            const angle = 2 * Math.PI / nofAngles * i
            const anchor = findNewPoint(from, findCoords(side, angle));
            anchors.push(anchor);
        }
        return anchors;
    }

    // The frame anchors are equally distant from the center,
    // so only 1 distance is specified: side.
    // The data anchors, however, are at different distances from the center,
    // hence, the sides are contained in 'sides'
    const findDataAnchors = (from, sides, nofAngles) => {
        let anchors = [];
        for (let i = 0; i < nofAngles; i++) {
            const angle = 2 * Math.PI / nofAngles * i
            // this is where this method is different from findFrameAnchors
            const side = sides[i] / maxPercent * length;
            const anchor = findNewPoint(from, findCoords(side, angle));
            anchors.push(anchor);
        }
        return anchors;
    }

    // Extracted from props
    let focuses = [];
    const fields = props.focus.split(',').map(e => e.trim());
    for (let field of fields) {
        const [name, percent] = field.split('-').map(e => e.trim());
        focuses.push({ name: name, percent: parseFloat(percent)})
    }
    
    // Check if focuses are valid, otherwise, do not draw chart
    const focusesIsValid = () => {
        // First check the length of focuses
        if (!(focuses.length > 0)) {
            return false;
        }
        // Then check each focus inside focuses
        for (let focus of focuses) {
            if (!focus.name || !focus.percent) {
                return false;
            } else {
                if (isNaN(focus.percent)) {
                    return false;
                }
            }
        }
        // If all requirements passed, draw chart
        return true;
    }
    
    // The value for center point of the graph (x and y are the same)
    const center = 16;
    // Value of the (highest-100%) length of the graph
    const length = 14;

    // All sections from props
    let sections = null;

    // Max percentage
    let maxPercent = null;

    // Number of angles (from props, based on each education document)
    let angles = null;
    let anglesRange = null;

    // 100% frame
    let frame_100 = null;
    // 50% frame
    let frame_50 = null;
    // Data
    let data = null;

    if (focuses.length > 0) {
        // All sections from props
        sections = focuses;

        // Max percentage
        maxPercent = [...focuses].sort((a, b) => b.percent - a.percent)[0].percent;

        // Number of angles (from props, based on each education document)
        angles = sections.length;
        anglesRange = []
        for (let i = 0; i < angles; i++) {
            anglesRange.push(i);
        }

        // 100% frame
        frame_100 = findFrameAnchors({x: center, y: center}, length, angles);
        // 50% frame
        frame_50 = findFrameAnchors({x: center, y: center}, length / 2, angles);
        // Data
        data = findDataAnchors({x: center, y: center}, sections.map(e => e.percent), angles)
    }

    if (focusesIsValid()) {
        return (
            <svg className='WebChart'  preserveAspectRatio='xMidYMid meet' viewBox="0 0 31 31" >
                {/* Draw snowflake (center-out) frame */}
                { anglesRange.map(
                    i => {
                        return (<Tooltip 
                            title={`${sections[i].name}`}
                            key={i}>
                                <line
                                    className='FrameLine'
                                    x1={center} 
                                    y1={center}
                                    x2={frame_100[i].x} 
                                    y2={frame_100[i].y}
                                    stroke={findColor()}
                                />            
                        </Tooltip>)
                    }
                )}
                
                {/* Draw web (side-to-side) 100% frame */}
                {
                    anglesRange.map(
                        i => {
                            return (<Tooltip
                                title={`${maxPercent}%`}
                                key={i}>
                                <line
                                    className='FrameLine'
                                    x1={frame_100[i].x} 
                                    y1={frame_100[i].y}
                                    x2={frame_100[(i + 1) % angles].x} 
                                    y2={frame_100[(i + 1) % angles].y}
                                    stroke='pink'
                                    key={i}
                                />
                            </Tooltip>)
                        }
                    )
                }

                {/* Draw web (side-to-side) 50% frame */}
                {
                    anglesRange.map(
                        i => {
                            return (<Tooltip
                                title={`${Math.round(maxPercent/2)}%`}
                                key={i}>
                                <line
                                    className='FrameLine'
                                    x1={frame_50[i].x} 
                                    y1={frame_50[i].y}
                                    x2={frame_50[(i + 1) % angles].x} 
                                    y2={frame_50[(i + 1) % angles].y}
                                    stroke='yellowGreen'
                                    key={i}
                                />
                            </Tooltip>)
                        }
                    )
                }

                {/* Draw data */}
                {
                    anglesRange.map(
                        i => {
                            return (<Tooltip
                                title={`${
                                    sections[i].name
                                } ${
                                    (sections[i].percent > sections[(i + 1) % angles].percent) ? '>'
                                    : (sections[i].percent < sections[(i + 1) % angles].percent) ? '<' 
                                    : '='
                                } ${
                                    sections[(i + 1) % angles].name}`
                                }
                                key={i}>
                                <line
                                    className='DataLine'
                                    x1={data[i].x} 
                                    y1={data[i].y}
                                    x2={data[(i + 1) % angles].x} 
                                    y2={data[(i + 1) % angles].y}
                                    stroke='red'
                                />
                            </Tooltip>)
                        }
                    )
                }

                {/* Draw data points*/}
                {
                    anglesRange.map(
                        i => {
                            return (<Tooltip 
                                title={`${sections[i].name}: ${sections[i].percent}%`}
                                key={i}>
                                <circle
                                    cx={data[i].x} 
                                    cy={data[i].y}
                                    r="2.5%"
                                    stroke='red'
                                    strokeWidth="1.5%"
                                    fill='yellow'
                                />
                            </Tooltip>)
                        }
                    )
                }
            </svg>
        );
    } else {
        return (<h1>Data unavailable</h1>)
    }
    
}