"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    window.location.replace("myapp://callback?token=1");
  }, []);

  return "Đang chuyển hướng sau login";
}
