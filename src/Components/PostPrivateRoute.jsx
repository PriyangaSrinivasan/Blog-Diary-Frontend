import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';


const PostPrivateRoute = () => {
    const {currentuser}=useSelector((state)=>state.user)
    return currentuser ? <Outlet /> :<Navigate to='/login' />
};

export default  PostPrivateRoute;