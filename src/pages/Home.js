import React, {useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import {useLanguage} from '../contexts/LanguageContext';
import ImageLoader from '../components/ImageLoader';
import {getPrintDisplayTitle, prints} from '../data/prints';
import '../components/ImageLoader.css';

const Home = () => {
    const {t} = useLanguage();
    const videoRef = useRef(null);

    useEffect(() => {
        // Load jQuery and Owl Carousel
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        const loadCSS = (href) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        };

        // Load jQuery first, then Owl Carousel
        loadScript('/js/jquery.min.js')
            .then(() => loadScript('/js/owl.carousel.min.js'))
            .then(() => {
                // eslint-disable-next-line no-undef
                const $ = window.$ || window.jQuery;
                if ($ && typeof $.fn !== 'undefined' && typeof $.fn.owlCarousel === 'function') {
                    $('.owl-carousel').owlCarousel({
                        center: true,
                        loop: true,
                        margin: 30,
                        autoplay: true,
                        responsiveClass: true,
                        responsive: {
                            0: {
                                items: 2,
                            },
                            767: {
                                items: 3,
                            },
                            1200: {
                                items: 4,
                            }
                        }
                    });
                }
            })
            .catch(console.error);

        // Load CSS
        loadCSS('/css/owl.carousel.min.css');
        loadCSS('/css/owl.theme.default.min.css');
    }, []);

    const profiles = [
        {
            img: '1.jpg',
            name: 'Aurora',
            badges: ['portrait', 'surrealism'],
            links: ['/painting/2024/aurora', 'https://www.instagram.com/doarti42/']
        },
        {
            img: '2.jpg',
            name: 'Alice',
            badges: ['present & past'],
            links: ['/painting/2024/alice', 'https://www.instagram.com/doarti42/']
        },
        {
            img: '3.jpg',
            name: 'Hera',
            badges: ['portraits', 'mother'],
            links: ['/painting/2024/hera', 'https://www.instagram.com/doarti42/']
        },
        {
            img: '4.jpg',
            name: 'Amaya Rei',
            badges: ['warrior'],
            links: ['/painting/2024/amaya-rei', 'https://www.instagram.com/doarti42/']
        },
        {
            img: '5.jpg',
            name: 'Nora',
            badges: ['warrior'],
            links: ['/painting/2023/nora', 'https://www.instagram.com/doarti42/']
        },
        {
            img: '6.jpg',
            name: 'Gaia',
            badges: ['woman body'],
            links: ['/painting/2024/gaia', 'https://www.instagram.com/doarti42/']
        }
    ];

    const paintings = [
        {
            name: "Aurora",
            image: "/images/2024/2024-b.png",
            link: "/painting/2024/aurora",
            year: 2024,
            size: "60 x 80 cm",
            type: "portrait",
            desc: t('painting_details.aurora_desc')
        },
        {
            name: "Alice",
            image: "/images/2024/2024-h.png",
            link: "/painting/2024/alice",
            year: 2024,
            size: "60 x 80 cm",
            type: "portrait",
            desc: t('painting_details.alice_desc')
        }
    ];

    return (
        <>
            <main>
                <section className="hero-section" aria-label="Featured Artwork Gallery">
                    <div className="container">
                        <header className="text-center mb-5 pb-2">
                            <h1 className="text-white" dangerouslySetInnerHTML={{__html: t('hero_title')}}></h1>
                        </header>
                        <div className="owl-carousel owl-theme" role="region" aria-label="Featured Artwork Carousel">
                            {profiles.map((profile, index) => (
                                <Link
                                    key={index}
                                    to={profile.links[0]}
                                    style={{textDecoration: 'none', color: 'inherit', display: 'block'}}
                                    aria-label={`View ${t(`names.${profile.name}`) || profile.name} painting details`}
                                >
                                    <article className="owl-carousel-info-wrap item"
                                             style={{cursor: 'pointer', transition: 'transform 0.2s ease'}}>
                                        <div style={{width: '100%', height: '400px', position: 'relative'}}>
                                            <ImageLoader
                                                src={`/images/profile/${profile.img}`}
                                                alt={`${t(`names.${profile.name}`) || profile.name} - Portrait by me`}
                                                className="owl-carousel-image img-fluid"
                                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                            />
                                        </div>
                                        <div className="owl-carousel-info">
                                            <h2 className="mb-2">
                                                {t(`names.${profile.name}`) || profile.name}
                                                {['Aurora', 'Alice', 'Nora'].includes(profile.name)}
                                            </h2>
                                            {profile.badges.map((badge, badgeIndex) => (
                                                <span key={badgeIndex}
                                                      className="badge">{t(`badges.${badge}`) || badge}</span>
                                            ))}
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="latest-podcast-section section-padding pb-0" id="section_2">
                    <div className="container">
                        <div className="section-title-wrap mb-5">
                            <h4 className="section-title">{t('latest_paintings')}</h4>
                        </div>
                        <div className="row justify-content-center mt-5">
                            {paintings.map((painting, index) => (
                                <div key={index} className="col-lg-6 col-12 mb-4">
                                    <Link to={painting.link}
                                          style={{textDecoration: 'none', color: 'inherit', display: 'block'}}>
                                        <div className="custom-block d-flex"
                                             style={{cursor: 'pointer', transition: 'transform 0.2s ease'}}>
                                            <div className="row">
                                                <div className="col-5" id="index-image">
                                                    <img src={painting.image} className="img-fluid" alt=""
                                                         id="section-painting-img"
                                                         loading="lazy"/>
                                                </div>
                                                <div className="col-7 custom-block-info" id="index-content">
                                                    <div className="custom-block-top d-flex mb-1">
                                                        <small className="me-4">
                                                            <i className="bi-clock-fill custom-icon"></i> {painting.year}
                                                        </small>
                                                        <span className="badge">{painting.size}</span>
                                                    </div>
                                                    <h5 className="mb-2">
                                                        {t(`names.${painting.name}`) || painting.name}
                                                    </h5>
                                                    <div className="profile-block d-flex">
                                                        <p>
                                                            <small className="me-4">
                                                                {t('oil_painting')}
                                                            </small>
                                                            <strong>{t('badges.portraits')}</strong>
                                                        </p>
                                                    </div>
                                                    <p>{painting.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="section_3">
                    <div className="row">
                        <div className="col-lg-12">
                            <video
                                ref={videoRef}
                                autoPlay
                                loop
                                muted
                                className="video-index"
                                style={{
                                    width: '100%',
                                    maxWidth: '100%',
                                    height: '800px',
                                    objectFit: 'cover',
                                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                                    maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskRepeat: 'no-repeat',
                                    WebkitMaskSize: '100%',
                                    maskSize: '100%'
                                }}
                            >
                                <source src="/images/20230917_152650_1_1.mp4" type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </section>

                <section className="section-padding pb-0" id="prints_section">
                    <div className="container">
                        <div className="section-title-wrap mb-5">
                            <h4 className="section-title">{t('prints.section_title')}</h4>
                        </div>
                        <div className="row">
                            {prints.slice(0, 6).map((print) => {
                                const title = getPrintDisplayTitle(print, t);
                                return (
                                    <div key={print.slug} className="col-lg-4 col-md-6 col-12 mb-4">
                                        <Link
                                            to={`/prints/${print.slug}`}
                                            style={{textDecoration: 'none', color: 'inherit', display: 'block'}}
                                        >
                                            <div
                                                className="custom-block custom-block-full"
                                                style={{cursor: 'pointer', transition: 'transform 0.2s ease', height: '100%'}}
                                            >
                                                <div className="custom-block-image-wrap" style={{height: '360px', overflow: 'hidden'}}>
                                                    <ImageLoader
                                                        src={`/${print.image}`}
                                                        alt={title}
                                                        className="custom-block-image img-fluid"
                                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                    />
                                                </div>
                                                <div className="custom-block-info">
                                                    <span className="badge mb-2">{t('prints.fine_art_print')}</span>
                                                    <h5 className="mb-2" style={{color: '#000'}}>{title}</h5>
                                                    <p className="mb-0">
                                                        {t('prints.from_price')}{' '}
                                                        <strong>{print.priceEur} {t('euro')}</strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-center mb-4">
                            <Link to="/prints" className="btn custom-btn">
                                {t('prints.view_all')}
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;
