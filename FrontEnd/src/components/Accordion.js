import React, { useState } from 'react';
import './Accordion.css'; // Your CSS file to style the accordion

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion">
      <button className="accordion-title" onClick={toggleAccordion}>
        {title}
      </button>
      <div className={`accordion-content ${isOpen ? 'open' : ''}`} aria-expanded={isOpen}>
        {children}
      </div>
    </div>
  );
};

export default Accordion;
