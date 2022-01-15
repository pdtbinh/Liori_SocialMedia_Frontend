import React from 'react';
import { useRouteContext } from "../../../providers/routeProvider/RouteProvider";
import CertificateCard from './CertificateCard';
import CertificateForm from './CertificateForm';
import './Certificates.css';

export default function Certificates(props) {
    
    const [state, dispatch] = useRouteContext();

    return (
        <div className={`Certificates Certificates-${props.size}`}>
            <p className='CertificatesTitle'>CERTIFICATES</p>
            { (props.size === 'large') ? props.certificates.map(certificate => {
                return <CertificateCard certificate={certificate} key={certificate._id}/>
                }) : null}
            { 
                (props.size === 'large' && state.user && state.viewedUser && state.viewedUser._id === state.user._id) ? 
                    <CertificateForm/> 
                : null 
            }
            {
                (props.size === 'small') ? 
                    <h1 className='CertificatesCount'>{props.certificates.length}</h1>
                : <h1 style={{fontSize: '0rem'}} className='CertificatesCount'>{props.certificates.length}</h1>
            }
        </div>
    );
}