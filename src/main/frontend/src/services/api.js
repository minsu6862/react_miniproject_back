import axios from "axios";

const api = axios.create({
  baseURL: "", // 같은 서버이므로 빈 문자열 또는 생략
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터: 401 에러 시 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("username");
      localStorage.removeItem("nickname");
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup"
      ) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
