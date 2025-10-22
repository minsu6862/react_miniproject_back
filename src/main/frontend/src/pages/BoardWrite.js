import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./BoardWrite.css";

const BoardWrite = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(id);

  useEffect(() => {
    if (!user) {
      alert("로그인이 필요합니다");
      navigate("/login");
      return;
    }

    if (isEdit) {
      fetchPost();
    }
  }, [user, isEdit, id]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/api/posts/${id}`);
      if (res.data.authorNickname !== user) {
        alert("수정 권한이 없습니다");
        navigate("/board");
        return;
      }
      setFormData({
        title: res.data.title,
        content: res.data.content,
      });
    } catch (err) {
      setError("게시글을 불러오는데 실패했습니다");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("제목과 내용을 모두 입력해주세요");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (isEdit) {
        await api.put(`/api/posts/${id}`, formData);
        alert("게시글이 수정되었습니다");
        navigate(`/board/${id}`);
      } else {
        const res = await api.post("/api/posts", formData);
        alert("게시글이 작성되었습니다");
        navigate(`/board/${res.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "작업에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="board-write-container">
      <div className="board-write-box">
        <h2>{isEdit ? "게시글 수정" : "게시글 작성"}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="제목을 입력하세요"
              required
            />
          </div>
          <div className="form-group">
            <label>내용</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="내용을 입력하세요"
              rows="15"
              required
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              취소
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "처리중..." : isEdit ? "수정" : "작성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardWrite;
