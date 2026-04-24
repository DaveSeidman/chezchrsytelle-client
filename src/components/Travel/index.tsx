import './index.scss';

type TravelProps = {
  sectionRef: (element: HTMLElement | null) => void;
};

const travelStories = [
  {
    place: 'Accra',
    title: 'Street-side grilling and pepper heat',
    story:
      'We keep coming back to the way open-fire cooking builds depth so quickly: crisped edges, bright marinades, and spice that wakes everything up.'
  },
  {
    place: 'Dakar',
    title: 'Rice, fish, and deeply layered sauces',
    story:
      'Some of the most memorable meals are balanced without ever feeling precious, full of comfort, acid, heat, and patience in equal measure.'
  },
  {
    place: 'Marrakech',
    title: 'Market greens and preserved flavor',
    story:
      'Travel keeps reminding us that the best vegetable cooking is generous. Herbs, citrus, pickles, smoke, and texture all matter as much as the base ingredient.'
  },
  {
    place: 'Lisbon',
    title: 'Simple food with a long finish',
    story:
      'We love noticing how humble ingredients can still feel complete when the technique is thoughtful and the seasoning lands exactly where it should.'
  }
];

export default function Travel({ sectionRef }: TravelProps) {
  return (
    <div className="page travel" id="travel" ref={sectionRef}>
      <h1 className="page_title">Travel</h1>
      <div className="page_body">
        <div className="travel_intro">
          <p>
            We travel with our eyes wide open for food: the cooking methods, market rhythms, family meals, and small discoveries
            that end up shaping how we feed people back home.
          </p>
        </div>
        <div className="travel_strip" role="list">
          {travelStories.map((story) => (
            <article className="travel_card" key={story.title} role="listitem">
              <div className="image-placeholder travel_card_image" aria-hidden="true">
                Travel photo
              </div>
              <div className="travel_card_copy">
                <span className="travel_card_place">{story.place}</span>
                <h2>{story.title}</h2>
                <p>{story.story}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
