import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import About from './Pages/About';
import Blogs from './Pages/Blogs';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Header from './Components/Header';
import PrivateRoute from './Components/PrivateRoute';
import CreateBlog from './Pages/CreateBlog';
import Post from './Pages/Post';
import PostPrivateRoute from './Components/PostPrivateRoute';
import UpdatePostPrivateRoute from './Components/UpdatePostPrivateRoute';
import EditBlog from './Pages/EditBlog';
import FooterCom from './Components/Footer';





const App = () => {
    return (
        <BrowserRouter>
        <Header />
       <Routes>
            <Route path='/' element={<About />} />
            <Route element={<PostPrivateRoute />}>
            <Route path='/blogs' element={<Blogs />} />
            <Route path='/post/:id' element={<Post />} />
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />}/>
            <Route element={<PrivateRoute />} >
            <Route path ='/dashboard' element={<Dashboard />} />
            </Route>
            <Route path='/create-post' element={<CreateBlog />} />
            <Route element={<UpdatePostPrivateRoute />}>
            <Route path='/update-post' element={<EditBlog />}/>
            </Route>
        </Routes>
     <FooterCom />
        </BrowserRouter>
    );
};

export default App;