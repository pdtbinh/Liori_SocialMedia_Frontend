import './UsersPage.css';
import AllUsers from '../all/AllUsers';
import React, { useEffect } from 'react';
import { useRouteContext } from '../../../providers/routeProvider/RouteProvider';
import { useLocation } from "react-router-dom";


export default function UsersPage(props) {
    // Get navigate and location
    const location = useLocation();

    // Get context
    const [state, dispatch] = useRouteContext();

    // Use effect (as componentDidMout)
    useEffect(() => {
        if (!state.users) {
            fetchUsers();
        } 
        // Careful: if 'users_scroll' equals 0,
        // the following would still evaluated to false.
        // So the following can be interpreted as follow:
        // - If users_scroll exists AND larger than 0, scroll
        // - If users_scroll does not exists or equals to 0, refresh scroll.
        // refreshing is needed in case users_scroll is 0 and the page got affected,
        // by other page and scroll along.
        if (state.users_scroll) {
            window.scrollTo(0, state.users_scroll);
        } else {
            window.scrollTo(0, 0);
        }
        dispatch({ type: 'route', route: location.pathname });
    }, []);

    // Fetch all users
    const fetchUsers = async () => {
        const fetchItem = await fetch('https://liori.herokuapp.com/api/users', {
            credentials: 'include',
        });
        const item = await fetchItem.json();
        dispatch({ type: 'users', users: item.users });
    }

    if (state.users) {
        return (
            <div className='UsersPage'>
                <AllUsers users={state.users}/>
            </div>);
    } else {
        return (<div className='UsersLoadingDiv'>
        <div className='UsersLoadingPanel'>
            <p>Loading...</p>
        </div>
    </div>);
    }
    
}