import './UserPage.css';
import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useRouteContext } from "../../../providers/routeProvider/RouteProvider";
import { Grid } from '@mui/material';
import Projects from '../project/Projects';
import Info from '../info/Info';
import Educations from '../education/Educations';
import Experiences from '../experience/Experiences';

export default function UserPage(props) {

    const location = useLocation();

    const [message, setMessage] = useState('Loading...');

    const findUserID = () => {
        let parts = location.pathname.split('/');
        return parts[parts.indexOf('user') + 1];
    }

    const [state, dispatch] = useRouteContext();

    useEffect(() => {
        fetchViewedUser();
        dispatch({ type: 'route', route: location.pathname });
    }, []);

    // Fetch all users
    const fetchViewedUser = async () => {
        const fetchItem = await fetch(`https://liori.herokuapp.com/api/user/${findUserID()}`);
        const item = await fetchItem.json();
        if (item.user) {
            dispatch(
                {   type: 'view', 
                    viewedUser: item.user,
                    //viewedInfo: item.info,
                    viewedEducations: item.educations,
                    viewedExperiences: item.experiences,
                    viewedProjects: item.projects,
                    viewedCertificates: item.certificates,
                    viewedLikes: item.likes,
                }
            );
        } else {
            setMessage('404: Sorry, there is no such user :-(');
        }
        
    }

    if (state.viewedUser && state.viewedUser._id.toString() === findUserID()) {
        return (
            <div className='UserPage'>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Info user={state.viewedUser} certificates={state.viewedCertificates}/>
                        <Projects projects={state.viewedProjects}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Educations educations={state.viewedEducations}/>
                        <Experiences experiences={state.viewedExperiences}/>
                    </Grid>
                </Grid>
            </div>)
    } else {
        return (
            <div className='UserLoadingDiv'>
                <div className='UserLoadingPanel'>
                    <p>{message}</p>
                </div>
            </div>);
        
    }
    
}