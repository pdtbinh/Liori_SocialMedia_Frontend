import React, { useState } from 'react';
import { useRouteContext } from '../../../providers/routeProvider/RouteProvider';
import AddIcon from '@mui/icons-material/Add';
import './CertificateForm.css';

export default function CertificateForm(props) {

    const [state, dispatch] = useRouteContext();

    const [show, setShow] = useState(false);

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [provider, setProvider] = useState('');
    const [link, setLink] = useState('');
    const [order, setOrder] = useState(1);

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
            `https://liori.herokuapp.com/api/certificate/add`, 
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
                    type: type,
                    provider: provider,
                    link: link,
                    order: parseInt(order),
                }),
            }
        )
        const item = await fetchItem.json();
        dispatch({type: 'add_certificate', certificate: item.certificate});
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
            <div className='CertificateForm'>
                <div className='CertificateContentForm'>
                    <p>Certificate</p>
                    <input 
                        onChange={handleName} 
                        placeholder='Title of the certificate' 
                        type="text"/>

                    <p>Type</p>
                    <input 
                        onChange={handleType} 
                        placeholder='Type of the certificate' 
                        type="text"/>
                    
                    <p>Provider</p>
                    <input 
                        onChange={handleProvider} 
                        placeholder='The issuing organization' 
                        type="text"/>
                
                    <p>Link</p>
                    <input 
                        onChange={handleLink}  
                        placeholder='Link to open the certificatet' 
                        type="text"/>

                    <p>Order</p>
                    <input 
                        onChange={handleOrder}  
                        placeholder='Number: Position in your certificates list'
                        type="text"/>

                    <div className='CertificateFormButtons'>
                        <button className='CertificateFormButton' onClick={submitCertificate}>Submit</button>  
                        <button className='CertificateFormButton' onClick={hideForm}>Cancel</button>  
                    </div>
                </div>
            </div>
        );
    } else {
        return (
        
            <button onClick={showForm} className='AddCertificateButton'>
                <AddIcon className='AddCertificateIcon'/>
            </button>
        )
    }
}