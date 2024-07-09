import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";


const UpdatePostPrivateRoute =()=>{
    const {currentuser } =useSelector((state)=>state.user);
    const canUpdatePosts = currentuser;
    return canUpdatePosts ? <Outlet /> : <Navigate to='/login' />
}

export default UpdatePostPrivateRoute;