import './index.scss';

import SectionPage from '../SectionPage';

type AboutProps = {
  sectionRef: (element: HTMLElement | null) => void;
};

export default function About({ sectionRef }: AboutProps) {
  return (
    <SectionPage eyebrow="About" id="about" sectionRef={sectionRef} title="Cooking that feels like being welcomed in">
      <div className="about-section">
        <p>
          Bonjour! Chez Chrystelle is rooted in family, hospitality, and food made to be shared. The site is designed
          to tell that story clearly first, then make ordering smooth for approved clients.
        </p>
        <p>
          For now the catalog focuses on salads in small and large sizes, with flexible store, pricing, and order
          controls behind the scenes so the business can grow without another full rebuild.
        </p>
      </div>
    </SectionPage>
  );
}
