import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import "../index.css"
const DashboardSidebar = () => {
    const{currentuser} =useSelector((state)=>state.user);
    const location =useLocation();
    const dispatch =useDispatch();
    const[tab,setTab] =useState("")
  useEffect(()=>{
    const urlParams =new URLSearchParams(location.search);
    const tabUrl =urlParams.get("tab");
    if(tabUrl){
        setTab(tabUrl);
    }
  },[location.search])


  return (
    <div>
    <Sidebar className="w-full md:w-58">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          <Link to="/dashboard?tap=profile">
            <Sidebar.Item className="bg-slate-800 text-blue-500"
              active={tab === "profile"}
              icon={HiUser}
              label={currentuser.rest.isAdmin ? "Admin":"User"}
              labelColor ="dark"
              as="div"
            >Profile</Sidebar.Item>
          </Link>
          {currentuser && (
            <Link to="/create-post">
                <Sidebar.Item className="bg-slate-800 text-blue-500" active={tab==="posts"}
                icon={HiDocumentText}
                labelColor="dark"
                as="div">Creators or update</Sidebar.Item>
            </Link>
          )}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
    </div>
  );
};

export default DashboardSidebar;
