import React, { useState } from 'react';
import { useRouteContext } from '../../../providers/routeProvider/RouteProvider';
import AddIcon from '@mui/icons-material/Add';
import './EducationForm.css';
import ProjectCardPanel from '../project/ProjectCardPanel';

export default function EducationForm(props) {

    const [state, dispatch] = useRouteContext();

    const [show, setShow] = useState(false);

    const [degree, setDegree] = useState('');
    const [time , setTime] = useState('');
    const [institution, setInstitution] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [focus, setFocus] = useState('');

    const handleDegree = (evt) => {
        setDegree(evt.target.value);
    }

    const handleTime = (evt) => {
        setTime(evt.target.value);
    }

    const handleInstitution = (evt) => {
        setInstitution(evt.target.value);
    }

    const handleIntroduction = (evt) => {
        setIntroduction(evt.target.value);
    }

    const handleFocus = (evt) => {
        setFocus(evt.target.value);
    }

    const reset = (value) => {
       
    }

    const submitEducation = async (evt) => {
        evt.preventDefault();

        const fetchItem = await fetch(
            `https://liori.herokuapp.com/api/education/add`, 
            {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: state.user._id.toString(),
                    degree: degree,
                    time: time,
                    institution: institution,
                    introduction: introduction,
                    focus: focus,
                }),
            }
        )
        const item = await fetchItem.json();
        dispatch({type: 'add_education', education: item.education});
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
            <div className='EducationForm'>
                <ProjectCardPanel upper/>
                <div className='EducationContentForm'>
                    <p>Degree</p>
                    <input 
                        onChange={handleDegree} 
                        placeholder='Eg., Master of Computer Science' 
                        type="text"/>

                    <p>Time</p>
                    <input 
                        onChange={handleTime} 
                        placeholder='Start date - End date' 
                        type="text"/>

                    <p>Institution</p>
                    <input 
                        onChange={handleInstitution}  
                        placeholder='Where the degree is provided' 
                        type="text"/>
                
                    <p>Introduction</p>
                    <textarea 
                        rows="5" 
                        onChange={handleIntroduction} 
                        placeholder='Eg., thesis topics, study content, etc.' 
                        type="text">
                    </textarea>
                
                    <p>Degree focuses</p>
                    <textarea 
                        rows="5" 
                        onChange={handleFocus} 
                        placeholder='How much the degree focuses on each subfield? Eg., OOP Programming - 50%, Mathematics - 50%.
                        Input format: Subfield and percentage are separated by hyphen (-), focuses are separated by comma (,), percentage sign (%) is not mandantory after number.' 
                        type="text">
                    </textarea>

                    <div className='EducationFormButtons'>
                        <button className='EducationFormButton' onClick={submitEducation}>Submit</button>  
                        <button className='EducationFormButton' onClick={hideForm}>Cancel</button>  
                    </div>
                </div>
                <ProjectCardPanel/>
            </div>
        );
    } else {
        return (
            <div className='AddEducationButtonDiv'>
                <button onClick={showForm} className='AddEducationButton'>
                    <AddIcon className='AddEducationIcon'/>
                </button>
            </div>
            
        )
    }
}