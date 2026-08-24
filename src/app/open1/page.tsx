"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Kiểm tra xem đã có session/token mock trước đó chưa
    const savedSession = localStorage.getItem("mock_sso_session");

    if (savedSession) {
      // LẦN SAU: Đã có session, tự động redirect ngay lập tức
      window.location.replace("myapp://callback?token=1");
    } else {
      // LẦN ĐẦU: Chưa có session, hiển thị form login cho người dùng
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Lưu "session" giả vào localStorage để các lần sau nhớ là đã đăng nhập
    localStorage.setItem("mock_sso_session", "true");

    // Chuyển hướng về app kèm token
    window.location.replace("myapp://callback?token=mock_token_abc123");
  };

  // Tránh bị chớp màn hình form login trong lúc useEffect đang check localStorage
  if (isLoggedIn === null) {
    return <div style={{ padding: 20 }}>Đang kiểm tra phiên đăng nhập...</div>;
  }

  // LẦN ĐẦU: Hiển thị form đăng nhập giả lập
  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 400, margin: "0 auto" }}>
      <h2>Mock SSO Login (Zoom/SAML)</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Email / Username</label>
          <input 
            type="email" 
            defaultValue="user@example.com" 
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }} 
            required 
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Password</label>
          <input 
            type="password" 
            defaultValue="123456" 
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }} 
            required 
          />
        </div>
        <button 
          type="submit" 
          style={{ padding: "10px 16px", backgroundColor: "#0E71EB", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}
        >
          Đăng nhập
        </button>
      </form>
      <p style={{ fontSize: 12, color: "#666", marginTop: 16 }}>
        * Lần đầu bấm đăng nhập sẽ lưu session. Các lần sau mở lại trang này qua ASWebAuthenticationSession, nó sẽ tự động chuyển hướng mà không hiện form nữa.
      </p>
    </div>
  );
}
