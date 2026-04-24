import './index.scss';
import logo from '../../assets/images/logo.svg';

type NavBarProps = {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onClientsClick: () => void;
};

const links = [
  { id: 'lets-eat', label: "Let's Eat", iconClass: 'nav-bar__link-icon--lets-eat' },
  // { id: 'travel', label: 'Travel', iconClass: 'nav-bar__link-icon--travel' },
  { id: 'locations', label: 'Locations', iconClass: 'nav-bar__link-icon--locations' },
  { id: 'contact', label: 'Contact', iconClass: 'nav-bar__link-icon--contact' }
];

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
              <span aria-hidden="true" className={`nav-bar__link-icon ${link.iconClass}`} />
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
