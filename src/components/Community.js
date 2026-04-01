import React from 'react';

const Community = () => {
  const stories = [
    {
      quote: "Through the Aqua Balance Tshwane program, I was able to formalize my car wash business in Mamelodi. The training helped me install a water recycling system that saves 40% water while improving service quality.",
      author: "Sipho Mthembu, Mamelodi Car Wash Owner"
    },
    {
      quote: "The smart meters helped us track our water usage and identify leaks we didn't know existed. We've reduced our water bill by 30% and our environmental impact significantly.",
      author: "Maria Santos, Hammanskraal Auto Wash"
    },
    {
      quote: "The incentive program made it possible for us to upgrade our wastewater treatment system. Now we're fully compliant and serving as a model for other car washes in our area.",
      author: "John Mokwena, Soshanguve Community Car Wash"
    }
  ];

  return (
    <section className="community section-reveal" id="community">
      <div className="container">
        <h2 className="section-title">Community Success Stories</h2>
        <div className="stories-grid">
          {stories.map((story, index) => (
            <div key={index} className="story-card">
              <p className="story-quote">"{story.quote}"</p>
              <p className="story-author">- {story.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Community;