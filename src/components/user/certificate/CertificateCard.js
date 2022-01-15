import './CertificateCard.css';
import './CertificateForm.css';
import React, { useState } from 'react';
import { useRouteContext } from '../../../providers/routeProvider/RouteProvider';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function CertificateCard(props) {

    const [state, dispatch] = useRouteContext();

    const [edit, setEdit] = useState(false);

    const handleDelete = async () => {
        await fetch('https://liori.herokuapp.com/api/certificate/delete', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                certificateID: props.certificate._id.toString(),
            })
        });
        dispatch({ type: 'delete_certificate', certificateID: props.certificate._id.toString() })
    }

    const showEdit = () => {
        setEdit(true);
    }

    const hideEdit = () => {
        setEdit(false);
    }

    const openNewWindow = () => {
        window.open(props.certificate.link, '_blank');
    }

    if (!edit) {
        return (
            <div className='CertificateCard'>


                <div className='CertificateContent'>
                    <p className='CerTitleText'>{props.certificate.name}</p>
                    <p className='CerProviderText CerTitleTypeText'>{props.certificate.type}</p>
                    <p className='CerProviderText'>{props.certificate.provider}</p>
                </div>

                <div className='CertificateButtons'>
                    <button onClick={openNewWindow}>
                        <OpenInNewIcon/>
                    </button>
                    
                    {(state.user && state.viewedUser && state.viewedUser._id.toString() === state.user._id.toString()) ?
                    <button onClick={showEdit}>
                        <EditIcon/>
                    </button> : null}

                    {(state.user && state.viewedUser && state.viewedUser._id.toString() === state.user._id.toString()) ?
                    <button onClick={handleDelete}>
                        <DeleteForeverIcon/>
                    </button> : null}
                </div>
                
            </div>
        )
    } else {
        return <EditCertificateForm certificate={props.certificate} hideEdit={hideEdit}/>
    }
    
}

function EditCertificateForm(props) {

    const [state, dispatch] = useRouteContext();

    const [name, setName] = useState(props.certificate.name);
    const [type, setType] = useState(props.certificate.type);
    const [provider, setProvider] = useState(props.certificate.provider);
    const [link, setLink] = useState(props.certificate.link);
    const [order, setOrder] = useState(props.certificate.order);

    const handleName = (evt) => {
        setName(evt.target.value);
    }

    const handleType = (evt) => {
        setType(evt.target.value);
    }

    const handleProvider = (evt) => {
        setProvider(evt.target.value);
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
        setLink(value);
    }

    const submitCertificate = async (evt) => {
        evt.preventDefault();

        const fetchItem = await fetch(
            `https://liori.herokuapp.com/api/certificate/edit`, 
            {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    certificateID: props.certificate._id.toString(),
                    name: name,
                    type: type,
                    provider: provider,
                    link: link,
                    order: parseInt(order),
                }),
            }
        )
        const item = await fetchItem.json();
        dispatch({type: 'edit_certificate', certificateID: props.certificate._id.toString(), certificate: item.certificate});
        reset('');
        props.hideEdit();
    }


    return (
        <div className='CertificateForm'>
            <div className='CertificateContentForm'>
                <p>Certificate</p>
                <input 
                    defaultValue={name}
                    onChange={handleName} 
                    placeholder='Title of the certificate' 
                    type="text"/>

                <p>Type</p>
                <input 
                    defaultValue={type}
                    onChange={handleType} 
                    placeholder='Type of the certificate' 
                    type="text"/>
                
                <p>Provider</p>
                <input 
                    defaultValue={provider}
                    onChange={handleProvider} 
                    placeholder='The issuing organization' 
                    type="text"/>
            
                <p>Link</p>
                <input 
                    defaultValue={link}
                    onChange={handleLink}  
                    placeholder='Link to open the certificatet' 
                    type="text"/>

                <p>Order</p>
                <input 
                    defaultValue={order}
                    onChange={handleOrder}  
                    placeholder='Number: Position in your certificates list'
                    type="text"/>

                <div className='CertificateFormButtons'>
                    <button className='CertificateFormButton' onClick={submitCertificate}>Submit</button>  
                    <button className='CertificateFormButton' onClick={props.hideEdit}>Cancel</button>  
                </div>
            </div>
        </div>);
}