import './UserCard.css'
import React from 'react';
import { useNavigate } from "react-router-dom";
import FolderSharedIcon from '@mui/icons-material/FolderShared';

export default function UserCard(props) {

    const navigate = useNavigate();

    const toUser = () => {
        navigate(`/user/${props.user._id}`);
    }

    return (
        <div className='UserCard'>
            <button className='UserCardButtons' onClick={toUser}>
                <FolderSharedIcon fontSize='large'/>
                <p>{props.user.name}</p>
            </button>
            
        </div>
    )
}