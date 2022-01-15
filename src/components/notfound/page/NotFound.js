import './NotFound.css';
import { Outlet } from "react-router-dom";

export default function NotFound(props) {
    return (
    <div className='NoFoundDiv'>
        <div className='NoFoundPanel'>
            <p>404: Sorry, we cannot find what you're looking for :-(</p>
        </div>
    </div>)
}