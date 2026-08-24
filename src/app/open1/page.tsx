"use client";

import { useEffect, useState } from "react";

// Các hàm tiện ích xử lý Cookie (không cần cài thư viện ngoài)
function setCookie(name: string, value: string, maxAgeInSeconds: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeInSeconds}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Kiểm tra xem đã có cookie session trước đó chưa
    const savedSession = getCookie("mock_sso_session");

    if (savedSession) {
      // LẦN SAU (hoặc trong vòng 2 phút): Đã có session, tự động redirect ngay lập tức
      window.location.replace("myapp://callback?token=1");
    } else {
      // LẦN ĐẦU (hoặc đã hết hạn sau 2 phút): Chưa có session, hiển thị form login
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Lưu cookie có thời hạn 2 phút (120 giây)
    setCookie("mock_sso_session", "true", 120);

    // Chuyển hướng về app kèm token
    window.location.replace("myapp://callback?token=mock_token_abc123");
  };

  // Tránh bị chớp màn hình form login trong lúc useEffect đang check cookie
  if (isLoggedIn === null) {
    return <div style={{ padding: 20 }}>Đang kiểm tra phiên đăng nhập...</div>;
  }

  // LẦN ĐẦU / HẾT HẠN: Hiển thị form đăng nhập giả lập
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
        * Cookie này sẽ tự động hết hạn sau **2 phút**. Sau 2 phút, nếu mở lại trang này, bạn sẽ phải đăng nhập lại từ đầu.
      </p>
    </div>
  );
}
