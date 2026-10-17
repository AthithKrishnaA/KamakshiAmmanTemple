import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Menu,
  Phone,
  X,
} from 'lucide-react';
import {
  copy,
  DIRECTIONS_URL,
  galleryFilters,
  galleryPhotos,
  gurus,
  type GalleryCategory,
  type GalleryPhoto,
  type Language,
} from './content';

const navigation = [
  { key: 'home', href: '#temple-home' },
  { key: 'history', href: '#history' },
  { key: 'deity', href: '#kamatchi-amman' },
  { key: 'otherDeities', href: '#other-deities' },
  { key: 'gallery', href: '#gallery' },
  { key: 'visit', href: '#visit' },
  { key: 'specialEvents', href: '#special-events' },
  { key: 'contact', href: '#contact' },
] as const;

function readSavedLanguage(): Language {
  try {
    return window.localStorage.getItem('kamatchi-site-language') === 'ta' ? 'ta' : 'en';
  } catch {
    return 'en';
  }
}

function TempleFlower({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M28 5c7 9 8 15 0 22-8-7-7-13 0-22Z" fill="currentColor" />
      <path d="M9 16c12 1 17 4 19 14-10 3-16-3-19-14Z" fill="currentColor" />
      <path d="M47 16c-12 1-17 4-19 14 10 3 16-3 19-14Z" fill="currentColor" />
      <path d="M12 35c8-5 13-5 16 1 3-6 8-6 16-1-5 13-27 13-32 0Z" fill="currentColor" />
      <circle cx="28" cy="31" r="3" fill="#f7f0e4" />
      <path d="M17 50h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>(readSavedLanguage);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | GalleryCategory>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const closeLightboxRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'ta'
      ? 'அருள்மிகு ஸ்ரீ காமாட்சி அம்மன் திருக்கோயில்'
      : 'Arulmigu Sri Kamatchi Amman Temple';
    try {
      window.localStorage.setItem('kamatchi-site-language', language);
    } catch {
      // The language switch still works if browser storage is unavailable.
    }
  }, [language]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    firstMenuLinkRef.current?.focus();
    const handleMenuKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleMenuKeyDown);
    return () => window.removeEventListener('keydown', handleMenuKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!activePhoto) return undefined;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeLightboxRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivePhoto(null);
        return;
      }
      if (event.key === 'Tab') {
        const focusable = document.querySelectorAll<HTMLElement>('.lightbox-dialog button');
        const first = focusable.item(0);
        const last = focusable.item(focusable.length - 1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [activePhoto]);

  const visiblePhotos = activeFilter === 'all'
    ? galleryPhotos
    : galleryPhotos.filter((photo) => photo.category === activeFilter);

  const closeNavigation = () => {
    setMenuOpen(false);
    if (window.matchMedia('(max-width: 1220px)').matches) menuToggleRef.current?.focus();
  };

  const openPhoto = (photo: GalleryPhoto, trigger: HTMLElement) => {
    previousFocusRef.current = trigger;
    setActivePhoto(photo);
  };

  return (
    <>
      <a className="skip-link" href="#main-content">{t.skip}</a>
      <header className="site-header">
        <div className="header-inner page-shell">
          <a className="brand" href="#temple-home" aria-label={t.heroTitle} onClick={closeNavigation}>
            <span className="brand-mark"><TempleFlower /></span>
            <span className="brand-copy">
              <span className="brand-name">{t.heroTitle}</span>
              <span className="brand-subtitle">{language === 'en' ? 'TEMPLE · DEVOTION' : 'திருக்கோயில் · பக்தி'}</span>
            </span>
          </a>

          <nav id="mobile-navigation" className={`primary-nav${menuOpen ? ' is-open' : ''}`} aria-label={t.navLabel}>
            {navigation.map((item, index) => (
              <a key={item.key} href={item.href} ref={index === 0 ? firstMenuLinkRef : undefined} onClick={closeNavigation}>
                {t[item.key]}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <div className="language-switch" role="group" aria-label={t.language}>
              <button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>English</button>
              <span aria-hidden="true">|</span>
              <button type="button" lang="ta" aria-pressed={language === 'ta'} onClick={() => setLanguage('ta')}>தமிழ்</button>
            </div>
            <button
              className="menu-toggle"
              ref={menuToggleRef}
              type="button"
              aria-label={menuOpen ? t.closeMenu : t.menu}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="hero page-shell" id="temple-home" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-rule" />{t.heroKicker}</p>
            <h1 id="hero-title">{t.heroTitle}</h1>
            {language === 'en' && <p className="hero-tamil-name" lang="ta">{t.templeNameTamil}</p>}
            <p className="hero-intro">{t.heroIntro}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#history">{t.exploreHistory}<ArrowRight size={17} aria-hidden="true" /></a>
              <a className="button button-text" href={DIRECTIONS_URL} target="_blank" rel="noreferrer" aria-label={`${t.heroDirections} — ${t.mapOpens}`}>
                <MapPin size={17} aria-hidden="true" />{t.heroDirections}<ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            <div className="hero-footnote"><span className="hero-footnote-line" />{t.heroNote}</div>
            <a className="scroll-cue" href="#kamatchi-amman"><span>{t.scroll}</span><ArrowDown size={15} aria-hidden="true" /></a>
          </div>

          <figure className="hero-visual">
            <div className="hero-art-halo" aria-hidden="true" />
            <div className="hero-photo-frame">
              <img
                src="/images/sri-kamatchi-amman-deity-closeup.jpg"
                alt={language === 'en' ? 'Sri Kamatchi Amman in the sanctum, adorned with flowers' : 'கருவறையில் மலர் அலங்காரத்துடன் ஸ்ரீ காமாட்சி அம்மன்'}
                fetchPriority="high"
                decoding="async"
              />
              <span className="photo-corner photo-corner-top" aria-hidden="true" />
              <span className="photo-corner photo-corner-bottom" aria-hidden="true" />
            </div>
            <figcaption className="hero-caption">
              <TempleFlower className="caption-flower" />
              <span>{t.deity}</span>
              <span className="caption-dot" aria-hidden="true">·</span>
              <span>{language === 'en' ? 'Main sanctum' : 'முதன்மைக் கருவறை'}</span>
            </figcaption>
            <div className="hero-index" aria-hidden="true"><span>01</span><span className="hero-index-rule" /><span>04</span></div>
          </figure>
        </section>

        <div className="ornament-divider page-shell" aria-hidden="true"><span /><TempleFlower /><span /></div>

        <section className="deity-section section-pad" id="kamatchi-amman" aria-labelledby="deity-heading">
          <div className="page-shell deity-layout">
            <figure className="deity-photo-wrap">
              <img
                src="/images/main-sanctum-front-view.jpg"
                alt={language === 'en' ? 'Front view of the main sanctum' : 'முதன்மைக் கருவறையின் முன்புறத் தோற்றம்'}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="photo-label"><span className="photo-label-dot" />{t.sanctumCaption}</figcaption>
            </figure>
            <div className="deity-copy">
              <p className="eyebrow"><span className="eyebrow-rule" />{t.deityEyebrow}</p>
              <h2 id="deity-heading">{t.deityHeading}</h2>
              <p className="section-lead">{t.deityText}</p>
              <a className="inline-link" href="#gallery">{t.viewGallery}<ArrowRight size={17} aria-hidden="true" /></a>
              <div className="deity-aside">
                <TempleFlower className="aside-flower" />
                <span>{language === 'en' ? 'Sri Kamatchi Amman' : 'ஸ்ரீ காமாட்சி அம்மன்'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="other-section section-pad" id="other-deities" aria-labelledby="other-heading">
          <div className="page-shell">
            <div className="section-intro section-intro-split">
              <div>
                <p className="eyebrow"><span className="eyebrow-rule" />{t.otherEyebrow}</p>
                <h2 id="other-heading">{t.otherHeading}</h2>
              </div>
              <p className="section-lead">{t.otherText}</p>
            </div>
            <div className="shrine-grid">
              <figure className="shrine-card shrine-card-wide">
                <img src="/images/deities-in-wall-niches.jpg" alt={language === 'en' ? 'Deity figures in wall niches at the temple' : 'திருக்கோயில் சுவர் மாடங்களில் உள்ள தெய்வச் சிலைகள்'} loading="lazy" decoding="async" />
                <figcaption><span>01</span>{t.nichesCaption}</figcaption>
              </figure>
              <figure className="shrine-card shrine-card-tall">
                <img src="/images/additional-deity-shrine.jpg" alt={language === 'en' ? 'Additional deity shrine at the temple' : 'திருக்கோயிலில் உள்ள கூடுதல் தெய்வச் சன்னதி'} loading="lazy" decoding="async" />
                <figcaption><span>02</span>{t.shrineCaption}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="history-section section-pad" id="history" aria-labelledby="history-heading">
          <div className="page-shell">
            <div className="section-intro history-intro">
              <p className="eyebrow"><span className="eyebrow-rule" />{t.historyEyebrow}</p>
              <h2 id="history-heading">{t.historyHeading}</h2>
              <p className="section-lead">{t.historyText}</p>
            </div>
            <div className="history-gallery">
              <figure className="history-image history-collage">
                <img src="/images/temple-history-photo-collage-enhanced.png" alt={language === 'en' ? 'Collage of historical photographs of the temple' : 'திருக்கோயிலின் வரலாற்றுப் புகைப்படத் தொகுப்பு'} loading="lazy" decoding="async" />
                <figcaption>{language === 'en' ? 'Heritage photographs' : 'பாரம்பரியப் புகைப்படங்கள்'}</figcaption>
              </figure>
              <figure className="history-image history-inscription">
                <img src="/images/temple-inscription-enhanced.png" alt={language === 'en' ? 'Tamil inscription at the temple' : 'திருக்கோயிலில் உள்ள தமிழ் கல்வெட்டு'} loading="lazy" decoding="async" />
                <figcaption>{t.inscriptionCaption}</figcaption>
              </figure>
              <figure className="history-image history-portrait">
                <img src="/images/spiritual-leaders-framed-portrait-enhanced.png" alt={language === 'en' ? 'Framed portrait from the temple’s heritage collection' : 'திருக்கோயில் பாரம்பரியத் தொகுப்பில் உள்ள சட்டமிடப்பட்ட உருவப்படம்'} loading="lazy" decoding="async" />
                <figcaption>{t.portraitCaption}</figcaption>
              </figure>
            </div>
            <div className="history-gurus">
              <h3 id="gurus-heading">{t.gurusHeading}</h3>
              <p className="history-gurus-intro">{t.gurusIntro}</p>
              <ul className="guru-list" aria-labelledby="gurus-heading">
                {gurus.map((guru) => (
                  <li className="guru-card" key={guru.name.en}>
                    <p className="guru-order">{guru.order[language]}</p>
                    <h4 className="guru-name">{guru.name[language]}</h4>
                    <p className="guru-text">{guru.text[language]}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="gallery-section section-pad" id="gallery" aria-labelledby="gallery-heading">
          <div className="page-shell">
            <div className="gallery-heading-row">
              <div>
                <p className="eyebrow eyebrow-light"><span className="eyebrow-rule" />{t.galleryEyebrow}</p>
                <h2 id="gallery-heading">{t.galleryHeading}</h2>
                <p className="gallery-intro">{t.galleryText}</p>
              </div>
              <TempleFlower className="gallery-flower" />
            </div>
            <div className="gallery-filters" role="group" aria-label={t.galleryHeading}>
              {galleryFilters.map((filter) => (
                <button
                  className={`filter-button${activeFilter === filter.id ? ' is-active' : ''}`}
                  key={filter.id}
                  type="button"
                  aria-pressed={activeFilter === filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {t[filter.label]}
                </button>
              ))}
            </div>
            <div className="gallery-grid" aria-live="polite">
              {visiblePhotos.map((photo, index) => (
                <figure className={`gallery-card gallery-card-${photo.category}`} key={photo.src}>
                  <button
                    className="gallery-image-button"
                    type="button"
                    aria-label={`${t.openImage}: ${photo.alt[language]}`}
                    onClick={(event) => openPhoto(photo, event.currentTarget)}
                  >
                    <img src={photo.src} alt={photo.alt[language]} loading="lazy" decoding="async" />
                    <span className="gallery-zoom" aria-hidden="true"><ArrowUpRight size={18} /></span>
                    <span className="sr-only">{t.galleryImageLabel} {index + 1}</span>
                  </button>
                  <figcaption><span>{String(index + 1).padStart(2, '0')}</span>{photo.caption[language]}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="visit-section section-pad" id="visit" aria-labelledby="visit-heading">
          <div className="page-shell visit-layout">
            <figure className="visit-photo">
              <img src="/images/temple-entrance-front.jpg" alt={language === 'en' ? 'Front entrance of Arulmigu Sri Kamatchi Amman Temple' : 'அருள்மிகு ஸ்ரீ காமாட்சி அம்மன் திருக்கோயிலின் முன்புற நுழைவாயில்'} loading="lazy" decoding="async" />
              <span className="visit-photo-label"><MapPin size={15} aria-hidden="true" />{t.visit}</span>
            </figure>
            <div className="visit-copy">
              <p className="eyebrow"><span className="eyebrow-rule" />{t.visitEyebrow}</p>
              <h2 id="visit-heading">{t.visitHeading}</h2>
              <p className="section-lead">{t.visitText}</p>
              <a className="button button-primary" href={DIRECTIONS_URL} target="_blank" rel="noreferrer" aria-label={`${t.directions} — ${t.mapOpens}`}>
                <MapPin size={17} aria-hidden="true" />{t.directions}<ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <p className="visit-caption">{language === 'en' ? 'Directions open in Google Maps' : 'வழிகாட்டி Google Maps-இல் திறக்கும்'}</p>
            </div>
          </div>
        </section>

        <section className="events-section section-pad" id="special-events" aria-labelledby="events-heading">
          <div className="page-shell events-layout">
            <div className="events-copy">
              <p className="eyebrow"><span className="eyebrow-rule" />{t.eventsEyebrow}</p>
              <h2 id="events-heading">{t.eventsHeading}</h2>
            </div>
            <div className="events-status" role="status">
              <span className="events-status-icon"><CalendarDays size={23} aria-hidden="true" /></span>
              <div>
                <p className="events-status-title">{t.noEvents}</p>
                <p className="events-status-text">{t.eventsAvailability}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section section-pad" id="contact" aria-labelledby="contact-heading">
          <div className="page-shell">
            <div className="contact-heading-row">
              <div>
                <p className="eyebrow"><span className="eyebrow-rule" />{t.contactEyebrow}</p>
                <h2 id="contact-heading">{t.contactHeading}</h2>
              </div>
              <p className="section-lead">{t.contactText}</p>
            </div>
            <div className="contact-cards">
              <a className="contact-card" href="tel:+916382182841" aria-label={`${t.callContact} ${t.contactSivakumar}, +91 6382 182 841`}>
                <span className="contact-icon"><Phone size={19} aria-hidden="true" /></span>
                <span className="contact-details">
                  <span className="contact-name">{t.contactSivakumar}</span>
                  <span className="contact-number">+91 6382 182 841</span>
                </span>
                <ArrowUpRight className="contact-arrow" size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-shell footer-main">
          <div className="footer-brand-block">
            <a className="brand footer-brand" href="#temple-home" aria-label={t.backToTop}>
              <span className="brand-mark"><TempleFlower /></span>
              <span className="brand-copy">
                <span className="brand-name">{t.heroTitle}</span>
                <span className="brand-subtitle">{language === 'en' ? 'TEMPLE' : 'திருக்கோயில்'}</span>
              </span>
            </a>
            <p>{t.footerLine}</p>
          </div>
          <div className="footer-column">
            <h2>{t.footerNav}</h2>
            <a href="#history">{t.history}</a>
            <a href="#gallery">{t.gallery}</a>
            <a href="#visit">{t.visit}</a>
            <a href="#special-events">{t.specialEvents}</a>
            <a href="#contact">{t.contact}</a>
          </div>
          <div className="footer-column footer-visit">
            <h2>{t.visit}</h2>
            <a href={DIRECTIONS_URL} target="_blank" rel="noreferrer">{t.footerDirections}<ArrowUpRight size={14} aria-hidden="true" /></a>
            <div className="footer-language language-switch" role="group" aria-label={t.language}>
              <button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>English</button>
              <span aria-hidden="true">|</span>
              <button type="button" lang="ta" aria-pressed={language === 'ta'} onClick={() => setLanguage('ta')}>தமிழ்</button>
            </div>
          </div>
        </div>
        <div className="page-shell footer-bottom">
          <p>© {new Date().getFullYear()} · {t.copyright}</p>
          <a href="#temple-home">{t.backToTop}<ArrowUpRight size={13} aria-hidden="true" /></a>
        </div>
      </footer>

      {activePhoto && (
        <div className="lightbox" onMouseDown={(event) => { if (event.target === event.currentTarget) setActivePhoto(null); }}>
          <section className="lightbox-dialog" role="dialog" aria-modal="true" aria-label={activePhoto.alt[language]}>
            <button
              className="lightbox-close"
              type="button"
              aria-label={t.closeImage}
              ref={closeLightboxRef}
              onClick={() => setActivePhoto(null)}
            >
              <X size={21} aria-hidden="true" />
            </button>
            <img src={activePhoto.src} alt={activePhoto.alt[language]} />
            <p>{activePhoto.caption[language]}</p>
          </section>
        </div>
      )}
    </>
  );
}

export default App;
