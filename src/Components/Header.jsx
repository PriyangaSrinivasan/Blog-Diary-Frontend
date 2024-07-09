import { Avatar, Button, Dropdown, DropdownDivider, Navbar, TextInput } from 'flowbite-react';
import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toggleTheme } from '../Redux/Slice/ThemeSlice';
import { logOutSuccess } from '../Redux/Slice/UserSlice';
import { PiNotePencilLight } from "react-icons/pi";
 
const Header = () => {
    const path =useLocation().pathname;
    const navigate =useNavigate();
    const dispatch =useDispatch();
    const {currentuser} = useSelector((state)=>state.user);
    const {theme} =useSelector((state)=>state.theme);


    const handleLogout=()=>{
      dispatch(logOutSuccess())
      localStorage.removeItem('Token')
      navigate('/blogs')
    }

    return (
      <Navbar className="border-b-2 bg-slate-900">
        <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
         <span className=' app px-2 py-1 text-lime-500 text-4xl flex '>Blog<PiNotePencilLight/>Diary</span></Link>
        <div className='flex gap-2 md:order-2'>
        <Button className='w-25 h-9 hidden sm:inline'
         gradientDuoTone="tealToLime"
         outline
         onClick={()=>dispatch(toggleTheme())}
        >
            {theme === "light" ?(
                <FaMoon />
            ):(<FaSun />)}
          
        </Button>
        {currentuser ? (
          <Dropdown 
          arrowIcon={false}
          inline
          label={
            <Avatar alt='user'
            img={currentuser.rest.profileImage}
            rounded/>
          }
          >
          <Dropdown.Header>
          <span className="block text-sm">{currentuser.rest.username}</span>
          </Dropdown.Header>
          <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <DropdownDivider />
            <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
          </Dropdown>
        ):(
           <Link to ='/login'>
           <Button gradientDuoTone="tealToLime">
               Login
           </Button>
           </Link>
        )}
           <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
        <Navbar.Link active ={path ==='/'} as={"div"} >
          <Link className='text-white' to="/">About</Link>
        </Navbar.Link>
        <Navbar.Link active ={path ==='/blogs'} as={"div"}>
          <Link className='text-white' to="/blogs">Blogs</Link>
        </Navbar.Link>
      </Navbar.Collapse>
        
      </Navbar> 
    );
};

export default Header;