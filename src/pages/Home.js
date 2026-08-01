import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {useLanguage} from '../contexts/LanguageContext';
import ImageLoader from '../components/ImageLoader';
import {getPrintDisplayTitle, prints} from '../data/prints';
import '../components/ImageLoader.css';
import './Home.css';

const truncateText = (text, maxLength = 160) => {
    if (!text) {
        return '';
    }
    if (text.length <= maxLength) {
        return text;
    }
    return `${text.substring(0, maxLength).trim()}\u2026`;
};

const Home = () => {
    const {t, translations} = useLanguage();
    const videoRef = useRef(null);
    const [ready, setReady] = useState(false);

    const latestPaintings = (() => {
        const all = translations?.gallery2026?.paintings?.slice(0, 4) ?? [];
        const isLandscape = (painting) =>
            typeof painting.link === 'string' && painting.link.includes('from-flesh-to-icon');
        const portraits = all.filter((painting) => !isLandscape(painting));
        const landscapes = all.filter(isLandscape);
        return [...portraits, ...landscapes];
    })();
    const featuredPrints = prints.slice(0, 6);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return undefined;
        }

        const tryPlay = () => {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {
                    // Autoplay may be blocked; muted loop still works on interaction.
                });
            }
        };

        tryPlay();
        video.addEventListener('loadeddata', tryPlay);
        return () => video.removeEventListener('loadeddata', tryPlay);
    }, []);

    return (
        <div className={`home-page${ready ? ' home-page--ready' : ''}`}>
            <section className="home-hero" aria-label={String(t('hero.headline')).replace(/\n/g, ' ')}>
                <div className="home-hero__media" aria-hidden="true">
                    <video
                        ref={videoRef}
                        className="home-hero__video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster="/images/2026/2026-imago.png"
                    >
                        <source src="/images/20230917_152650_1_1.mp4" type="video/mp4"/>
                    </video>
                    <div className="home-hero__veil"/>
                </div>

                <div className="home-hero__content">
                    <h1 className="home-hero__headline">
                        {String(t('hero.headline'))
                            .split('\n')
                            .map((line, index, lines) => (
                                <span key={`${line}-${index}`}>
                                    {line}
                                    {index < lines.length - 1 ? <br /> : null}
                                </span>
                            ))}
                    </h1>
                    <p className="home-hero__lede">{t('hero.lede')}</p>
                    <div className="home-hero__actions">
                        <Link to="/gallery/2026" className="home-hero__cta home-hero__cta--primary">
                            {t('hero.cta_paintings')}
                        </Link>
                        <Link to="/prints" className="home-hero__cta home-hero__cta--ghost">
                            {t('hero.cta_prints')}
                        </Link>
                    </div>
                    <a href="#latest-paintings" className="home-hero__scroll">
                        <span>{t('home.scroll')}</span>
                        <span className="home-hero__scroll-line" aria-hidden="true"/>
                    </a>
                </div>
            </section>

            <section className="home-section home-latest" id="latest-paintings">
                <div className="home-section__inner">
                    <header className="home-section__header">
                        <p className="home-section__eyebrow">{t('home.latest_eyebrow')}</p>
                        <h2 className="home-section__title">{t('latest_paintings')}</h2>
                        <p className="home-section__sub">{t('home.latest_sub')}</p>
                    </header>

                    <div className="home-latest__grid">
                        {latestPaintings.map((painting, index) => {
                            const description = t(painting.description);
                            const descText = typeof description === 'string' ? description : '';
                            const isLandscape =
                                typeof painting.link === 'string' &&
                                painting.link.includes('from-flesh-to-icon');
                            const isFeature = index === 0 && !isLandscape;

                            return (
                                <Link
                                    key={painting.link}
                                    to={`/painting/${painting.link}`}
                                    className={[
                                        'home-painting',
                                        isFeature ? 'home-painting--feature' : '',
                                        isLandscape ? 'home-painting--landscape' : '',
                                    ].filter(Boolean).join(' ')}
                                    aria-label={painting.title}
                                >
                                    <div className="home-painting__frame">
                                        {painting.sold ? (
                                            <span className="status-tag status-tag--sold status-tag--compact">
                                                {t('sold_tag')}
                                            </span>
                                        ) : (
                                            <span className="status-tag status-tag--available status-tag--compact">
                                                {t('available')}
                                            </span>
                                        )}
                                        <ImageLoader
                                            src={`/${painting.image}`}
                                            alt={painting.title}
                                            className="img-fluid"
                                        />
                                        <div className="home-painting__meta">
                                            <h3 className="home-painting__title">{painting.title}</h3>
                                            <p className="home-painting__info">
                                                {painting.dimensions}{' \u00B7 '}{t('oil_painting')}
                                            </p>
                                            {isFeature && descText ? (
                                                <p className="home-painting__desc">{truncateText(descText)}</p>
                                            ) : null}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="home-section__footer">
                        <Link to="/gallery/2026" className="home-link-btn">
                            {t('home.view_gallery')}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="home-section home-prints" id="prints_section">
                <div className="home-section__inner">
                    <header className="home-section__header">
                        <p className="home-section__eyebrow">{t('home.prints_eyebrow')}</p>
                        <h2 className="home-section__title">{t('prints.section_title')}</h2>
                        <p className="home-section__sub">{t('prints.section_subtitle')}</p>
                    </header>

                    <div className="home-prints__grid">
                        {featuredPrints.map((print) => {
                            const title = getPrintDisplayTitle(print, t);
                            return (
                                <Link
                                    key={print.slug}
                                    to={`/prints/${print.slug}`}
                                    className="home-print"
                                    aria-label={title}
                                >
                                    <div className="home-print__frame">
                                        <span className="home-print__badge">{t('prints.fine_art_print')}</span>
                                        <ImageLoader
                                            src={`/${print.image}`}
                                            alt={title}
                                            className="img-fluid"
                                        />
                                        <div className="home-print__meta">
                                            <h3 className="home-print__title">{title}</h3>
                                            <p className="home-print__price">
                                                {t('prints.from_price')}{' '}
                                                <strong>
                                                    {print.priceEur} {t('euro')}
                                                </strong>
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="home-section__footer">
                        <Link to="/prints" className="home-link-btn">
                            {t('prints.view_all')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
