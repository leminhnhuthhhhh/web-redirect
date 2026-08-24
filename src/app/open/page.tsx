"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    window.location.replace("https://sample-app-redirect.vercel.app/mnApp");
  }, []);

  return "Đang chuyển hướng sau login";
}