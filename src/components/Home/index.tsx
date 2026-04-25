import './index.scss';

type HomeProps = {
  sectionRef: (element: HTMLElement | null) => void;
};

export default function Home({ sectionRef }: HomeProps) {
  return (
    <div className="page home" id="home" ref={sectionRef}>
      <h1 className="page_title">Bonjour!</h1>
      <div className="page_body">
        <div className="home-section">
          <div className="home-section__copy">
            <p>
              My name is Chrystelle and I am a <strong>Proud Cameroonian mama</strong> living in Brooklyn with my husband and
              three growing children and <em>ChezChrystelle</em> is how we share our home with <strong>you!</strong>
            </p>
            <p>
              During the pandemic we started offering homemade family dinners to friends and neighbors which they picked up in front of our stoop which grew into a weekly gathering and part of the community.
            </p>
          </div>
          <div className="home-section__image">
            <img alt="Chrystelle smiling in her kitchen" src="/about/chrystelle1.png" />
          </div>
        </div>
      </div>
    </div>
  );
}
