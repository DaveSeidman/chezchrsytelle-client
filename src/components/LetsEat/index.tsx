import './index.scss';

type LetsEatProps = {
  sectionRef: (element: HTMLElement | null) => void;
};

export default function LetsEat({ sectionRef }: LetsEatProps) {
  function focusContactName(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.pushState(null, '', '#contact');

    window.setTimeout(() => {
      document.getElementById('contact-name')?.focus({ preventScroll: true });
    }, 450);
  }

  return (
    <div className="page lets-eat" id="lets-eat" ref={sectionRef}>
      <h1 className="page_title">Let's Eat!</h1>
      <div className="page_body">
        <div className="lets-eat_section">
          <div className="lets-eat_column">
            <div className="lets-eat_image">
              <img alt="Family dinners at Chez Chrystelle" src="/food/family-dinners.png" />
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
              <img alt="Magic Kale Salad varieties" src="/food/salads.png" />
            </div>
            <div className="lets-eat_copy">
              <h2>Magic Kale Salad</h2>
              <p>
                Our Magic Kale Salad comes in four varieties: plain, vegan, grilled chicken, and grilled salmon.
              </p>
              <p>
                They're balanced, nutritious, and deeply delicious, built to feel like the kind of lunch that actually
                carries you through the rest of the day.
              </p>
              <p>
                Perfect for grab-and-go shelves, office lunches, and everyday regulars who want something fresh, filling, and
                easy to love.
              </p>
              <a className="lets-eat_cta" href="#contact" onClick={focusContactName}>
                Ask about salads
              </a>
            </div>
          </div>

          <div className="lets-eat_column">
            <div className="lets-eat_image">
              <img alt="Chefs Table dinner in the Chez Chrystelle backyard" src="/food/chefs-table.png" />
            </div>
            <div className="lets-eat_copy">
              <h2>Chefs Table</h2>
              <p>
                Reserve our private backyard in Greenwood and dine beneath the stars with a meal prepared and served by Chez
                Chrystelle.
              </p>
              <p>
                We can seat intimate parties of 2 through 20, with private service shaped around the night you want to host.
              </p>
              <p>
                It is personal, relaxed, and celebratory: a backyard table with the warmth of home and the care of a special
                occasion.
              </p>
              <a className="lets-eat_cta" href="#contact" onClick={focusContactName}>
                Reserve the table
              </a>
            </div>
          </div>

          <div className="lets-eat_column">
            <div className="lets-eat_image">
              <img alt="Chez Chrystelle catering service" src="/food/catering.png" />
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
              <a className="lets-eat_cta" href="#contact" onClick={focusContactName}>
                Plan catering
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
