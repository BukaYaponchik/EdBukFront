import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

// Исправленный импорт SVG с TypeScript типами
import { ReactComponent as CartIcon } from './HatIcons/cart.svg';
import { ReactComponent as SettingsIcon } from './HatIcons/settings.svg';
import { ReactComponent as ProfileIcon } from './HatIcons/profile.svg';

const Header: React.FC = () => {
    return (
        <header className="app-header">
            {/* Декоративный логотип без ссылки */}
            <div className="logo">
                <img
                    src="/logo.png" // Исправленный путь
                    alt="Декоративный логотип"
                    className="logo-image"
                    style={{ cursor: 'default' }}
                />
            </div>

            <nav className="nav-links">
                <NavLink to="/courses">Курсы</NavLink>
                <NavLink to="/school">Школа</NavLink>
                <NavLink to="/timetable">Расписание</NavLink>
            </nav>

            <div className="header-icons">
                <IconLink to="/cart">
                    <CartIcon className="icon-svg" />
                </IconLink>
                <IconLink to="/settings">
                    <SettingsIcon className="icon-svg" />
                </IconLink>
                <IconLink to="/profile">
                    <ProfileIcon className="icon-svg" />
                </IconLink>
            </div>
        </header>
    );
};
const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`nav-link ${isActive ? 'active' : ''}`}
        >
            <span className="hover-effect"></span>
            <span className="corner-tl"></span>
            <span className="corner-tr"></span>
            <span className="corner-bl"></span>
            <span className="corner-br"></span>
            {children}
        </Link>
    );
};

const IconLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
    <Link to={to} className="icon-link">
        <span className="icon-hover-effect"></span>
        {children}
    </Link>
);

export default Header;