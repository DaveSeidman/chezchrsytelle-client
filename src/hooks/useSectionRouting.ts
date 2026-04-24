import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const sectionPaths: Record<string, string> = {
  home: '/',
  'lets-eat': '/lets-eat',
  travel: '/travel',
  locations: '/locations',
  contact: '/contact'
};

const pathSections = Object.fromEntries(Object.entries(sectionPaths).map(([section, path]) => [path, section])) as Record<string, string>;

export function useSectionRouting(sectionIds: string[]) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(pathSections[location.pathname] ?? 'home');
  const sectionElements = useRef<Record<string, HTMLElement | null>>({});
  const initialLoad = useRef(true);
  const scrollTriggeredRoute = useRef(false);
  const nextScrollBehavior = useRef<ScrollBehavior>('auto');
  const animationFrame = useRef<number | null>(null);

  function registerSection(sectionId: string) {
    return (element: HTMLElement | null) => {
      sectionElements.current[sectionId] = element;
    };
  }

  function navigateToSection(sectionId: string) {
    nextScrollBehavior.current = 'smooth';
    navigate(sectionPaths[sectionId] ?? '/');
  }

  useEffect(() => {
    const sectionId = pathSections[location.pathname] ?? 'home';
    const element = sectionElements.current[sectionId];

    setActiveSection(sectionId);

    if (scrollTriggeredRoute.current) {
      scrollTriggeredRoute.current = false;
      return;
    }

    if (!element) {
      return;
    }

    const behavior = initialLoad.current ? 'auto' : nextScrollBehavior.current;
    initialLoad.current = false;
    nextScrollBehavior.current = 'auto';

    window.requestAnimationFrame(() => {
      element.scrollIntoView({ behavior, block: 'start' });
    });
  }, [location.pathname]);

  useEffect(() => {
    function updateActiveSection() {
      let nextSection = activeSection;
      let closestDistance = Number.POSITIVE_INFINITY;
      const windowAnchor = window.innerHeight * 0.33;

      for (const sectionId of sectionIds) {
        const element = sectionElements.current[sectionId];

        if (!element) {
          continue;
        }

        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top - windowAnchor);

        if (distance < closestDistance) {
          closestDistance = distance;
          nextSection = sectionId;
        }
      }

      if (nextSection === activeSection) {
        return;
      }

      setActiveSection(nextSection);
      scrollTriggeredRoute.current = true;
      navigate(sectionPaths[nextSection] ?? '/', { replace: true });
    }

    function onScroll() {
      if (animationFrame.current) {
        window.cancelAnimationFrame(animationFrame.current);
      }

      animationFrame.current = window.requestAnimationFrame(updateActiveSection);
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);

      if (animationFrame.current) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [activeSection, navigate, sectionIds]);

  return {
    activeSection,
    navigateToSection,
    registerSection
  };
}
