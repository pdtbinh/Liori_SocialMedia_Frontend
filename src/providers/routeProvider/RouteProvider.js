import React, { useEffect, useReducer, useContext, createContext } from 'react';

const RouteContext = createContext();

export const RouteProvider = ({reducer, initialState, children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const getUser = async () => {
        try {
            const fetchItem = await fetch('https://liori.herokuapp.com/api/auth/login', {
                method: 'get',
                mode: 'cors',
                credentials: 'include',
                user: document.cookie.user,
            });
            const { user } = await fetchItem.json();
            if (user) {
                dispatch({type: 'signin', user: user});
            }
        } catch (err) {
            console.log('Provider: ', err);
        }
    }

    useEffect(() => getUser(), [])

    return (
        <RouteContext.Provider value={[state, dispatch]}>
            {children}
        </RouteContext.Provider>
    )
}

export const useRouteContext = () => useContext(RouteContext);