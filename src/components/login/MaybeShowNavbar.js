import React,{useEffect, useState} from "react";
import { useLocation} from "react-router-dom";

const MaybeShowNavbar = ({children}) =>{
    const location = useLocation();
    const isHomepage = location.pathname === '/';
    const isSignupPage = location.pathname === '/signup';
    const showNavbar = !(isHomepage || isSignupPage);


    useEffect(() => {
        console.log('this is location:', location)
       
        }, [location])

    return(
        <div>
            {showNavbar && children}
        </div>
    )
}
export default MaybeShowNavbar