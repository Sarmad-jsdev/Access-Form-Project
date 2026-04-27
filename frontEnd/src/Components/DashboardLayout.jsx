import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import assets from "../assets/assests";

import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ClipboardList,
  User,
  ChartBar,
  } from "lucide-react";

/* ─── nav definitions per role ─────────────────────────────── */
const navByRole = {
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/AdminDashboard" },
    { label: "Users", icon: User, path: "/admin/users" },
    { label: "Surveys", icon: ClipboardList, path: "/admin/surveys" },
    { label: "Settings", icon: Settings, path: "/dashboard/settings" },
  ],
  creator: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/CreatorDashboard" },
    { label: "Create Survey", icon: PlusCircle, path: "/CreateForm" },
    { label: "Settings", icon: Settings, path: "/dashboard/settings" },
  ],
  respondent: [
    { label: "Surveys", icon: ClipboardList, path: "/Respondent" },
    { label: "Settings", icon: Settings, path: "/dashboard/settings" },
  ],
};

const roleLabel = {
  admin: "Admin",
  creator: "Creator",
  respondent: "Respondent",
};

/* ─── sidebar inner content ─────────────────────────────────── */
const SidebarContent = ({ user, navItems, location, onLogout, onClose }) => (
  <div className="flex flex-col h-full">
    {/* Brand */}
    <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center cursor-pointer">
        <Link
          to="/"
          className="flex items-center text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded-sm"
        >
          <img
            src={assets.logo}
            alt="AccessForm Logo"
            className="h-10 w-auto"
          />
          <span className="ml-2 text-lg font-bold">Access Form</span>
        </Link>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-[var(--text-secondary)] md:hidden"
        >
          <X size={20} />
        </button>
      )}
    </div>

    {/* User card */}
    <div className="mx-3 mt-4 mb-1 px-3 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-on-primary)] font-bold text-sm mb-2"
        style={{ background: "var(--primary)" }}
      >
        {user?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>
      <p className="text-[var(--text-primary)] font-semibold text-sm leading-tight truncate">
        {user?.name}
      </p>
      <p className="text-[var(--text-secondary)] text-xs mt-0.5">
        {roleLabel[user?.role] || user?.role}
      </p>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
      <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-widest px-3 mb-2">
        Menu
      </p>
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-all
              ${
                active
                  ? "text-[var(--text-on-primary)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
              }
            `}
            style={active ? { background: "var(--primary)" } : {}}
          >
            <item.icon size={16} className="flex-shrink-0" />
            <span className="flex-1">{item.label}</span>
            {active && <ChevronRight size={13} className="opacity-60" />}
          </Link>
        );
      })}
    </nav>

    {/* Logout */}
    <div className="px-3 pb-5 pt-2 border-t border-[var(--border)]">
      <button
        onClick={onLogout}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium
          text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-red-500 transition-all"
      >
        <LogOut size={16} />
        Log Out
      </button>
    </div>
  </div>
);

/* ─── main layout wrapper ────────────────────────────────────── */
const DashboardLayout = ({ children, title }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = navByRole[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-[var(--bg-secondary)] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0 bg-[var(--bg-primary)] border-r border-[var(--border)]">
        <SidebarContent
          user={user}
          navItems={navItems}
          location={location}
          onLogout={handleLogout}
          onClose={null}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--bg-primary)] border-r border-[var(--border)] z-50 flex flex-col">
            <SidebarContent
              user={user}
              navItems={navItems}
              location={location}
              onLogout={handleLogout}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header bar */}
        <header className="flex items-center gap-4 px-6 py-3.5 bg-[var(--bg-primary)] border-b border-[var(--border)] flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition"
          >
            <Menu size={20} />
          </button>

          {title && (
            <h1 className="text-base font-semibold text-[var(--text-primary)] flex-1">
              {title}
            </h1>
          )}
          {!title && <div className="flex-1" />}

          {/* Right side avatar */}
          <div className="flex items-center gap-2.5">
            <span className="text-sm text-[var(--text-secondary)]">
              {user?.email}
            </span>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-on-primary)] font-bold text-xs"
              style={{ background: "var(--primary)" }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
