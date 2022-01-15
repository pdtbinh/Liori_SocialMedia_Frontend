import './SignIn.css'
import { useRouteContext } from '../../../providers/routeProvider/RouteProvider';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function SignIn(props) {
    // Get navigate and location
    const navigate = useNavigate();
    
    // Get context
    const [state, dispatch] = useRouteContext();

    useEffect(() => {
        //console.log(state);
    }, []);

    const [isSignIn, setIsSignIn] = useState(true);
    const showSignUp = () => {
        setIsSignIn(false);
    }
    const hideSignUp = () => {
        setIsSignIn(true);
    }

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleName = (evt) => {
        setName(evt.target.value);
    }

    const handleUsername = (evt) => {
        setUsername(evt.target.value);
    }

    const handlePassword = (evt) => {
        setPassword(evt.target.value);
    }

    const logIn = async (evt) => {
        evt.preventDefault();
        if (username && password) {
            const fetchItem = await fetch('https://liori.herokuapp.com/api/auth/login', {
                method: 'post',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });
            const item = await fetchItem.json();
            dispatch({type: 'signin', user: item.user});
            if (state.route) {
                navigate(state.route);
            } else {
                navigate('/users');
            }
        }
    }

    const signUp = async (evt) => {
        evt.preventDefault();
        if (name && username && password) {
            const fetchItem = await fetch('https://liori.herokuapp.com/api/auth/signup', {
                method: 'post',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    username: username,
                    password: password,
                }),
            });
            const item = await fetchItem.json();
            dispatch({type: 'signin', user: item.user});
            dispatch({type: 'users', users: [...state.users, item.user]});
            if (state.route) {
                navigate(state.route);
            } else {
                navigate('/users');
            }
        }
    }
    
    if (!state.user) {
        return (
            <div className='SignInDiv'>
                <div className='SignIn'>
                    {!isSignIn ? <p>Full name</p> : null}

                    {!isSignIn ? 
                    <input 
                        placeholder='Please enter your name'
                        id='username' name='username' type='text'
                        onChange={handleName}
                        required/> : null}
                    
                
                    <p >Username</p>
                    <input 
                        placeholder='Please enter username'
                        id='username' name='username' type='text'
                        onChange={handleUsername}
                        required/>
                
                
                    <p >Password</p>
                    <input 
                        placeholder='Please enter password'
                        id='password' name='password' type='password'
                        onChange={handlePassword}
                        required/>
                    
                    <div className='SigninFormButtons'>
                        {isSignIn ? <button className='SigninFormButton' onClick={logIn}>Sign In</button> 
                        : null}

                        <button className='SigninFormButton' onClick={isSignIn ? showSignUp : signUp}>Sign Up</button>

                        {!isSignIn ? <button className='SigninFormButton' onClick={hideSignUp}>Cancel</button> 
                        : null}
                    </div>
                </div>

                <div className='DevNoteDiv'>
                    <div className='DevNotePanel'>
                        <p>Developer note: If you are logging in, please make sure cross-site cookies are enable on your browser (they're usaully blocked on Safari). If you're viewing as guest only, there is no need to do so. Thank you. Have a great day! :-)</p>
                    </div>
                </div>
            </div>
            
        )
    } else {
        return(
            <div className='LogoutReminderDiv'>
                <div className='LogoutReminderPanel'>
                    <p>Welcome, {state.user.name}!</p>
                </div>
            </div>);
    }
    
}