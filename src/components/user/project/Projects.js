import React from 'react';
import ProjectForm from "./ProjectForm";
import { useRouteContext } from "../../../providers/routeProvider/RouteProvider";
import './Projects.css';
import ProjectCard from './ProjectCard';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Tooltip } from '@mui/material';
import ColumnChart from './ColumnChart';

export default function Projects(props) {

    const [state, dispatch] = useRouteContext();
    
    let tags = [];
    for (const project of props.projects) {
        // Extract tags to array
        const projectTags = project.tags.toLowerCase().split(',').map(
            tag => { 
                return tag.trim(); 
            }
        );
        for (const tag of projectTags) {
            const index = tags.findIndex(el => el.name === tag);
            if (index < 0) {
                tags.push({ name: tag, 
                    percent: 1 / props.projects.length * 100,
                    order: project.order})
            } else {
                const currentPercent = tags[index].percent;
                const newPercent = currentPercent + 1 / props.projects.length * 100;

                const currentOrder = tags[index].order * currentPercent / 100 * props.projects.length ;
                const newOrder = (currentOrder + project.order) / (newPercent / 100 * props.projects.length );

                tags[index] = { name: tag, percent: newPercent, order: newOrder};
            }
        }
    }

    return (
        <div className='Projects'>
            <div className='ProjectCardsCollection'>
                <p className='ProjectsTitle'>PROJECTS</p>
                { 
                    props.projects.sort((a, b) => parseInt(a.order) - parseInt(b.order)).map(
                        project => {
                            return <ProjectCard project={project} key={project._id}/>
                        }
                    ) 
                }
                { 
                    (state.user && state.viewedUser && state.viewedUser._id.toString() === state.user._id.toString()) ? 
                        <ProjectForm/> 
                    : null 
                }
            </div>
            <div className='ProjectsChart'>
                <div className='ProTitleAndHelp'>
                    <p className='ProSummaryTitle'>SUMMARY</p>
                    <Tooltip title='The chart shows how often each tag appears (in %), and its average order (tags being put on top of the list will have lower order). Hover on the columns and points to see the annotations.'>
                        <HelpOutlineIcon className='ProHelpIcon'/>
                    </Tooltip>
                </div>
                <div className='ColumnChartDiv'>
                    <ColumnChart tags={tags}/>
                    <p>Tags and Orders</p>
                </div>
            </div>
        </div>
    ); 
}
