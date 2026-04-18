import './index.scss';

import SectionPage from '../SectionPage';

type AboutProps = {
  sectionRef: (element: HTMLElement | null) => void;
};

export default function About({ sectionRef }: AboutProps) {
  return (
    <SectionPage eyebrow="About" id="about" sectionRef={sectionRef} title="Magic Kale Salads">
      <div className="about-section">
        <p>
          Bonjour! Chez Chrystelle is rooted in family, hospitality, and food made to be shared.
        </p>
      </div>
    </SectionPage>
  );
}
