import React, { useState } from 'react';
import { useRouteContext } from '../../../providers/routeProvider/RouteProvider';
import AddIcon from '@mui/icons-material/Add';
import './ProjectForm.css';
import ProjectCardPanel from './ProjectCardPanel';

export default function ProjectForm(props) {

    const [state, dispatch] = useRouteContext();

    const [show, setShow] = useState(false);

    const [name, setName] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [tags, setTags] = useState('');
    const [link, setLink] = useState('');
    const [order, setOrder] = useState(1);

    const handleName = (evt) => {
        setName(evt.target.value);
    }

    const handleIntroduction = (evt) => {
        setIntroduction(evt.target.value);
    }

    const handleTags = (evt) => {
        setTags(evt.target.value);
    }

    const handleLink = (evt) => {
        setLink(evt.target.value);
    }

    const handleOrder = (evt) => {
        const text = evt.target.value;
        const number = parseInt(text);
        setOrder(!isNaN(number) ? number : 1);
    }

    const reset = (value) => {
        setName(value);
        setIntroduction(value);
        setLink(value);
    }

    const submitProject = async (evt) => {
        evt.preventDefault();

        const fetchItem = await fetch(
            `https://liori.herokuapp.com/api/project/add`, 
            {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: state.user._id.toString(),
                    name: name,
                    introduction: introduction,
                    tags: tags,
                    link: link,
                    order: parseInt(order),
                }),
            }
        )
        const item = await fetchItem.json();
        dispatch({type: 'add_project', project: item.project});
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
            <div className='ProjectForm'>
                <ProjectCardPanel upper/>
                <div className='ProjectContentForm'>
                    <p>Project name</p>
                    <input 
                        onChange={handleName} 
                        placeholder='Title of the project' 
                        type="text"/>
                
                    <p>Introduction</p>
                    <textarea 
                        rows="5" 
                        onChange={handleIntroduction} 
                        placeholder='Content of the project' 
                        type="text">
                    </textarea>
                
                    <p>Tags</p>
                    <input 
                        onChange={handleTags} 
                        placeholder='Concepts involved, separated by comma' 
                        type="text"/>
                
                    <p>Link</p>
                    <input 
                        onChange={handleLink}  
                        placeholder='Link to open the project' 
                        type="text"/>

                    <p>Order</p>
                    <input 
                        onChange={handleOrder}  
                        placeholder='Number: Position in your projects list'
                        type="text"/>

                    <div className='ProjectFormButtons'>
                        <button className='ProjectFormButton' onClick={submitProject}>Submit</button>  
                        <button className='ProjectFormButton' onClick={hideForm}>Cancel</button>  
                    </div>
                </div>
                <ProjectCardPanel/>
            </div>
        );
    } else {
        return (
        
            <button onClick={showForm} className='AddProjectButton'>
                <AddIcon className='AddProjectIcon'/>
            </button>
        )
    }
}