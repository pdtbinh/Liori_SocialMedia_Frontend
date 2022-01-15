import React from 'react';
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function EmptyUser(props) {

    const location = useLocation();
    
    return (<Navigate to={`${location.pathname}/info`}/>);
}