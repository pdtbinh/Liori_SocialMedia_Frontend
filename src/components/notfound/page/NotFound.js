import './NotFound.css';
import { Outlet } from "react-router-dom";

export default function NotFound(props) {
    return (
    <div className='NotFound'>
        <h1>404: Not found</h1>
        <Outlet/>
    </div>)
}