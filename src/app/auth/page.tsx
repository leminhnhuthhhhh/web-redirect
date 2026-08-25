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
  const [redirectStatus, setRedirectStatus] = useState<"idle" | "redirecting" | "failed">("idle");

  useEffect(() => {
    try {
      // Kiểm tra xem đã có cookie session trước đó chưa
      const savedSession = getCookie("mock_sso_session");

      if (savedSession) {
        // LẦN SAU: Đã có session, tự động redirect ngay lập tức
        setRedirectStatus("redirecting");
        
        // Cài đặt timeout, nếu sau 3 giây vẫn ở trang này tức là không mở được app
        const timer = setTimeout(() => {
          setRedirectStatus("failed");
        }, 3000);

        window.location.replace("gmosign://app/saml/mobileApp?tokenId=581");
        
        return () => clearTimeout(timer);
      }
      // Nếu chưa có session thì giữ nguyên trạng thái "idle" (hiện form)
    } catch (e) {
      console.error("Lỗi khi kiểm tra session:", e);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Lưu cookie có thời hạn 2 phút (120 giây)
      setCookie("mock_sso_session", "true", 120);
      
      setRedirectStatus("redirecting");
      
      const timer = setTimeout(() => {
        setRedirectStatus("failed");
      }, 3000);

      // Chuyển hướng về app kèm token
      window.location.replace("gmosign://app/saml/mobileApp?tokenId=581");
    } catch (e) {
      console.error("Lỗi khi đăng nhập:", e);
    }
  };

  if (redirectStatus === "failed") {
    return (
      <div style={{ padding: 20, fontFamily: "sans-serif", textAlign: "center" }}>
        <h3 style={{ color: "red" }}>Không thể mở ứng dụng</h3>
        <p>Có vẻ như ứng dụng gmosign chưa được cài đặt trên thiết bị này, hoặc trình duyệt chặn mở ứng dụng.</p>
        <button 
          onClick={() => {
            setCookie("mock_sso_session", "", -1); // Xóa cookie
            window.location.reload();
          }}
          style={{ padding: "10px 16px", backgroundColor: "#0E71EB", color: "#fff", border: "none", cursor: "pointer", borderRadius: 4 }}
        >
          Xóa phiên và thử lại
        </button>
      </div>
    );
  }

  if (redirectStatus === "redirecting") {
    return <div style={{ padding: 20, fontFamily: "sans-serif" }}>Đang chuyển hướng về ứng dụng...</div>;
  }

  // TRẠNG THÁI IDLE: Hiển thị form đăng nhập giả lập (không cần chờ check xong JS)
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
