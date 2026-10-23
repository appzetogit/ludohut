import React, { useEffect, useRef, useState } from 'react';
import useReveal from '../hooks/useReveal';
import useAutoScroll from '../hooks/useAutoScroll';
import useScrollFx from '../hooks/useScrollFx';
import useMagnetic from '../hooks/useMagnetic';
import useTilt from '../hooks/useTilt';
import { onIntro } from '../hooks/introGate';
import {
  MapPin, Users, ArrowRight, ShieldCheck, Navigation, Headphones, Wallet,
  Briefcase, Smartphone, QrCode, ChevronRight, Star, BadgeCheck, Megaphone,
  Car, CalendarClock, Search,
} from 'lucide-react';
import { useLanding } from '../landingContentContext';
import useAppModules from '../useAppModules';
import useVehicleTypes from '../useVehicleTypes';
import './home.css';

const initials = (name) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

// Hero badges store an icon name; components cannot be serialised.
const HERO_BADGE_ICONS = { ShieldCheck, Navigation, Headphones, Wallet };

// Photos live in Frontend/public/vehicles/ — see that folder's README + ATTRIBUTION
// before swapping any of them out.
const fallbackVehicles = [
  { name: 'Auto Rickshaw', type: 'Auto', seats: '3 Seats', bags: '1 Bag', price: '₹8', unit: '/km', image: '/vehicles/auto.jpg' },
  { name: 'Maruti Suzuki Dzire', type: 'Sedan', seats: '4 Seats', bags: '2 Bags', price: '₹12', unit: '/km', image: '/vehicles/dzire.jpg' },
  { name: 'Maruti Suzuki Ertiga', type: 'MUV', seats: '6 Seats', bags: '4 Bags', price: '₹16', unit: '/km', image: '/vehicles/ertiga.jpg' },
  { name: 'Toyota Innova Crysta', type: 'Premium SUV', seats: '6 Seats', bags: '4 Bags', price: '₹20', unit: '/km', image: '/vehicles/innova-crysta.jpg' },
  { name: 'Toyota Fortuner', type: 'Luxury SUV', seats: '7 Seats', bags: '4 Bags', price: '₹30', unit: '/km', image: '/vehicles/fortuner.jpg' },
];

// The hero is a Ludo board: four "homes", one per way to ride, around the house
// mark in the middle. The cutouts in /lh are the old yellow artwork re-tinted to
// the logo blue (taxi, bike); the auto and parcel keep their own colours.
const BOARD_TILES = [
  { key: 'city', label: 'City Ride', note: 'Cabs in minutes', image: '/lh/taxi-blue.png' },
  { key: 'bike', label: 'Bike Taxi', note: 'Beat the traffic', image: '/lh/bike-blue.png' },
  { key: 'auto', label: 'Auto', note: 'Short hops, low fares', image: '/lh/auto.png' },
  { key: 'parcel', label: 'Parcel', note: 'Same-day delivery', image: '/lh/parcel.png' },
];

const HOW_IT_WORKS = [
  { title: 'Set your pickup', desc: 'Enter where you are and where you are headed — city, outstation or airport.' },
  { title: 'Pick your ride', desc: 'Bike, auto, sedan or SUV. The fare you see is the fare you pay.' },
  { title: 'Track & arrive', desc: 'A verified captain arrives on time. Share your trip live and pay your way.' },
];

/** A die face: pips placed on a 3×3 grid, like the five on the logo. */
const PIPS = {
  1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8],
};
const Dice = ({ value, className = '' }) => (
  <span className={`lh-dice ${className}`} aria-hidden="true">
    {Array.from({ length: 9 }, (_, i) => (
      <span key={i} className={PIPS[value].includes(i) ? 'pip on' : 'pip'} />
    ))}
  </span>
);

