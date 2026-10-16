import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const sectionPaths: Record<string, string> = {
  home: '/',
  'lets-eat': '/lets-eat',
  locations: '/locations',
  travel: '/travel',
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
  const programmaticScroll = useRef(false);
  const scrollIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function registerSection(sectionId: string) {
    return (element: HTMLElement | null) => {
      sectionElements.current[sectionId] = element;
    };
  }

  function navigateToSection(sectionId: string) {
    programmaticScroll.current = true;
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

    programmaticScroll.current = true;
    const frame = window.requestAnimationFrame(() => {
      element.scrollIntoView({ behavior, block: 'start' });
      // Also release when the section was already in view and no scroll event fires.
      if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
      scrollIdleTimer.current = setTimeout(() => {
        programmaticScroll.current = false;
      }, 180);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.key]);

  useEffect(() => {
    function updateActiveSection() {
      if (programmaticScroll.current) return;

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
      if (programmaticScroll.current) {
        // Keep the destination underlined while passing intermediate sections.
        // The idle fallback also supports browsers without scrollend.
        if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
        scrollIdleTimer.current = setTimeout(finishProgrammaticScroll, 180);
        return;
      }

      if (animationFrame.current) {
        window.cancelAnimationFrame(animationFrame.current);
      }

      animationFrame.current = window.requestAnimationFrame(updateActiveSection);
    }

    function finishProgrammaticScroll() {
      programmaticScroll.current = false;
      if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
      scrollIdleTimer.current = null;
    }

    function onManualScroll() {
      finishProgrammaticScroll();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
        onManualScroll();
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', finishProgrammaticScroll);
    window.addEventListener('wheel', onManualScroll, { passive: true });
    window.addEventListener('touchstart', onManualScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', finishProgrammaticScroll);
      window.removeEventListener('wheel', onManualScroll);
      window.removeEventListener('touchstart', onManualScroll);
      window.removeEventListener('keydown', onKeyDown);

      if (animationFrame.current) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [activeSection, navigate, sectionIds]);

  useEffect(() => () => {
    if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
  }, []);

  return {
    activeSection,
    navigateToSection,
    registerSection
  };
}
