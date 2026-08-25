import { NextResponse } from "next/server";

export async function POST() {
  // Không thể dùng NextResponse.redirect cho custom scheme (gmosign://)
  // Nên trả về một trang HTML tĩnh có meta refresh + thẻ a fallback
  const deepLink = "gmosign://app/saml/mobileApp?tokenId=581";
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0;url=${deepLink}">
  <title>Đang chuyển hướng...</title>
</head>
<body style="font-family: sans-serif; text-align: center; padding: 40px;">
  <h3>Đang chuyển hướng về ứng dụng...</h3>
  <p style="color: #666; font-size: 14px;">Nếu ứng dụng không tự động mở, vui lòng bấm vào nút bên dưới:</p>
  <a 
    href="${deepLink}" 
    style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #0E71EB; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;"
  >
    Mở ứng dụng GMOSign
  </a>
</body>
</html>`;

  const response = new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });

  // Lưu cookie session (2 phút = 120 giây)
  response.cookies.set("mock_sso_session", "true", {
    path: "/",
    maxAge: 120,
    sameSite: "lax",
  });

  return response;
}
