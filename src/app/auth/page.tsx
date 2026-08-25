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

        // Giả lập thao tác click vào thẻ a để vượt cơ chế block của Safari
        const a = document.createElement("a");
        a.href = "gmosign://app/saml/mobileApp?tokenId=581";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        
        return () => {
          clearTimeout(timer);
          if (document.body.contains(a)) document.body.removeChild(a);
        };
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

      // Giả lập click thẻ a để mở app an toàn trên iOS
      const a = document.createElement("a");
      a.href = "gmosign://app/saml/mobileApp?tokenId=581";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        if (document.body.contains(a)) document.body.removeChild(a);
      }, 500);
    } catch (e) {
      console.error("Lỗi khi đăng nhập:", e);
    }
  };

  if (redirectStatus === "failed") {
    return (
      <div style={{ padding: 20, fontFamily: "sans-serif", textAlign: "center" }}>
        <h3 style={{ color: "red" }}>Không thể tự động mở ứng dụng</h3>
        <p>Trình duyệt đang chặn mở ứng dụng, hoặc ứng dụng chưa được cài đặt.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", marginTop: 20 }}>
          <a 
            href="gmosign://app/saml/mobileApp?tokenId=581"
            style={{ padding: "10px 16px", backgroundColor: "#0E71EB", color: "#fff", textDecoration: "none", borderRadius: 4, fontWeight: "bold" }}
          >
            Thử bấm vào đây để mở App
          </a>
          
          <button 
            onClick={() => {
              setCookie("mock_sso_session", "", -1); // Xóa cookie
              window.location.reload();
            }}
            style={{ padding: "8px 16px", backgroundColor: "#f0f0f0", color: "#333", border: "1px solid #ccc", cursor: "pointer", borderRadius: 4, marginTop: 10 }}
          >
            Xóa phiên và quay lại
          </button>
        </div>
      </div>
    );
  }

  if (redirectStatus === "redirecting") {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif", textAlign: "center" }}>
        <h3>Đang chuyển hướng về ứng dụng...</h3>
        <p style={{ color: "#666", fontSize: 14 }}>Nếu ứng dụng không tự động mở, vui lòng bấm vào nút bên dưới:</p>
        <a 
          href="gmosign://app/saml/mobileApp?tokenId=581"
          style={{ display: "inline-block", marginTop: 20, padding: "12px 24px", backgroundColor: "#0E71EB", color: "#fff", textDecoration: "none", borderRadius: 4, fontWeight: "bold" }}
        >
          Mở ứng dụng GMOSign
        </a>
      </div>
    );
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
      <a 
          href="gmosign://app/saml/mobileApp?tokenId=581"
          style={{ display: "inline-block", marginTop: 20, padding: "12px 24px", backgroundColor: "#0E71EB", color: "#fff", textDecoration: "none", borderRadius: 4, fontWeight: "bold" }}
        >
          Mở ứng dụng GMOSign
        </a>
    </div>
  );
}
