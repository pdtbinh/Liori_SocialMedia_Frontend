import './EducationCard.css';
import './EducationForm.css';
import React, { useState } from 'react';
import { useRouteContext } from '../../../providers/routeProvider/RouteProvider';
import ProjectCardPanel from '../project/ProjectCardPanel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function EducationCard(props) {

    const [state, dispatch] = useRouteContext();

    const [edit, setEdit] = useState(false);

    const handleDelete = async () => {
        await fetch('https://liori.herokuapp.com/api/education/delete', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                educationID: props.education._id.toString(),
            })
        });
        dispatch({ type: 'delete_education', educationID: props.education._id.toString() })
    }

    const showEdit = () => {
        setEdit(true);
    }

    const hideEdit = () => {
        setEdit(false);
    }

    if (!edit) {
        return (
            <div className='EducationCard'>
                <ProjectCardPanel upper/>
                <div className='EducationContent'>
                    <div className='EducationTitle'>
                        <p className='EduTitleText'>{props.education.institution}</p>
                        {(state.user && state.viewedUser && state.viewedUser._id.toString() === state.user._id.toString()) ?
                        <div className='EducationButtons'>
                            <button>
                                <EditIcon onClick={showEdit}/>
                            </button>
                            <button onClick={handleDelete}>
                                <DeleteForeverIcon/>
                            </button>
                        </div> : null}
                    </div> 
                    <div>
                        <p className='Degree'>{props.education.degree}</p>
                        <p className='EduTime'>{props.education.time}</p>
                        <p>{props.education.introduction}</p>
                    </div>
                </div>
                <ProjectCardPanel/>
            </div>
        )
    } else {
        return <EditEducationForm education={props.education} hideEdit={hideEdit}/>
    }
    
}

function EditEducationForm(props) {

    const [state, dispatch] = useRouteContext();

    const [degree, setDegree] = useState(props.education.degree);
    const [time , setTime] = useState(props.education.time);
    const [institution, setInstitution] = useState(props.education.institution);
    const [introduction, setIntroduction] = useState(props.education.introduction);
    const [focus, setFocus] = useState(props.education.focus);

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

    const submitEducation = async (evt) => {
        evt.preventDefault();

        const fetchItem = await fetch(
            `https://liori.herokuapp.com/api/education/edit`, 
            {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    educationID: props.education._id.toString(),
                    degree: degree,
                    time: time,
                    institution: institution,
                    introduction: introduction,
                    focus: focus,
                }),
            }
        )
        const item = await fetchItem.json();
        dispatch({type: 'edit_education', educationID: props.education._id.toString(), education: item.education});
        props.hideEdit();
    }

    
    return (
        <div className='EducationForm'>
            <ProjectCardPanel upper/>
            <div className='EducationContentForm'>
                <p>Degree</p>
                <input 
                    defaultValue={props.education.degree}
                    onChange={handleDegree} 
                    placeholder='Eg., Master of Computer Science' 
                    type="text"/>

                <p>Time</p>
                <input 
                    defaultValue={props.education.time}
                    onChange={handleTime} 
                    placeholder='Start date - End date' 
                    type="text"/>

                <p>Institution</p>
                <input 
                    defaultValue={props.education.institution}
                    onChange={handleInstitution}  
                    placeholder='Where the degree is provided' 
                    type="text"/>
            
                <p>Introduction</p>
                <textarea 
                    defaultValue={props.education.introduction}
                    rows="5" 
                    onChange={handleIntroduction} 
                    placeholder='Eg., thesis topics, study content, etc.' 
                    type="text">
                </textarea>
            
                <p>Degree focuses</p>
                <textarea 
                    defaultValue={props.education.focus}
                    rows="5" 
                    onChange={handleFocus} 
                    placeholder='How much the degree focuses on each subfield? Eg., OOP Programming - 50%, Mathematics - 50%.
                    Input format: Subfield and percentage are separated by hyphen (-), focuses are separated by comma (,), percentage sign (%) is not mandantory after number.' 
                    type="text">
                </textarea>

                <div className='EducationFormButtons'>
                    <button className='EducationFormButton' onClick={submitEducation}>Submit</button>  
                    <button className='EducationFormButton' onClick={props.hideEdit}>Cancel</button>
                </div>
                
            </div>
            <ProjectCardPanel/>
        </div>
    );
}