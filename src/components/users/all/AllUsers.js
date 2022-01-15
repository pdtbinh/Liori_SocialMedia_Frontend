import './AllUsers.css'
import React from 'react';
import UserCard from './UserCard';
import { Grid } from '@mui/material';

export default function AllUsers(props) {
    return (
        <div className='AllUsers'>
            <Grid container spacing={3} columnSpacing={0}>
                {props.users.map(user => (
                    <Grid item xs={12} sm={6} md={3} lg={2} xl={2} key={user._id.toString()}>
                        <UserCard user={user} key={user._id}/>
                    </Grid>
                ))}
            </Grid>
            
        </div>
    )
}