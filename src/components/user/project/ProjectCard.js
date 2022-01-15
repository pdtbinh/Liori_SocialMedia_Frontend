import './ProjectCard.css';
import './ProjectForm.css';
import React, { useState } from 'react';
import { useRouteContext } from '../../../providers/routeProvider/RouteProvider';
import ProjectCardPanel from './ProjectCardPanel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function ProjectCard(props) {

    const [state, dispatch] = useRouteContext();

    const [edit, setEdit] = useState(false);

    const handleDelete = async () => {
        await fetch('https://liori.herokuapp.com/api/project/delete', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectID: props.project._id.toString(),
            })
        });
        dispatch({ type: 'delete_project', projectID: props.project._id.toString() })
    }

    const showEdit = () => {
        setEdit(true);
    }

    const hideEdit = () => {
        setEdit(false);
    }

    const openNewWindow = () => {
        window.open(props.project.link, '_blank');
    }

    if (!edit) {
        return (
            <div className='ProjectCard'>
                <ProjectCardPanel upper/>
                <div className='ProjectContent'>
                    <div className='ProjectTitle'>
                        <p className='ProTitleText'>{props.project.name}</p>
                        <div className='ProjectButtons'>
                            <button onClick={openNewWindow}>
                                <OpenInNewIcon/>
                            </button>
                            {(state.user && state.viewedUser && state.viewedUser._id.toString() === state.user._id.toString()) ?
                            <button>
                                <EditIcon onClick={showEdit}/>
                            </button> : null}
    
                            {(state.user && state.viewedUser && state.viewedUser._id.toString() === state.user._id.toString()) ?
                            <button onClick={handleDelete}>
                                <DeleteForeverIcon />
                            </button> : null}
                        </div>
                    </div>
                    <div>
                        <p>{props.project.introduction}</p>
                        <p><span className='ProjectTopics'>Tags: </span>{props.project.tags}</p>
                    </div>
                </div>
                <ProjectCardPanel/>
            </div>
        )
    } else {
        return <EditProjectForm project={props.project} hideEdit={hideEdit}/>
    }
    
}

function EditProjectForm(props) {

    const [state, dispatch] = useRouteContext();

    const [name, setName] = useState(props.project.name);
    const [introduction, setIntroduction] = useState(props.project.introduction);
    const [tags, setTags] = useState(props.project.tags);
    const [link, setLink] = useState(props.project.link);
    const [order, setOrder] = useState(parseInt(props.project.order));

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

    const submitProject = async (evt) => {
        evt.preventDefault();

        const fetchItem = await fetch(
            `https://liori.herokuapp.com/api/project/edit`, 
            {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectID: props.project._id.toString(),
                    name: name,
                    introduction: introduction,
                    tags: tags,
                    link: link,
                    order: parseInt(order),
                }),
            }
        )
        const item = await fetchItem.json();
        dispatch({type: 'edit_project', projectID: props.project._id.toString(), project: item.project});
        props.hideEdit();
    }

    
    return (
        <div className='ProjectForm'>
            <ProjectCardPanel upper/>
            <div className='ProjectContentForm'>
                <p>Project name</p>
                <input 
                    defaultValue={ props.project.name }
                    onChange={ handleName } 
                    placeholder='Title of the project' 
                    type="text"/>
            
                <p>Introduction</p>
                <textarea 
                    defaultValue={ props.project.introduction }
                    rows="5" 
                    onChange={ handleIntroduction } 
                    placeholder='Content of the project' 
                    type="text">
                </textarea>
            
                <p>Tags</p>
                <input 
                    defaultValue={ props.project.tags }
                    onChange={ handleTags } 
                    placeholder='Concepts involved, separated by comma' 
                    type="text"/>
            
                <p>Link</p>
                <input 
                    defaultValue={ props.project.link }
                    onChange={ handleLink }  
                    placeholder='Link to open the project' 
                    type="text"/>

                <p>Order</p>
                <input 
                    defaultValue={ props.project.order }
                    onChange={ handleOrder }  
                    placeholder='Number: Position in your projects list'
                    type="text"/>

                <div className='ProjectFormButtons'>
                    <button className='ProjectFormButton' onClick={submitProject}>Submit</button>  
                    <button className='ProjectFormButton' onClick={props.hideEdit}>Cancel</button>
                </div>
                
            </div>
            <ProjectCardPanel/>
        </div>
    );
}