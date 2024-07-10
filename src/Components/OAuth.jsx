import { Button } from 'flowbite-react';
import React from 'react';
import { AiFillGooglePlusCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logInFailure, logInSuccess } from '../Redux/Slice/UserSlice';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';


const OAuth = () => {
     const auth = getAuth(app)
     const dispatch=useDispatch()
     const navigate =useNavigate()
     const handleSubmit =async()=>{
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt:'select_account'}) 

        try {
            const result =await signInWithPopup(auth,provider)
            const res =await fetch("http://localhost:4200/api/auth/google",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name:result.user.displayName,
                    email:result.user.email,
                    profileImg:result.user.photoURL
                })
            })
            const data =await res.json();
             if(res.ok){
                localStorage.setItem("Token",data.token)
                dispatch(logInSuccess(data))
                navigate('/')
             }
        } catch (error) {
           dispatch(logInFailure(error.message)) 
        }
     }

    return (
        <Button gradientDuoTone="tealToLime" type='button' onClick={handleSubmit}>
            <AiFillGooglePlusCircle className='w-5 h-5 mr-2 text-red-600'/>
           <span className='text-green-500'>Continue with Google</span> 
        </Button>
    );
};

export default OAuth;