import React, { useState } from 'react';
import { useRouteContext } from "../../../providers/routeProvider/RouteProvider";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import './Info.css';
import Certificates from '../certificate/Certificates';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';
import EditIcon from '@mui/icons-material/Edit';

export default function Info(props) {

    const [state, dispatch] = useRouteContext();

    const [showInfo, setShowInfo] = useState(true);

    const [edit, setEdit] = useState(false);

    const showEdit = () => {
        setEdit(true);
    }

    const hideEdit = () => {
        setEdit(false);
    }

    const expand = () => {
        setShowInfo(true);
    }

    const contract = () => {
        setShowInfo(false);
        setEdit(false);
    }

    return (
        <div className='Info'>
            <div className={showInfo ? 'Information-large' : 'Information-small'}>
                {!edit ? <UserContentCard user={props.user} showInfo={showInfo}/> : <UserEditForm user={props.user} hideEdit={hideEdit}/>}
                
                <div className='InfoButtonsDiv'>
                    { (showInfo && state.user && state.viewedUser && state.viewedUser._id.toString() === state.user._id.toString()) ?
                    <button onClick={showEdit}><EditIcon/></button> : null }

                    { showInfo ? <button onClick={contract}><CloseFullscreenOutlinedIcon/></button>
                    : <button onClick={expand}><OpenInFullOutlinedIcon/></button> }
                </div>
            </div>

            <Certificates certificates={props.certificates} size={showInfo ? 'small' : 'large'}/>
        </div>
    );
}

function UserContentCard(props) {

    const showInfo = props.showInfo;

    return (
        <div className='InfoContentDiv'>
            <div className='InfoDiv'> 
                <PersonOutlineOutlinedIcon/>
                {showInfo ? <p className='InfoNameText'>{props.user.name}</p>
                : <p style={{fontSize: '0rem'}} className='InfoNameText'>{props.user.name}</p>}       
            </div>
            <div className='InfoDiv'>
                <MapsHomeWorkOutlinedIcon/>
                {showInfo ? <p style={
                        {
                            color: !props.user.address ? 'rgba(0, 255, 255, 0.5)' : 'rgba(0, 255, 255, 1)', 
                            fontStyle: !props.user.address ? 'italic' : 'normal',
                        }
                    }>{props.user.address ? props.user.address : 'Not applicable'}</p> 
                : <p style={
                        {
                            fontSize: '0rem', 
                            color: !props.user.address ? 'rgba(0, 255, 255, 0.5)' : 'rgba(0, 255, 255, 1)', 
                            fontStyle: !props.user.address ? 'italic' : 'normal',
                        }
                    }
                    >{props.user.address ? props.user.address : 'Not applicable'}</p>}
            </div>
            <div className='InfoDiv'>
                <LocalPhoneIcon/>
                {showInfo ? <p style={
                        {
                            color: !props.user.phone ? 'rgba(0, 255, 255, 0.5)' : 'rgba(0, 255, 255, 1)', 
                            fontStyle: !props.user.phone ? 'italic' : 'normal',
                        }
                    }>{props.user.phone ? props.user.phone : 'Not applicable'}</p> 
                : <p style={
                        {
                            fontSize: '0rem', 
                            color: !props.user.phone ? 'rgba(0, 255, 255, 0.5)' : 'rgba(0, 255, 255, 1)', 
                            fontStyle: !props.user.phone ? 'italic' : 'normal',
                        }
                    }
                    >{props.user.phone ? props.user.phone : 'Not applicable'}</p>}
            </div>
            <div className='InfoDiv'>
                <MailOutlineIcon/>
                {showInfo ? <p style={
                        {
                            color: !props.user.email ? 'rgba(0, 255, 255, 0.5)' : 'rgba(0, 255, 255, 1)', 
                            fontStyle: !props.user.email ? 'italic' : 'normal',
                        }
                    }>{props.user.email ? props.user.email : 'Not applicable'}</p> 
                : <p style={
                        {
                            fontSize: '0rem', 
                            color: !props.user.email ? 'rgba(0, 255, 255, 0.5)' : 'rgba(0, 255, 255, 1)', 
                            fontStyle: !props.user.email ? 'italic' : 'normal',
                        }
                    }
                    >{props.user.email ? props.user.email : 'Not applicable'}</p>}
            </div>
        </div>
    )
}

function UserEditForm(props) {

    const [state, dispatch] = useRouteContext();

    const [name, setName] = useState(props.user.name);
    const [address, setAddress] = useState(props.user.address ? props.user.address : '');
    const [phone, setPhone] = useState(props.user.phone ? props.user.phone : '');
    const [email, setEmail] = useState(props.user.email ? props.user.email : '');

    const handleName = (evt) => {
        setName(evt.target.value);
    }

    const handleAddress = (evt) => {
        setAddress(evt.target.value);
    }

    const handlePhone = (evt) => {
        setPhone(evt.target.value);
    }

    const handleEmail = (evt) => {
        setEmail(evt.target.value);
    }

    const submitUser = async (evt) => {
        evt.preventDefault();

        const fetchItem = await fetch(
            `https://liori.herokuapp.com/api/user/edit`, 
            {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    userID: props.user._id.toString(),
                    name: name,
                    address: address,
                    phone: phone,
                    email: email,
                }),
            }
        )
        const item = await fetchItem.json();
        dispatch({type: 'edit_user', user: item.user});
        props.hideEdit();
    }
    
    return (
        <div className='InfoContentDiv'>
            <div className='InfoDiv'> 
                <PersonOutlineOutlinedIcon/>
                <input defaultValue={name} onChange={handleName}/>
            </div>

            <div className='InfoDiv'>
                <MapsHomeWorkOutlinedIcon/>
                <input defaultValue={address} onChange={handleAddress}/>
            </div>

            <div className='InfoDiv'>
                <LocalPhoneIcon/>
                <input defaultValue={phone} onChange={handlePhone}/>
            </div>

            <div className='InfoDiv'>
                <MailOutlineIcon/>
                <input defaultValue={email} onChange={handleEmail}/>
            </div>

            <div className='UserFormButtons'>
                <button className='UserFormButton' onClick={submitUser}>Submit</button>  
                <button className='UserFormButton' onClick={props.hideEdit}>Cancel</button>  
            </div>
        </div>
    )
}