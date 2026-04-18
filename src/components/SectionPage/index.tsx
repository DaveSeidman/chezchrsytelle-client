import './index.scss';

import type { ReactNode, Ref } from 'react';

type SectionPageProps = {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  sectionRef?: Ref<HTMLElement>;
};

export default function SectionPage({ id, eyebrow, title, children, sectionRef }: SectionPageProps) {
  return (
    <section className="section-page page-shell" id={id} ref={sectionRef}>
      <div className="section-page__header">
        {eyebrow ? <p className="section-page__eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      <div className="section-page__body card">{children}</div>
    </section>
  );
}
