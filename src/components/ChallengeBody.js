import React, { useState } from 'react';
import ChallengeCard from './cards/ChallengeCard';
import '../styles/colors.css';
import '../styles/layout.css'; 

const ChallengeItems = [
  { id: 1, title: 'Candy Cane', author: 'Mary', reward: '120', end: '06/12/25', tags: 'tag1, tag3', img: '/assets/images/placeholder.svg' },
  { id: 2, title: 'Eclair', author: 'Jane', reward: '150', end: '09/21/25', tags: 'tag6, tag5', img: '/assets/images/placeholder.svg' },
  { id: 3, title: 'Sorting ', author: 'John', reward: '200', end: '01/01/26', tags: 'tag1, tag4, tag5', img: '/assets/images/placeholder.svg' },
  { id: 4, title: 'Integration', author: 'Mary', reward: '180', end: '11/20/25', tags: 'tag2, tag4', img: '/assets/images/placeholder.svg' },
  { id: 5, title: 'Basics', author: 'Mary', reward: '120', end: '06/12/25', tags: 'tag2, ta3', img: '/assets/images/placeholder.svg' },
  { id: 6, title: 'Cookies', author: 'Jane', reward: '150', end: '09/21/25', tags: 'tag5, tag1', img: '/assets/images/placeholder.svg' },
  { id: 7, title: 'Cake', author: 'John', reward: '200', end: '01/01/26', tags: 'tag3, ta3', img: '/assets/images/placeholder.svg' },
  { id: 8, title: 'Donut', author: 'Mary', reward: '180', end: '11/20/25', tags: 'ta3, tag5', img: '/assets/images/placeholder.svg' },
];

function ChallengeBody() {
  const [filteredItems, setFilteredItems] = useState(ChallengeItems);

  const handleSearch = (query) => {
    const lower = query.toLowerCase();
    const filtered = ChallengeItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.author.toLowerCase().includes(lower) ||
        item.tags.toLowerCase().includes(lower)
    );
    setFilteredItems(filtered);
  };

  const handleTagClick = (tag) => {
    handleSearch(tag);
  };

  return (
    <div className="challenge-card-grid mt-4">
      {filteredItems.map((item) => (
        <ChallengeCard
          key={item.id}
          challenge={{ ...item, onTagClick: handleTagClick }}
        />
      ))}
    </div>
  );
}

export default ChallengeBody;
