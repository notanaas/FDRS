import React, { useEffect } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/all';
import './styles.css';
import Footer from '../Footer'; // Adjust the path as necessary

import image2 from './2.jpg';
import FacultyButtons from '../FacultyButtons'; 

// Function to initialize GSAP animations
const gsapInit = () => {
  gsap.registerPlugin(Observer);

  let sections = document.querySelectorAll('section'),
    images = document.querySelectorAll('.bg'),
    outerWrappers = gsap.utils.toArray('.outer'),
    innerWrappers = gsap.utils.toArray('.inner'),
    currentIndex = -1,
    wrap = gsap.utils.wrap(0, sections.length),
    animating;

  gsap.set(outerWrappers, { yPercent: 100 });
  gsap.set(innerWrappers, { yPercent: -100 });

  const gotoSection = (index, direction) => {
    index = wrap(index);
    animating = true;
    let fromTop = direction === -1,
      dFactor = fromTop ? -1 : 1,
      tl = gsap.timeline({
        defaults: { duration: 1.25, ease: 'power1.inOut' },
        onComplete: () => (animating = false),
      });

    if (currentIndex >= 0) {
      gsap.set(sections[currentIndex], { zIndex: 0 });
      tl.to(images[currentIndex], { yPercent: -15 * dFactor })
        .set(sections[currentIndex], { autoAlpha: 0 });
    }

    gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
    tl.fromTo(
      [outerWrappers[index], innerWrappers[index]],
      { yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
      { yPercent: 0 },
      0
    )
    .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0);

    currentIndex = index;
  };

  Observer.create({
    type: 'wheel,touch,pointer',
    wheelSpeed: -1,
    onDown: () => !animating && gotoSection(currentIndex - 1, -1),
    onUp: () => !animating && gotoSection(currentIndex + 1, 1),
    tolerance: 10,
    preventDefault: true,
  });

  gotoSection(0, 1);
};

// Array with section data
const sectionsData = [
  { title: 'Explore our FDRS', image: image2 },
  { title: 'Explore Our Faculties',image:image2},
  { title: 'Top favioarted resources ', image: image2 },
];

export const Parallax = () => {
  useEffect(() => {
    gsapInit();
    gsap.to(".arrow", { y: 20, duration: 1, yoyo: true, repeat: -1 });
  }, []);

  return (
    <>
      {sectionsData.map((section, index) => (
        <section key={section.title}>
          <div className="outer">
            <div className="inner">
              <div
                className="bg"
                style={{ backgroundImage: `url(${section.image})` }}
              >
                <h2>{section.title}</h2>
                {index === 1 ? <FacultyButtons /> : null}
                {index === 0 ?  <div className="explore-arrow">
  <span className="arrow"></span>
  <span>Explore our faculties</span>
</div>
: null}
                {index === 2 ? <Footer /> : null}

              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default Parallax;
