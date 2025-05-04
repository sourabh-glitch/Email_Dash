import React from 'react'
import { MdOutlineMailOutline } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-gray-100 border-b shadow-md">


        {/* logo and name of the app */}

        <div className="border-2 flex items-center  bg-green-300">
            <span className="mr-3"><MdOutlineMailOutline /> </span>
            <span className="logo-name">MailDash</span>
        </div>

        {/* title */}

        <div className="border-2  bg-orange-200">
            <h3 className='m-3'>Compose Email</h3>
        </div>

        {/* user section */}

        <div className="border-2 flex items-center bg-blue-200">
            <button>
            <FaBell />

            </button>
            <span className="ml-4">User Name</span>
            <span className='ml-4'><IoSettings /></span>
        </div>
    </header>
)}

export default Navbar

