import './PieChart.css';
import React from 'react';
import { Tooltip } from '@mui/material';

export default function PieChart(props) {
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

    // The value for center point of the graph (x and y are the same)
    const center = 25;
    // Value of the (highest-100%) length of the graph
    const length = 20;

    // Find sum of all angles of categories up until lastIndex
    // Angles are in radian, full angle = 360 degree = 2pi radian
    const findSumAngle = (lastIndex, categories) => {
        let sum = 0;
        for (let i = 0; i < lastIndex; i++) {
            sum += categories[i].percent;
        }
        return sum / 100 * Math.PI * 2;
    }
    
    const positions = [...props.positions];
    const types = [...props.types];
    const companies = [...props.companies];

    // Categories length and range, used for mapping SVG
    const categoryLength = (categories) => {
        let range = [];
        for (let i = 0; i < categories.length; i++) {
            range.push(i);
        }
        return range;
    }
    const positionsRange = categoryLength(positions);
    const typesRange = categoryLength(types);
    const companiessRange = categoryLength(companies);

    // Anchors (length = categories length)
    let anchors_position = [];
    let anchors_type = [];
    let anchors_company = [];

    // Radius for each
    const positionRad = length;
    const typeRad = length * 2/3;
    const companyRad = length * 1/3;

    // In a way, this is finding a starting point of the data on the graph,
    // and draw from that starting point, to the next starting point,
    // to form a piece of data represents a categories,
    // which is why there is no need to find the last anchor, 
    // since it will collaspe with initial anchor (0 radian) anyways
    const addAnchors = (categories, radius) => {
        let anchors = [];
        for (let i = 0; i < categories.length; i++) {
            const anchor = findNewPoint({x: center, y: center}, 
                    findCoords(radius, findSumAngle(i, categories)))
            anchors.push(anchor);
        }
        return anchors;
    }
    anchors_position = addAnchors(positions, positionRad);
    anchors_type = addAnchors(types, typeRad);
    anchors_company = addAnchors(companies, companyRad);

    const compChart = (range, categories, anchors, radius) => {
        return (<g>
            {
            range.map(i => {
                return (<Tooltip title={`${categories[i].name}: ${Math.round(categories[i].percent)}%`}
                                    key={i}>
                        <path
                            d={` M ${anchors[i].x} ${anchors[i].y} 
                            A ${radius} ${radius} 
                            0 
                            ${categories[i].percent > 50 ? 1 : 0} 
                            0 
                            ${anchors[(i + 1) % categories.length].x} ${anchors[(i + 1) % categories.length].y} `}
                            fillOpacity={0}
                            stroke={findColor()}
                            strokeWidth='10%'
                            className='PieChartPath'
                        />
                    </Tooltip>)
                })
            }
        </g> )
    }

    const singChart = (categories, radius) => {
        return (<Tooltip title={`${categories[0].name}: ${Math.round(categories[0].percent)}%`}>
            <circle
                cx={center}
                cy={center}
                r={radius}
                fillOpacity={0}
                stroke={findColor()}
                strokeWidth='10%'
                className='PieChartPath'/>
        </Tooltip>)
    }

    const compPos = compChart(positionsRange, positions, anchors_position, positionRad);
    const singPos = singChart(positions, positionRad);

    const compTyp = compChart(typesRange, types, anchors_type, typeRad);
    const singTyp = singChart(types, typeRad);

    const compCom = compChart(companiessRange, companies, anchors_company, companyRad);
    const singCom = singChart(companies, companyRad);
    
    return (<svg className='PieChart' preserveAspectRatio='xMidYMid meet' viewBox="0 0 50 50" >
            {(anchors_position.length > 1) ? compPos : (anchors_position.length === 1) ? singPos : null}
            {(anchors_type.length > 1) ? compTyp : (anchors_type.length === 1) ? singTyp : null}
            {(anchors_company.length > 1) ? compCom : (anchors_company.length === 1) ? singCom : null}
        </svg>)
}