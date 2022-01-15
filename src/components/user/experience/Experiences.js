import React from 'react';
import { useRouteContext } from "../../../providers/routeProvider/RouteProvider";
import './Experiences.css';
import PieChart from './PieChart';
import ExperienceForm from './ExperienceForm';
import ExperienceCard from './ExperienceCard';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Tooltip } from '@mui/material';


export default function Experiences(props) {

    const [state, dispatch] = useRouteContext();

    let positions = [];
    let types = [];
    let companies= [];

    // Find a specific section and update the data list
    const updateData = (initialData, exp, section, timeLength) => {
        let data = [...initialData];
        const index = data.findIndex(e => e.name === exp[section]);
        if (index < 0) {
            data.push({name: exp[section], 
                percent: exp.duration / timeLength * 100});
        } else {
            const currentPercent = data[index].percent;
            data[index] = {name: exp[section], 
                percent: currentPercent + exp.duration / timeLength * 100};
        }
        return data;
    }

    if (props.experiences.length > 0) {
        // Total duration, in months
        const timeLength = props.experiences.map(exp => exp.duration).reduce((a, b) => a + b);
        
        // Add data to data lists
        for (let exp of props.experiences) {
            positions = updateData(positions, exp, 'position', timeLength);
            types = updateData(types, exp, 'type', timeLength);
            companies = updateData(companies, exp, 'company', timeLength);
        }
    }

    return (
        <div className='Experiences'>
            <div className='ExperienceCardsCollection'>
                <p className='ExperiencesTitle'>EXPERIENCES</p>
                { 
                    props.experiences.map(
                        experience => {
                            return <ExperienceCard experience={experience} key={experience._id}/>
                        }
                    ) 
                }
                { 
                    (state.user && state.viewedUser && state.viewedUser._id.toString() === state.user._id.toString()) ? 
                        <ExperienceForm/> 
                    : null 
                }
            </div>
            <div className='ExperiencesChart'>
                <div className='ExpTitleAndHelp'>
                    <p className='ExpSummaryTitle'>SUMMARY</p>
                    <Tooltip title='The charts summarize past and current employment status. Hover on the pie compositions to see the annotations.'>
                        <HelpOutlineIcon className='ExpHelpIcon'/>
                    </Tooltip>
                </div>
                {(positions.length > 0 && types.length > 0 && companies.length > 0) ? 
                    <div className='PieChartDiv'>
                        <PieChart positions={positions} types={types} companies={companies}/>
                        <p>Employment Status</p>
                    </div>
                : null}
            </div>
        </div>
    );
}