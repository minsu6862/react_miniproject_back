import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <h1>학교 사랑 소통장소, 학사에 오신 것을 환영합니다!</h1>
        <p>자유롭게 소통하고 정보를 공유하세요.</p>
        <Link to="/board" className="home-button">
          게시판 가기
        </Link>
      </div>
    </div>
  );
};

export default Home;
