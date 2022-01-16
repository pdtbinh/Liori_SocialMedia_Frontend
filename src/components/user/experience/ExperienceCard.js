import './ExperienceCard.css';
import './ExperienceForm.css';
import React, { useState } from 'react';
import { useRouteContext } from '../../../providers/routeProvider/RouteProvider';
import ProjectCardPanel from '../project/ProjectCardPanel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function ExperienceCard(props) {

    const [state, dispatch] = useRouteContext();

    const [edit, setEdit] = useState(false);

    const handleDelete = async () => {
        await fetch('https://liori.herokuapp.com/api/experience/delete', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                experienceID: props.experience._id.toString(),
            })
        });
        dispatch({ type: 'delete_experience', experienceID: props.experience._id.toString() })
    }

    const showEdit = () => {
        setEdit(true);
    }

    const hideEdit = () => {
        setEdit(false);
    }


    const openNewWindow = () => {
        window.open(props.experience.link, '_blank');
    }

    if (!edit) {
        return (
            <div className='ExperienceCard'>
                <ProjectCardPanel upper/>
                <div className='ExperienceContent'>
                    <div className='ExperienceTitle'>
                        <p className='ExpTitleText'>{props.experience.position}</p>
                        <div className='ExperienceButtons'>
                            <button onClick={openNewWindow}>
                                <OpenInNewIcon/>
                            </button>

                            {(state.user && state.viewedUser && state.viewedUser._id.toString() === state.user._id.toString()) ?
                            <button>
                                <EditIcon onClick={showEdit}/> 
                            </button> : null}

                            {(state.user && state.viewedUser && state.viewedUser._id.toString() === state.user._id.toString()) ?
                            <button onClick={handleDelete}>
                                <DeleteForeverIcon/>
                            </button>: null}
                        </div>
                    </div>
                    <div>
                        <p className='ExpCompany'>{props.experience.company} &#183; {props.experience.type}</p>
                        <p className='ExpTimeLocation'>{props.experience.time} &#183; {props.experience.duration} mos</p>
                        <p className='ExpTimeLocation'>{props.experience.location}</p>
                        <p>{props.experience.introduction}</p>
                    </div>
                </div>
                <ProjectCardPanel/>
            </div>
        )
    } else {
        return <EditExperienceForm experience={props.experience} hideEdit={hideEdit}/>
    }
    
}

function EditExperienceForm(props) {

    const [state, dispatch] = useRouteContext();

    const [position, setPosition] = useState(props.experience.position);
    const [type, setType] = useState(props.experience.type);
    const [company, setCompany] = useState(props.experience.company);
    const [time, setTime] = useState(props.experience.time);
    const [duration, setDuration] = useState(props.experience.duration);
    const [location, setLocation] = useState(props.experience.location);
    const [introduction, setIntroduction] = useState(props.experience.introduction);
    const [link, setLink] = useState(props.experience.link);

    const handlePosition = (evt) => {
        setPosition(evt.target.value);
    }

    const handleIntroduction = (evt) => {
        setIntroduction(evt.target.value);
    }

    const handleLink = (evt) => {
        setLink(evt.target.value);
    }

    const handleType = (evt) => {
        setType(evt.target.value);
    }

    const handleCompany = (evt) => {
        setCompany(evt.target.value);
    }

    const handleTime = (evt) => {
        setTime(evt.target.value);
    }

    const handleDuration = (evt) => {
        setDuration(evt.target.value);
    }

    const handleLocation = (evt) => {
        setLocation(evt.target.value);
    }

    const reset = (value) => {
    }

    const submitProject = async (evt) => {
        evt.preventDefault();

        const fetchItem = await fetch(
            `https://liori.herokuapp.com/api/experience/edit`, 
            {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    experienceID: props.experience._id.toString(),
                    position: position,
                    type: type,
                    company: company,
                    time: time,
                    duration: duration,
                    location: location,
                    introduction: introduction,
                    link: link,
                }),
            }
        )
        const item = await fetchItem.json();
        dispatch({type: 'edit_experience', experienceID: props.experience._id.toString(), experience: item.experience});
        props.hideEdit();
    }

    return (
        <div className='ExperienceForm'>
            <ProjectCardPanel upper/>
            <div className='ExperienceContentForm'>
                <p>Position</p>
                <input 
                    defaultValue={props.experience.position}
                    onChange={handlePosition} 
                    placeholder='Title of the role' 
                    type="text"/>

                <p>Type</p>
                <input 
                    defaultValue={props.experience.type}
                    onChange={handleType} 
                    placeholder='The level of the position. Eg., Intern, Junior, Senior, etc.' 
                    type="text"/>
            
                <p>Company</p>
                <input 
                    defaultValue={props.experience.company}
                    onChange={handleCompany}  
                    placeholder='The company name' 
                    type="text"/>

                <p>Time</p>
                <input 
                    defaultValue={props.experience.time}
                    onChange={handleTime}  
                    placeholder='Start date - end date of this position'
                    type="text"/>

                <p>Duration</p>
                <input 
                    defaultValue={props.experience.duration}
                    onChange={handleDuration}  
                    placeholder='Please enter duration in months'
                    type="text"/>

                <p>Location</p>
                <input 
                    defaultValue={props.experience.location}
                    onChange={handleLocation}  
                    placeholder='Location of the company'
                    type="text"/>
            
                <p>Introduction</p>
                <textarea 
                    defaultValue={props.experience.introduction}
                    rows="5" 
                    onChange={handleIntroduction} 
                    placeholder='Your responsibilities during this position' 
                    type="text">
                </textarea>

                <p>Link</p>
                <input 
                    defaultValue={props.experience.link}
                    onChange={handleLink}  
                    placeholder='Certificate of employment'
                    type="text"/>

                <div className='ExperienceFormButtons'>
                    <button className='ExperienceFormButton' onClick={submitProject}>Submit</button>  
                    <button className='ExperienceFormButton' onClick={props.hideEdit}>Cancel</button>  
                </div>
            </div>
            <ProjectCardPanel/>
        </div>
    );
}