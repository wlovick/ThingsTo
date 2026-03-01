import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router';
import supabase from '../helper/supabaseClient';
import { Link } from "react-router-dom";
import './header.css';

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [authenticated, setAuthenticated] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(data.user);
    };
    getUser();
  }, []);
  
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setAuthenticated(session);
    };

    getSession();
  }, []);
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen((s) => !s);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  return (
    <div className="header">
        <div><Link to="/home" className="siteName">ThingsTo:</Link></div>
        <div className="navLinks">
            <ul>
                <li><Link className="Link" to="/todos">To-Do&rsquo;s</Link></li>
                {/* <li><Link className="Link" to="/note">To Note</Link></li> */}
                {/* <li><Link className="Link" to="/log">to Log</Link></li> */}
                {/* <li><Link className="Link" to="/remember">To Remember</Link></li> */}
            </ul>
            {/* <a href="/dashboard">Dashboard</a>
            <a href="/login">Login</a>
            <a href="/register">Register</a> */}
        </div>
        <div className="userInfo">
          <div
            className="userWelcome"
            onClick={toggleMenu}
            role="button"
            tabIndex={0}
            aria-expanded={menuOpen}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleMenu(); }}
            ref={menuRef}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M7 6h10M4 12h16M7 12h13M7 18h10"/>
            </svg>
            {menuOpen && authenticated && (
              <div className="userAccountMenu">
                <div className="accountOptionUser">{user?.email || "User"}</div>
                <div className="accountOptionUser">{user?.session || "Session"}</div>
                <div className="accountOption"><Link className="accountLink" to="../pages/userInfo/profile">Profile</Link></div>
                <div className="accountOption"><Link className="accountLink" to="../pages/userInfo/account">Account</Link></div>
                <div className="accountOption"><Link className="accountLink" to="../pages/userInfo/settings">Settings</Link></div>
                <div className="accountOption" onClick={signOut}>Sign out</div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}


     