const Home = ({ openBookingModal, setActiveTab }) => {
  const pageRef = useRef(null);
  const driverRail = useRef(null);

  useReveal(pageRef);
  useScrollFx(pageRef);
  useMagnetic(pageRef);
  useTilt(pageRef);
  useAutoScroll(driverRail, { interval: 3800 });

  // The hero waits for the intro curtain, then its pieces settle in with CSS
  // transitions. The timeout opens it regardless, so it can never stay hidden.
  const [heroIn, setHeroIn] = useState(false);
  useEffect(() => {
    const off = onIntro(() => setHeroIn(true));
    const fallback = setTimeout(() => setHeroIn(true), 2500);
    return () => {
      off();
      clearTimeout(fallback);
    };
  }, []);

  const [tab, setTab] = useState('city');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [passengers, setPassengers] = useState('1 Passenger');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    openBookingModal();
  };

  // All page content comes from the CMS, falling back to the bundled copy so the
  // page is never blank while the request is in flight or if it fails.
  const { services, valueProps, drivers, partners, launchCities, contact, brand, hero } = useLanding();
  // The app's own module list is the source of truth for what Ludo Hut sells;
  // the CMS list is only a fallback for when it cannot be reached.
  const appModules = useAppModules();
  const serviceCards = appModules.length ? appModules : services;
  const { vehicles } = useVehicleTypes(fallbackVehicles);

  return (
    <div className="home-page lh-home" ref={pageRef}>
      {/* HERO */}
      <section className={`lh-hero ${heroIn ? 'is-in' : ''}`}>
        <div className="lh-hero-grid" aria-hidden="true" />
        <div className="lh-hero-glow" aria-hidden="true" />

        <div className="container lh-hero-inner">
          <div className="lh-hero-copy">
            <h1 className="lh-hero-title lh-in" style={{ '--d': 1 }}>
              <span>{hero.titleLine1}</span>
              <span className="lh-grad">{hero.titleLine2}</span>
            </h1>
            <p className="lh-hero-sub lh-in" style={{ '--d': 2 }}>{hero.subtitle}</p>

            <div className="lh-hero-ctas lh-in" style={{ '--d': 3 }}>
              <button className="lh-btn lh-btn-primary" data-magnetic onClick={() => openBookingModal()}>
                {hero.primaryCta} <ArrowRight size={18} />
              </button>
              <button className="lh-btn lh-btn-ghost" onClick={() => setActiveTab('contact')}>
                <Smartphone size={18} /> {hero.secondaryCta}
              </button>
            </div>

            <ul className="lh-badges lh-in" style={{ '--d': 4 }}>
              {(hero.badges || []).map((badge, index) => {
                const BadgeIcon = HERO_BADGE_ICONS[badge.icon] || ShieldCheck;
                return (
                  <li key={index}>
                    <BadgeIcon size={16} />
                    <span>{badge.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* The board */}
          <div className="lh-board-wrap lh-in" style={{ '--d': 2 }}>
            <div className="lh-board" data-tilt>
              {BOARD_TILES.map((tile, i) => (
                <button
                  key={tile.key}
                  type="button"
                  className={`lh-home-tile t${i}`}
                  onClick={() => openBookingModal()}
                >
                  <span className="lh-tile-track" aria-hidden="true" />
                  <img src={tile.image} alt="" className="lh-tile-img" />
                  <span className="lh-tile-text">
                    <strong>{tile.label}</strong>
                    <small>{tile.note}</small>
                  </span>
                </button>
              ))}
              <div className="lh-board-center">
                <img src="/ludohut-mark.png" alt="Ludo Hut" />
              </div>
            </div>
            <Dice value={5} className="lh-float-dice d1" />
            <Dice value={3} className="lh-float-dice d2" />
          </div>
        </div>
      </section>

      {/* BOOKING BAR — overlaps the bottom of the hero */}
      <section className="lh-book">
        <div className="container">
          <form className="lh-book-card" onSubmit={handleSearchSubmit} data-reveal>
            <div className="lh-book-tabs" role="tablist">
              {[
                { id: 'city', label: 'City Ride' },
                { id: 'outstation', label: 'Outstation' },
                { id: 'airport', label: 'Airport Transfer' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  className={tab === t.id ? 'active' : ''}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="lh-book-fields">
              <label className="lh-field">
                <span>Pickup</span>
                <div>
                  <MapPin size={16} />
                  <input type="text" placeholder="Enter pickup location" value={pickup} onChange={(e) => setPickup(e.target.value)} />
                </div>
              </label>
              <label className="lh-field">
                <span>Drop</span>
                <div>
                  <MapPin size={16} />
                  <input type="text" placeholder="Enter drop location" value={drop} onChange={(e) => setDrop(e.target.value)} />
                </div>
              </label>
              <label className="lh-field">
                <span>Date &amp; Time</span>
                <div>
                  <CalendarClock size={16} />
                  <input
                    type="text"
                    placeholder="Select date & time"
                    value={dateTime}
                    onFocus={(e) => { e.target.type = 'datetime-local'; }}
                    onChange={(e) => setDateTime(e.target.value)}
                  />
                </div>
              </label>
              <label className="lh-field lh-field-sm">
                <span>Passengers</span>
                <div>
                  <Users size={16} />
                  <select value={passengers} onChange={(e) => setPassengers(e.target.value)}>
                    <option value="1 Passenger">1 Passenger</option>
                    <option value="2 Passengers">2 Passengers</option>
                    <option value="4 Passengers">4 Passengers</option>
                    <option value="6 Passengers">6 Passengers</option>
                  </select>
                </div>
              </label>
              <button type="submit" className="lh-btn lh-btn-primary lh-book-submit">
                <Search size={18} /> Find My Ride
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* SERVICES */}
      <section className="lh-section">
        <div className="container">
          <div className="lh-head" data-reveal>
            <div>
              <span className="lh-eyebrow"><Dice value={1} /> What we move</span>
              <h2 className="lh-title">Every ride, one hut.</h2>
            </div>
            <button className="lh-link" onClick={() => setActiveTab('services')}>
              All services <ChevronRight size={16} />
            </button>
          </div>

          <div className="lh-services" data-reveal-stagger>
            {serviceCards.map((s) => {
              // Modules carry a real icon image; the CMS fallback carries a
              // lucide component instead.
              const IconComp = typeof s.icon === 'function' ? s.icon : null;
              return (
                <button key={s.id} type="button" className="lh-service" onClick={() => setActiveTab('services')}>
                  <span className="lh-service-icon">
                    {s.image ? (
                      <img src={s.image} alt="" loading="lazy" />
                    ) : IconComp ? (
                      <IconComp size={22} />
                    ) : null}
                  </span>
                  <span className="lh-service-text">
                    <strong>{s.title}</strong>
                    {s.desc && <small>{s.desc}</small>}
                  </span>
                  <ArrowRight size={16} className="lh-service-arrow" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lh-section lh-how">
        <div className="container">
          <div className="lh-head lh-head-center" data-reveal>
            <div>
              <span className="lh-eyebrow"><Dice value={2} /> How it works</span>
              <h2 className="lh-title">Booked in three rolls.</h2>
            </div>
          </div>
          <ol className="lh-steps" data-reveal-stagger>
            {HOW_IT_WORKS.map((step, i) => (
              <li key={step.title} className="lh-step">
                <Dice value={i + 1} className="lh-step-dice" />
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHY LUDO HUT */}
      <section className="lh-why">
        <img src="/ludohut-mark.png" alt="" aria-hidden="true" className="lh-why-mark" data-parallax="-80" />
        <div className="container lh-why-inner">
          <div className="lh-why-intro" data-reveal>
            <span className="lh-eyebrow light"><Dice value={3} /> The difference</span>
            <h2 className="lh-title light">Why riders choose Ludo Hut</h2>
            <p>Every trip is backed by a real coordinator, a verified captain and a fare that does not change once you book.</p>
            <button className="lh-btn lh-btn-primary" onClick={() => openBookingModal()}>
              Book your first ride <ArrowRight size={18} />
            </button>
          </div>
          <div className="lh-why-grid" data-reveal-stagger>
            {valueProps.map((v, idx) => {
              const IconComponent = v.icon;
              return (
                <div key={idx} className="lh-why-card">
                  <span className="lh-why-icon"><IconComponent size={20} /></span>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FLEET */}
      <section className="lh-section">
        <div className="container">
          <div className="lh-head" data-reveal>
            <div>
              <span className="lh-eyebrow"><Dice value={4} /> The fleet</span>
              <h2 className="lh-title">Popular vehicles</h2>
            </div>
          </div>

          {/* Two identical tracks: the first slides left by exactly its own
              width plus one gap, at which point the second sits where the
              first began, so the loop has no visible seam and no end. */}
          <div className="lh-fleet">
            {[0, 1].map((pass) => (
              <div className="lh-fleet-track" key={pass} aria-hidden={pass === 1}>
                {vehicles.map((v, i) => (
                  <div key={i} className="lh-vehicle">
                    <div className="lh-vehicle-img">
                      <img src={v.image} alt={v.name} loading="lazy" />
                      <span>{v.type}</span>
                    </div>
                    <div className="lh-vehicle-body">
                      <h3>{v.name}</h3>
                      <div className="lh-vehicle-specs">
                        {v.seats && <span><Users size={14} /> {v.seats}</span>}
                        {v.bags && <span><Briefcase size={14} /> {v.bags}</span>}
                      </div>
                      <div className="lh-vehicle-foot">
                        {/* No price at all when the vehicle has no configured
                            rate — better than showing an empty or invented one. */}
                        <span className="lh-price">
                          {v.price ? <>{v.price}<small>{v.unit}</small></> : null}
                        </span>
                        <button className="lh-btn lh-btn-soft" onClick={() => openBookingModal()}>Book</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPTAINS */}
      <section className="lh-section lh-captains">
        <div className="container">
          <div className="lh-head" data-reveal>
            <div>
              <span className="lh-eyebrow"><Dice value={5} /> Who drives you</span>
              <h2 className="lh-title">Meet our captains</h2>
              <p className="lh-sub">Every Ludo Hut captain is background-verified, police-checked and rated by real riders.</p>
            </div>
            <button className="lh-link" onClick={() => setActiveTab('driver')}>
              Become a captain <ChevronRight size={16} />
            </button>
          </div>

          <div className="lh-captain-rail" data-reveal-stagger ref={driverRail}>
            {drivers.map((d, i) => (
              <div key={i} className="lh-captain" data-tilt>
                <div className="lh-captain-top">
                  <div className="avatar lh-captain-photo">
                    {initials(d.name)}
                    <img src={d.photo} alt={d.name} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                  <span className={`lh-captain-badge ${d.badge === 'Top Driver' ? 'top' : ''}`}>
                    <BadgeCheck size={12} /> {d.badge}
                  </span>
                </div>
                <h3>{d.name}</h3>
                <div className="lh-captain-rating">
                  <Star size={14} fill="currentColor" />
                  <strong>{d.rating}</strong>
                  <span>· {d.trips}</span>
                </div>
                <ul>
                  <li><ShieldCheck size={14} /> {d.experience}</li>
                  <li><Car size={14} /> {d.vehicle}</li>
                  <li><MapPin size={14} /> {d.city}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITIES + ADVERTISE */}
      <section className="lh-section">
        <div className="container lh-split">
          <div className="lh-cities" data-reveal>
            <span className="lh-eyebrow"><Dice value={6} /> Coverage</span>
            <h2 className="lh-title">Where you&apos;ll find us</h2>
            <p className="lh-sub">{contact.addressShort}</p>
            <div className="lh-city-list">
              {launchCities.map((c) => (
                <div key={c.name} className="lh-city">
                  <MapPin size={18} />
                  <div>
                    <strong>{c.name}</strong>
                    <small>{c.note}</small>
                  </div>
                </div>
              ))}
            </div>
            <a className="lh-link" href={contact.mapsUrl} target="_blank" rel="noreferrer">
              Get directions <ChevronRight size={16} />
            </a>
          </div>

          <div className="lh-advertise" data-reveal>
            <span className="lh-advertise-tag"><Megaphone size={14} /> For businesses</span>
            <h2>Advertise with Ludo Hut</h2>
            <p>
              Put your brand in front of thousands of daily riders — across our app, website,
              driver app, booking screens and push notifications.
            </p>
            <button className="lh-btn lh-btn-light" onClick={() => setActiveTab('advertise')}>
              Explore ad options <ArrowRight size={18} />
            </button>
            <img src="/ludohut-mark.png" alt="" aria-hidden="true" className="lh-advertise-mark" />
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="lh-partners">
        <div className="container">
          <h3 className="lh-partners-head">Trusted by hotels, airports &amp; malls</h3>
          <div className="lh-marquee" data-marquee-velocity>
            {/* rendered twice so the track loops without a visible seam; the
                copy is aria-hidden so screen readers do not repeat it */}
            {[0, 1].map((pass) => (
              <div className="lh-marquee-track" key={pass} aria-hidden={pass === 1}>
                {partners.map((p, index) => (
                  <div key={index} className="lh-partner">
                    <strong>{p.name}</strong>
                    {p.subtitle && <small>{p.subtitle}</small>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD */}
      <section className="lh-section lh-app-wrap">
        <div className="container">
          <div className="lh-app" data-reveal>
            <div className="lh-app-copy">
              <img src="/ludohut-wordmark-light.png" alt="Ludo Hut" className="lh-app-wordmark" />
              <h2>Your hut for every ride, in your pocket.</h2>
              <p>Book in seconds, track your captain live and keep every invoice in one place.</p>
              <div className="lh-app-stores">
                {/* Falls back to the placeholder icon until a QR image is uploaded. */}
                <div className="lh-qr">
                  {brand.playStoreQr || brand.appStoreQr ? (
                    <img src={brand.playStoreQr || brand.appStoreQr} alt="Scan to download the app" />
                  ) : (
                    <QrCode size={40} />
                  )}
                </div>
                <div className="lh-store-col">
                  {[
                    { url: brand.playStoreUrl, sub: 'GET IT ON', name: 'Google Play' },
                    { url: brand.appStoreUrl, sub: 'Download on the', name: 'App Store' },
                  ].map((badge) => {
                    const Tag = badge.url ? 'a' : 'div';
                    const props = badge.url ? { href: badge.url, target: '_blank', rel: 'noreferrer' } : {};
                    return (
                      <Tag key={badge.name} className="lh-store" {...props}>
                        <small>{badge.sub}</small>
                        <strong>{badge.name}</strong>
                      </Tag>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lh-phone" data-parallax="-60">
              <div className="lh-phone-screen">
                <img src="/ludohut-logo.png" alt="" />
                <span className="lh-phone-cta">Book a Ride</span>
                <div className="lh-phone-rows">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
