import React from 'react';
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Projects from './Projects';
import Catalog from './Catalog';
import Certificates from './Certificates';
import Contact from './Contact';
import Blog from './Blog';

import Team from './Team';

const MainLayout = ({ showCatalog, setShowCatalog }) => {
    return (
        <>
            <Hero setShowCatalog={setShowCatalog} />
            <About />
            <Catalog showCatalog={showCatalog} setShowCatalog={setShowCatalog} />
            <Certificates />
            <Services />
            <Projects />
            <Team />
            <Blog />
            <Contact />
        </>
    );
};

export default MainLayout;
