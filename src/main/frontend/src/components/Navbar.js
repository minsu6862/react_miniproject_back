import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <h1>학사</h1>
        </Link>
        <div className="navbar-menu">
          {user ? (
            <>
              <span className="navbar-user">{user}님</span>
              <Link to="/board/write" className="navbar-link">
                글쓰기
              </Link>
              <button onClick={onLogout} className="navbar-button">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                로그인
              </Link>
              <Link to="/signup" className="navbar-link">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
