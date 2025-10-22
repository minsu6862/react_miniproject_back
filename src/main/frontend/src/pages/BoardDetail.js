import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./BoardDetail.css";

const BoardDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/api/posts/${id}`);
      setPost(res.data);
      setError("");
    } catch (err) {
      setError("게시글을 불러오는데 실패했습니다");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/comments/post/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/api/posts/${id}`);
      alert("게시글이 삭제되었습니다");
      navigate("/board");
    } catch (err) {
      alert(err.response?.data?.message || "삭제에 실패했습니다");
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      await api.post(`/api/comments/post/${id}`, { content: commentContent });
      setCommentContent("");
      fetchComments();
    } catch (err) {
      alert(err.response?.data?.message || "댓글 작성에 실패했습니다");
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingCommentContent.trim()) return;

    try {
      await api.put(`/api/comments/${commentId}`, {
        content: editingCommentContent,
      });
      setEditingCommentId(null);
      setEditingCommentContent("");
      fetchComments();
    } catch (err) {
      alert(err.response?.data?.message || "댓글 수정에 실패했습니다");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/api/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      alert(err.response?.data?.message || "댓글 삭제에 실패했습니다");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR");
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post)
    return <div className="error-message">게시글을 찾을 수 없습니다</div>;

  const isAuthor = user === post.authorNickname;

  return (
    <div className="board-detail-container">
      <div className="post-detail">
        <div className="post-header">
          <h2 className="post-title">{post.title}</h2>
          <div className="post-info">
            <span className="post-author">{post.authorNickname}</span>
            <span className="post-date">{formatDate(post.createdAt)}</span>
            <span className="post-views">조회 {post.viewCount}</span>
          </div>
        </div>

        <div className="post-content">
          <p>{post.content}</p>
        </div>

        <div className="post-actions">
          <Link to="/board" className="btn-secondary">
            목록
          </Link>
          {isAuthor && (
            <>
              <Link to={`/board/${id}/edit`} className="btn-secondary">
                수정
              </Link>
              <button onClick={handleDeletePost} className="btn-danger">
                삭제
              </button>
            </>
          )}
        </div>
      </div>

      <div className="comments-section">
        <h3 className="comments-title">댓글 {comments.length}개</h3>

        {user && (
          <form onSubmit={handleSubmitComment} className="comment-form">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력하세요"
              rows="3"
              required
            />
            <button type="submit" className="btn-primary">
              댓글 작성
            </button>
          </form>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="no-comments">첫 댓글을 작성해보세요!</div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">
                    {comment.authorNickname}
                  </span>
                  <span className="comment-date">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>

                {editingCommentId === comment.id ? (
                  <div className="comment-edit-form">
                    <textarea
                      value={editingCommentContent}
                      onChange={(e) => setEditingCommentContent(e.target.value)}
                      rows="3"
                    />
                    <div className="comment-edit-actions">
                      <button
                        onClick={() => handleUpdateComment(comment.id)}
                        className="btn-primary"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="btn-secondary"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="comment-content">{comment.content}</div>
                    {user === comment.authorNickname && (
                      <div className="comment-actions">
                        <button
                          onClick={() => handleEditComment(comment)}
                          className="btn-small"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="btn-small btn-danger"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
