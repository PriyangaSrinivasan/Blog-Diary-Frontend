import { Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import { ErrorMessage,Form, Field, Formik } from "formik";
import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import OAuth from "../Components/OAuth";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrormessage] = useState(null);
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^[a-zA-Z0-9_]+$/)
      .required("Username is required"),
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
  const handleSubmit =async (values)=>{
    try {
        setLoading(true)
        setErrormessage(null)
        const response =await fetch('https://blog-diary-flis.onrender.com/api/auth/register',{
            method:'POST',
            headers:{
                'content-Type':'application/json'
            },
            body:JSON.stringify(values)
        })
        const data=await response.json();
        if(data.success===false){
            return setErrormessage(data.message)
        }
        if(response.ok){
            navigate('/login')
        }
    } catch (error) {
        setErrormessage(error.message)
        setLoading(false)
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col items-center gap-5">
        
          <div className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
            <span className="px-2 py-1 text-lime-500 ">Register</span>
          </div>
      
      </div>
      <Card className="max-w-sm bg-gray-400 mx-auto flex-col" >
      <div className="flex-1">
       
        <Formik 
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          
          <Form className="flex flex-col gap-4">
            <div>
              <Label htmlFor="username" value="Username" />
              <Field
                as={TextInput}
                type="text"
                name="username"
                placeholder="Enter your User Name"
                id="username"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-700 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="email" value="Email" />
              <Field
                as={TextInput}
                type="email"
                name="email"
                placeholder="Enter your Email"
                id="email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-700 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="password" value="Password" />
              <Field
                as={TextInput}
                type="password"
                name="password"
                placeholder="Enter your Password"
                id="password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-700 text-sm"
              />
            </div>
            <Button gradientDuoTone="tealToLime" type="submit" disabled={loading}>{loading ? <>
                <Spinner color="info" aria-label="Success spinner example"  size='sm' /> <span className="pl-2">Loading...</span>              
                </>:'Sign Up'}
            </Button>
           <OAuth />
          </Form>
         
        </Formik>
       
        <div className="flex gap-2 text-sm mt-6">
            <span>Already Have An Account?</span>
            <Link to='/login' className="text-blue-700">Login</Link>
        </div>
      </div>
    </Card>

    </div>
  );
};

export default Register;
