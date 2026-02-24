import React from 'react';

interface NowAndNextProps {
  items: string[];
}

const NowAndNext: React.FC<NowAndNextProps> = ({ items }) => {
  return (
    <section id="now-and-next">
      <h2>Now & Next</h2>
      <ul className="now-list">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

export default NowAndNext;
