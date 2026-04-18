import './index.scss';

import SectionPage from '../SectionPage';

type HomeProps = {
  sectionRef: (element: HTMLElement | null) => void;
};

export default function Home({ sectionRef }: HomeProps) {
  return (
    <SectionPage eyebrow="Brooklyn" id="home" sectionRef={sectionRef} title="Fresh weekly salads for your table">
      <div className="home-section">
        <div className="home-section__copy">
          <p>
            Chez Chrystelle brings bright, generous salads and warm hospitality to your week. The public site keeps
            the menu easy to browse, while approved clients can sign in and place orders directly online.
          </p>
          <p>
            This first version keeps the experience simple: browse the offerings, reach out with questions, and if
            you are an approved client you can log in to order and track your status.
          </p>
        </div>
        <div className="home-section__feature">
          <span>Handmade meals</span>
          <span>Client ordering</span>
          <span>Admin-managed pickup</span>
        </div>
      </div>
    </SectionPage>
  );
}
