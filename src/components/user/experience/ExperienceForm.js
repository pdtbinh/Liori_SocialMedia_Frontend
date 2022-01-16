import React, { useState } from 'react';
import { useRouteContext } from '../../../providers/routeProvider/RouteProvider';
import AddIcon from '@mui/icons-material/Add';
import './ExperienceForm.css';
import ProjectCardPanel from '../project/ProjectCardPanel';

export default function ExperienceForm(props) {

    const [state, dispatch] = useRouteContext();

    const [show, setShow] = useState(false);

    const [position, setPosition] = useState('');
    const [type, setType] = useState('');
    const [company, setCompany] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('');
    const [location, setLocation] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [link, setLink] = useState('');

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
            `https://liori.herokuapp.com/api/experience/add`, 
            {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: state.user._id.toString(),
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
        dispatch({type: 'add_experience', experience: item.experience});
        reset('');
        hideForm();
    }

    const showForm = (evt) => {
        setShow(true);
    }

    const hideForm = (evt) => {
        setShow(false);
    }

    if (show) {
        return (
            <div className='ExperienceForm'>
                <ProjectCardPanel upper/>
                <div className='ExperienceContentForm'>
                    <p>Position</p>
                    <input 
                        onChange={handlePosition} 
                        placeholder='Title of the role' 
                        type="text"/>

                    <p>Type</p>
                    <input 
                        onChange={handleType} 
                        placeholder='The level of the position. Eg., Intern, Junior, Senior, etc.' 
                        type="text"/>
                
                    <p>Company</p>
                    <input 
                        onChange={handleCompany}  
                        placeholder='The company name' 
                        type="text"/>

                    <p>Time</p>
                    <input 
                        onChange={handleTime}  
                        placeholder='Start date - end date of this position'
                        type="text"/>

                    <p>Duration</p>
                    <input 
                        onChange={handleDuration}  
                        placeholder='Please enter duration in months'
                        type="text"/>

                    <p>Location</p>
                    <input 
                        onChange={handleLocation}  
                        placeholder='Location of the company'
                        type="text"/>
                
                    <p>Introduction</p>
                    <textarea 
                        rows="5" 
                        onChange={handleIntroduction} 
                        placeholder='Your responsibilities during this position' 
                        type="text">
                    </textarea>

                    <p>Link</p>
                    <input 
                        onChange={handleLink}  
                        placeholder='Certificate of employment'
                        type="text"/>

                    <div className='ExperienceFormButtons'>
                        <button className='ExperienceFormButton' onClick={submitProject}>Submit</button>  
                        <button className='ExperienceFormButton' onClick={hideForm}>Cancel</button>  
                    </div>
                </div>
                <ProjectCardPanel/>
            </div>
        );
    } else {
        return (
        
            <button onClick={showForm} className='AddExperienceButton'>
                <AddIcon className='AddExperienceIcon'/>
            </button>
        )
    }
}