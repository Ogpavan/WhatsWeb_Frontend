import { useEffect, useState } from "react";

export default function Navbar() {
  return (
    <nav className=" flex items-center  p-2 border-b bg-white/80 backdrop-blur sticky top-0 z-10 justify-between">
      <span className=" font-semibold text-[#064731]">Your Title</span>
      <p>Profile</p>
    </nav>
  );
}