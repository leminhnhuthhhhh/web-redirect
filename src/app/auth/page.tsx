import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const savedSession = cookieStore.get("mock_sso_session");

  // Nếu đã có session → render trang auto-redirect (không cần JS)
  if (savedSession) {
    return (
      <html>
        <head>
          <meta httpEquiv="refresh" content="0;url=gmosign://app/saml/mobileApp?tokenId=581" />
        </head>
        <body style={{ padding: 40, fontFamily: "sans-serif", textAlign: "center" }}>
          <h3>Đang chuyển hướng về ứng dụng...</h3>
          <p style={{ color: "#666", fontSize: 14 }}>Nếu ứng dụng không tự động mở, vui lòng bấm vào nút bên dưới:</p>
          <a 
            href="gmosign://app/saml/mobileApp?tokenId=581"
            style={{ display: "inline-block", marginTop: 20, padding: "12px 24px", backgroundColor: "#0E71EB", color: "#fff", textDecoration: "none", borderRadius: 4, fontWeight: "bold" }}
          >
            Mở ứng dụng GMOSign
          </a>
        </body>
      </html>
    );
  }

  // Chưa có session → hiển thị form đăng nhập (HTML thuần, không cần JS)
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
