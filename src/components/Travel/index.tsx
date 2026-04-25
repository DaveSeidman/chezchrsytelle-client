import './index.scss';

type TravelProps = {
  sectionRef: (element: HTMLElement | null) => void;
};

const travelStories = [
  {
    place: 'Florida',
    title: 'April 2026',
    imageSrc: '/travel/florida_2026.png',
    story:
      'Florida always turns into a food adventure for us. We catch fish, gather mollusks or sea urchins, and come home with stories that usually end with: ask us about mullet sperm sacks.'
  },
  {
    place: 'Montreal',
    title: 'August 2024',
    imageSrc: '/travel/montreal_2024.gif',
    story:
      'In Montreal we found a beautiful mix of polished French food and imported Cameroonian goodies, which felt a lot like seeing two parts of our world talking to each other.'
  },
  {
    place: 'Cameroon',
    title: 'July 2022',
    imageSrc: '/travel/cameroon_2022.png',
    story:
      'In Cameroon we eat everything: slaughter chickens, goats, and pigs, visit the night markets, and return again and again to the standouts, especially the soya and the poisson braise.'
  },
  {
    place: 'Connecticut',
    title: 'August 2021',
    imageSrc: '/travel/connecticut_2021.png',
    story:
      'Closer-to-home travel matters too, especially when it reveals new farm stands, regional staples, and little shifts in how people gather around food.'
  },
  {
    place: 'Cameroon',
    title: 'December 2015',
    imageSrc: '/travel/cameroon_2015.png',
    story:
      'That earlier Cameroon trip still shapes us too: layered stews, grilled fish, greens, busy markets, and the kind of cooking that makes abundance feel completely ordinary.'
  },
  {
    place: 'Taiwan',
    title: 'March 2013',
    imageSrc: '/travel/taiwan_2013.gif',
    story:
      'We loved the old city, the spicy noodles, and the whole atmosphere of Tamsui night market. There were bars with pools in them where you could fish while drinking beer or smoking cigarettes, then grill the shrimp right at your table.'
  },
  {
    place: 'Thailand',
    title: 'April 2013',
    imageSrc: '/travel/thailand_2013.png',
    story:
      'In Thailand we rented a car and drove with no destination, finding amazing curries, the freshest seafood, and one delicious surprise after another.'
  },
  {
    place: 'France',
    title: 'January 2010',
    imageSrc: '/travel/france_2010.png',
    story:
      'In France we had lovely lunches in local bistros, the kind of meals that make simple food feel elegant without ever losing its warmth.'
  }
];

export default function Travel({ sectionRef }: TravelProps) {
  return (
    <div className="page travel" id="travel" ref={sectionRef}>
      <h1 className="page_title">Around the World</h1>
      <div className="page_body">
        <div className="travel_intro">
          <p>
            We travel with our eyes wide open for food: cooking methods, market rhythms, family meals, and the small discoveries
            that end up shaping how we feed people back home.
          </p>
        </div>
        <div className="travel_strip" role="list">
          {travelStories.map((story) => (
            <article className="travel_card" key={story.title} role="listitem">
              {story.imageSrc ? (
                <div className="travel_card_image">
                  <img alt={`${story.place} travel photo`} src={story.imageSrc} />
                </div>
              ) : (
                <div className="image-placeholder travel_card_image" aria-hidden="true">
                  Travel photo
                </div>
              )}
              <div className="travel_card_copy">
                <h2 className="travel_card_place">{story.place}</h2>
                <span className="travel_card_date">{story.title}</span>
                <p>{story.story}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
