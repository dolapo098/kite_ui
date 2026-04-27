import React from "react";
import { Navbar } from "./index";
import { useAppSelector, useAppDispatch } from "../../hooks";

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

export function AppLayout({ children }: LayoutProps) {
  return <div className='min-h-screen bg-gray-50'>{children}</div>;
}
