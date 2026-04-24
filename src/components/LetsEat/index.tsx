import './index.scss';

type LetsEatProps = {
  sectionRef: (element: HTMLElement | null) => void;
};

const saladImage = new URL('../../assets/images/salads.png', import.meta.url).href;
const familyDinnersImage = new URL('../../assets/images/family-dinners.png', import.meta.url).href;
const cateringImage = new URL('../../assets/images/catering.png', import.meta.url).href;

export default function LetsEat({ sectionRef }: LetsEatProps) {
  return (
    <div className="page lets-eat" id="lets-eat" ref={sectionRef}>
      <h1 className="page_title">Let&apos;s Eat</h1>
      <div className="page_body">
        <div className="lets-eat_section">
          <div className="lets-eat_column">
            <div className="lets-eat_image">
              <img alt="Family dinners at Chez Chrystelle" src={familyDinnersImage} />
            </div>
            <div className="lets-eat_copy">
              <h2>Family Dinners</h2>
              <p>
                For several years, Chez Chrystelle hosted Tuesday night stoop dinner pickups, a weekly rhythm that brought
                neighbors together over home-cooked food and a little Brooklyn magic.
              </p>
              <p>
                We pressed pause while the salad side of the business got up and running, but family dinners are still part of
                the long-term vision and we plan on bringing them back.
              </p>
            </div>
          </div>

          <div className="lets-eat_column">
            <div className="lets-eat_image">
              <img alt="Magic Kale Salad varieties" src={saladImage} />
            </div>
            <div className="lets-eat_copy">
              <h2>Magic Kale Salad</h2>
              <p>
                Our Magic Kale Salad comes in four varieties: plain, vegan, grilled chicken, and grilled salmon.
              </p>
              <p>
                They&apos;re balanced, nutritious, and deeply delicious, built to feel like the kind of lunch that actually
                carries you through the rest of the day.
              </p>
              <p>
                Perfect for grab-and-go shelves, office lunches, and everyday regulars who want something fresh, filling, and
                easy to love.
              </p>
            </div>
          </div>

          <div className="lets-eat_column">
            <div className="lets-eat_image">
              <img alt="Chez Chrystelle catering spread" src={cateringImage} />
            </div>
            <div className="lets-eat_copy">
              <h2>Catering</h2>
              <p>
                Chez Chrystelle is also building out catering for parties, office lunches, team gatherings, and other events
                that need food with warmth, color, and a sense of occasion.
              </p>
              <p>
                This section is still a placeholder for now, but it will eventually outline packages, serving formats, and how
                to book us for larger meals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
