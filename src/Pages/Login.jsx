import { Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import { ErrorMessage, Form, Field, Formik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  logInFailure,
  logInStart,
  logInSuccess,
} from "../Redux/Slice/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../Components/OAuth";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
  const handleSubmit = async (values) => {
    try {
      dispatch(logInStart());
      const response = await fetch("https://blog-diary-flis.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.success === false) {
        return dispatch(logInFailure((data.message)));
      }
      if (response.ok) {
        localStorage.setItem('Token',data.token);
        dispatch(logInSuccess(data));
        navigate("/blogs");
      }
    } catch (error) {
      dispatch(logInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col items-center gap-5">
        <div className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
          <span className="px-2 py-1 text-lime-500 ">Login</span>
        </div>
      </div>
      <Card className="max-w-sm bg-gray-400 mx-auto flex-col">
        <div className="flex-1">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="flex flex-col gap-4">
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
              <Button
                gradientDuoTone="tealToLime"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      color="info"
                      aria-label="Success spinner example"
                      size="sm"
                    />
                    <span className="pl-2">Loading...</span>
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
             <OAuth />
            </Form>
          </Formik>

          <div className="flex gap-2 text-sm mt-6">
            <span>Don't have an Account</span>
            <Link to="/Register" className="text-blue-700">
              Sign Up
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
