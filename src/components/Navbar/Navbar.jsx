import React from 'react';
import { NavLink } from 'react-router-dom';

// Active link style function
const getLinkStyle = ({ isActive }) => {
    return {
        borderBottom: isActive ? '2px solid  #C9A24D' : 'none',
        color: isActive ? ' #C9A24D' : '#EAEAEA',
        paddingBottom: '2px'
    };
};

const Navbar = () => {
    const links = <>
        <li><NavLink to="/" style={getLinkStyle}>Home</NavLink></li>
        <li><NavLink to="/meals" style={getLinkStyle}>Meals</NavLink></li>
        <li><NavLink to="/dashboard" style={getLinkStyle}>Dashboard</NavLink></li>
    </>;

    return (
        <div className="b-g-main border-b b-subtle">
            <div className="navbar  px-4 lg:px-8 shadow-sm">
                {/* Logo / Brand */}
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden text-text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
                            </svg>
                        </label>
                        <ul className="menu menu-sm dropdown-content bg-surface rounded-box z-50 mt-3 w-52 p-4 shadow-lg">
                            {links}
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-2xl font-display t-accent normal-case">Chef Hut</a>
                </div>

                {/* Desktop Links */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-10 font-sans text-text-primary">
                        {links}
                    </ul>
                </div>

                {/* CTA Button */}
                <div className="navbar-end">
                    <button className="b-g-accent text-black rounded-md px-4 py-2 hover:brightness-105 transition">
                        Order Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
