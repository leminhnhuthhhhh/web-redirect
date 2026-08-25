"use client";

import { useEffect, useState } from "react";

function getCookie(name: string): string | null {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  } catch {
    return null;
  }
}

export default function Page() {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    // Chỉ dùng JS để check session cho lần mở lại (auto-redirect)
    // Nếu JS crash trên iOS 15, form vẫn hoạt động vì dùng action HTML thuần
    try {
      const savedSession = getCookie("mock_sso_session");
      if (savedSession) {
        setHasSession(true);
        window.location.href = "gmosign://app/saml/mobileApp?tokenId=581";
      }
    } catch {
      // JS crash -> form HTML thuần vẫn hoạt động
    }
  }, []);

  // Nếu đã có session, hiển thị trang chuyển hướng với nút bấm thủ công
  if (hasSession) {
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

  // Form đăng nhập — dùng action HTML thuần, KHÔNG phụ thuộc vào JS
  // Khi submit, trình duyệt sẽ POST thẳng đến /api/auth/login
  // API route trả về HTML có meta refresh để redirect sang deeplink
  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 400, margin: "0 auto" }}>
      <h2>Mock SSO Login (Zoom/SAML)</h2>
      <form 
        method="POST" 
        action="/api/auth/login"
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Email / Username</label>
          <input 
            type="email" 
            name="email"
            defaultValue="user@example.com" 
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }} 
            required 
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Password</label>
          <input 
            type="password" 
            name="password"
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
        * Cookie này sẽ tự động hết hạn sau <b>2 phút</b>. Sau 2 phút, nếu mở lại trang này, bạn sẽ phải đăng nhập lại từ đầu.
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
