import React from 'react';
import { useRouteContext } from "../../../providers/routeProvider/RouteProvider";
import './Educations.css';
import WebChart from './WebChart';
import EducationForm from './EducationForm';
import EducationCard from './EducationCard';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Tooltip } from '@mui/material';

export default function Educations(props) {
    const [state, dispatch] = useRouteContext();

    return (
        <div className='Educations'>
            <div className='EduTitleAndHelp'>
                <p className='EducationsTitle'>EDUCATIONS</p>
                <Tooltip title='The charts show how much each degree focuses on the subfileds (in %). Hover onto the edges and points of the graphs to see the annotations'>
                    <HelpOutlineIcon className='EduHelpIcon'/>
                </Tooltip>
            </div>
            { props.educations.map(education => {
                return (<div className='EducationsDiv' key={education._id.toString()}>
                    <EducationCard education={education}/>
                    <div className='WebChartDiv'>
                        <WebChart focus={education.focus}/>
                        <p>Degree focus</p>
                    </div>   
                </div>)
            }) }
            { 
                (state.user && state.viewedUser && state.viewedUser._id.toString() === state.user._id.toString()) ? 
                    <EducationForm/> 
                : null 
            }
        </div>
    );
}