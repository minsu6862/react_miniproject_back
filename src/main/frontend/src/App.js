import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import api from "./services/api";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Board from "./pages/Board";
import BoardDetail from "./pages/BoardDetail";
import BoardWrite from "./pages/BoardWrite";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      // 닉네임을 user로 설정
      setUser(res.data.nickname); // username → nickname으로 변경
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("nickname", res.data.nickname);
    } catch (err) {
      console.log("로그인되지 않음");
      setUser(null);
      localStorage.removeItem("username");
      localStorage.removeItem("nickname");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("로그아웃 실패:", err);
    } finally {
      localStorage.removeItem("username");
      setUser(null);
    }
  };

  if (loading) {
    return <div>로딩중...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar onLogout={handleLogout} user={user} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board" element={<Board user={user} />} />
          <Route path="/board/:id" element={<BoardDetail user={user} />} />
          <Route path="/board/write" element={<BoardWrite user={user} />} />
          <Route path="/board/:id/edit" element={<BoardWrite user={user} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
