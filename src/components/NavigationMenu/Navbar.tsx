import { useMemo, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Library, LogIn, Search, User, UserPlus2 } from 'lucide-react';
import { routes } from '../../routes';
import { routePaths } from '../../routes/routePaths';

interface NavbarProps {
  brand?: {
    name: string;
    logo?: ReactNode;
  };
  showSearch?: boolean;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
  className?: string;
}

export function Navbar({
  brand = { name: 'Grey Payment UI', logo: <Library size={18} /> },
  showSearch = true,
  onLogout,
  isAuthenticated = false,
  userEmail = '',
  className = '',
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = useMemo(
    () =>
      routes
        .filter((route) => route.meta?.title && route.path && !route.meta?.hideFromNav)
        .map((route) => ({
          label: route.meta?.title || '',
          href: route.path as string,
        })),
    [],
  );

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
    setSearchQuery(event.target.value);
  }

  function handleLogoutClick(): void {
    onLogout?.();
  }

  return (
    <nav className={`navbar ${className}`}>
      <div className="navbar-inner">
        <div className="navbar-left">
          <div className="navbar-brand">
            <div className="navbar-brand-logo">{brand.logo}</div>
            <span className="navbar-brand-name">{brand.name}</span>
          </div>

          <div className="navbar-links">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href} className="navbar-link">
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="navbar-right">
          {showSearch ? (
            <div className="navbar-search">
              <Search size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search transactions..."
              />
            </div>
          ) : null}

          {!isAuthenticated ? (
            <div className="navbar-auth-links">
              <Link to={routePaths.login} className="navbar-link">
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link to={routePaths.signup} className="navbar-link">
                <UserPlus2 size={16} />
                <span>Sign Up</span>
              </Link>
            </div>
          ) : (
            <div className="navbar-user">
              <div className="navbar-user-email">
                <User size={16} />
                <span>Welcome, {userEmail}</span>
              </div>
              <button type="button" className="logout-btn" onClick={handleLogoutClick}>
                <LogIn size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
