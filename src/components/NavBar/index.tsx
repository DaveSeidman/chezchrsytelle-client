import './index.scss';
import logo from '../../assets/images/logo.svg';
import { useState } from 'react';
import type { SVGProps } from 'react';

type NavBarProps = {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onClientsClick: () => void;
};

const links = [
  { id: 'lets-eat', label: "Let's Eat", icon: LetsEatIcon },
  { id: 'locations', label: 'Salad Locations', icon: LocationsIcon },
  { id: 'travel', label: 'Travel', icon: TravelIcon },
  { id: 'contact', label: 'Contact', icon: ContactIcon }
];

type IconProps = SVGProps<SVGSVGElement>;

function LetsEatIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M4 12.5C5.4 15 8.2 16.5 12 16.5C15.8 16.5 18.6 15 20 12.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M6.5 12.5C7 10 8.7 8.5 12 8.5C15.3 8.5 17 10 17.5 12.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M8 18.5H16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <circle cx="12" cy="6" fill="currentColor" r="1.2" />
    </svg>
  );
}

function TravelIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M12 3.25c.77 0 1.4.63 1.4 1.4v5.4l6.1 3.6v1.75l-6.1-1.7v4l2.1 1.4v1.3l-3.5-.95-3.5.95v-1.3l2.1-1.4v-4l-6.1 1.7v-1.75l6.1-3.6v-5.4c0-.77.63-1.4 1.4-1.4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function LocationsIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path d="M5 9.5H19" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path
        d="M6.5 9.5L7.5 6.5H16.5L17.5 9.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M8 9.5V16.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M16 9.5V16.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M6.5 16.5H17.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <circle cx="12" cy="6.4" fill="currentColor" r="1.1" />
    </svg>
  );
}

function ContactIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M5 7.5H19V16.5H5V7.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M5.5 8L12 13L18.5 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export default function NavBar({ activeSection, onNavigate, onClientsClick }: NavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleNavigate(sectionId: string) {
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  }

  function handleClientsClick() {
    setMobileMenuOpen(false);
    onClientsClick();
  }

  return (
    <header className="nav-bar">
      <div className="page-shell nav-bar__inner">
        <button className="nav-bar__brand linkish" onClick={() => handleNavigate('home')} type="button">
          <img alt="Chez Chrystelle" className="nav-bar__brand-image" src={logo} />
        </button>
        <button
          aria-controls="main-navigation"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          className={mobileMenuOpen ? 'nav-bar__menu-toggle is-open' : 'nav-bar__menu-toggle'}
          onClick={() => setMobileMenuOpen((current) => !current)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          aria-label="Main navigation"
          className={mobileMenuOpen ? 'nav-bar__links is-open' : 'nav-bar__links'}
          id="main-navigation"
        >
          {links.map((link) => (
            <button
              className={activeSection === link.id ? 'nav-bar__link is-active' : 'nav-bar__link'}
              key={link.id}
              onClick={() => handleNavigate(link.id)}
              type="button"
            >
              <link.icon aria-hidden="true" className="nav-bar__link-icon" />
              <span>{link.label}</span>
            </button>
          ))}
          <button className="nav-bar__secondary nav-bar__secondary--mobile" onClick={handleClientsClick} type="button">
            Client Portal
          </button>
        </nav>
        <div className="nav-bar__actions">
          <button className="nav-bar__secondary" onClick={handleClientsClick} type="button">
            Client Portal
          </button>
        </div>
      </div>
    </header>
  );
}
