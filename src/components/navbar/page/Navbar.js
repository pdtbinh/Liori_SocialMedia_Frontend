import './Navbar.css'
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useRouteContext } from '../../../providers/routeProvider/RouteProvider';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import logo from './liaLogo.png';

export default function Navbar(props) {
    const [state, dispatch] = useRouteContext();
    
    // Get navigate and location
    const navigate = useNavigate();

    const debug = () => {
        console.log(state);
        dispatch({type: 'signin', user: 'debug'});
    }

    const toUsers = () => {
        navigate('/users');
    }

    const toLogin = () => {
        navigate('/login');
    }

    const toProfile = async () => {
        navigate(`/user/${state.user._id}`);
        // If dispatch is called before, there is a chance App would rerender
        // even before navigation, so after that when navigation is called,
        // nothing is rerendered since it'still on UserPage
        const fetchItem = await fetch(`https://liori.herokuapp.com/api/user/${state.user._id}`);
        const item = await fetchItem.json();
        dispatch({type: 'view', 
            viewedUser: item.user,
            //viewedInfo: item.info,
            viewedEducations: item.educations,
            viewedExperiences: item.experiences,
            viewedProjects: item.projects,
            viewedCertificates: item.certificates,
            viewedLikes: item.likes,
        });
    }

    const logout = async () => {
        const fetchItem = await fetch('https://liori.herokuapp.com/api/auth/logout', {
            method: 'post',
            credentials: 'include',
        });
        if (fetchItem.ok) {
            dispatch({type: 'signout'});
        }
    }

    return (
        <div className='Navbar NavbarButtons'>

            {/* <button onClick={debug}>Debug</button> */}
            <div className='NavbarLogo'><img src={logo} alt=''/></div>

            <div className='NavbarCenterButtons'>
                <button onClick={toUsers}>
                    <HomeOutlinedIcon fontSize='large'/>
                </button>
                {(state.user) ? <button onClick={toProfile}>
                    <PersonOutlineOutlinedIcon fontSize='large'/>
                </button> : null}
                
            </div>
            
            {
                (!state.user) ? <button onClick={toLogin}>
                    <LoginOutlinedIcon fontSize='large'/>
                </button> 
                : <button onClick={logout}><LogoutOutlinedIcon fontSize='large'/></button>
            }
            
        </div>
    )
}