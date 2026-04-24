import './index.scss';
import logo from '../../assets/images/logo.svg';
import type { SVGProps } from 'react';

type NavBarProps = {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onClientsClick: () => void;
};

const links = [
  { id: 'lets-eat', label: "Let's Eat", icon: LetsEatIcon },
  { id: 'travel', label: 'Travel', icon: TravelIcon },
  { id: 'locations', label: 'Locations', icon: LocationsIcon },
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
        d="M4.5 14.4L10.2 12.9L18.8 6.6C19.4 6.2 20.1 6.2 20.5 6.8C20.9 7.3 20.8 8.1 20.2 8.5L11.7 14.7L12.8 20.4L10.8 21L8.3 15.8L3.9 17L3.2 15.1L7.6 13.8L6.5 9.2L8.5 8.6L10.6 13.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
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
  return (
    <header className="nav-bar">
      <div className="page-shell nav-bar__inner">
        <button className="nav-bar__brand linkish" onClick={() => onNavigate('home')} type="button">
          <img alt="Chez Chrystelle" className="nav-bar__brand-image" src={logo} />
        </button>
        <nav className="nav-bar__links" aria-label="Main navigation">
          {links.map((link) => (
            <button
              className={activeSection === link.id ? 'nav-bar__link is-active' : 'nav-bar__link'}
              key={link.id}
              onClick={() => onNavigate(link.id)}
              type="button"
            >
              <link.icon aria-hidden="true" className="nav-bar__link-icon" />
              <span>{link.label}</span>
            </button>
          ))}
        </nav>
        <div className="nav-bar__actions">
          <button className="nav-bar__secondary" onClick={onClientsClick} type="button">
            Client Portal
          </button>
        </div>
      </div>
    </header>
  );
}
