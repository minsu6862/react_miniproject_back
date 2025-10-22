import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Board.css";

const Board = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/posts?page=${page}&size=10`);
      setPosts(res.data.content);
      setTotalPages(res.data.totalPages);
      setError("");
    } catch (err) {
      setError("게시글을 불러오는데 실패했습니다");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      fetchPosts();
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(
        `/api/posts/search?keyword=${searchKeyword}&page=0&size=10`
      );
      setPosts(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(0);
      setError("");
    } catch (err) {
      setError("검색에 실패했습니다");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      if (hours < 1) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}분 전`;
      }
      return `${hours}시간 전`;
    }
    return date.toLocaleDateString("ko-KR");
  };

  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="board-container">
      <div className="board-header">
        <h2>게시판</h2>
        {user && (
          <Link to="/board/write" className="btn-write">
            글쓰기
          </Link>
        )}
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search">
            검색
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="post-list">
        <div className="post-list-header">
          <div className="col-title">제목</div>
          <div className="col-author">작성자</div>
          <div className="col-date">작성일</div>
          <div className="col-views">조회</div>
        </div>
        {posts.length === 0 ? (
          <div className="no-posts">게시글이 없습니다</div>
        ) : (
          posts.map((post) => (
            <Link to={`/board/${post.id}`} key={post.id} className="post-item">
              <div className="col-title">
                {post.title}
                {post.commentCount > 0 && (
                  <span className="comment-count">[{post.commentCount}]</span>
                )}
              </div>
              <div className="col-author">{post.authorNickname}</div>
              <div className="col-date">{formatDate(post.createdAt)}</div>
              <div className="col-views">{post.viewCount}</div>
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="btn-page"
          >
            이전
          </button>
          <span className="page-info">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
            className="btn-page"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default Board;
