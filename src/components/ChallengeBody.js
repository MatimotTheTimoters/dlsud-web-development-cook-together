import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import ChallengeCardGroup from './card-groups/ChallengeCardGroup';
import ScrollDownNav from './ScrollDownNav.js';
import '../styles/colors.css';

const ChallengeItems = [
  { id: 1, title: 'Algorithm Basics', author: 'Mary', reward: '120', difficulty: 'Easy', end: '06/12/25', tags: 'Arrays, Loops', img: '/assets/images/placeholder.svg' },
  { id: 2, title: 'React Hooks Mastery', author: 'Jane', reward: '150', difficulty: 'Medium', end: '09/21/25', tags: 'React, Hooks', img: '/assets/images/placeholder.svg' },
  { id: 3, title: 'Sorting Challenge', author: 'John', reward: '200', difficulty: 'Hard', end: '01/01/26', tags: 'Sorting, Algorithms', img: '/assets/images/placeholder.svg' },
  { id: 4, title: 'API Integration', author: 'Mary', reward: '180', difficulty: 'Medium', end: '11/20/25', tags: 'API, Fetch', img: '/assets/images/placeholder.svg' },
];

function ChallengeBody() {
  const [filteredItems, setFilteredItems] = useState(ChallengeItems);

  const handleSearch = (query) => {
    const lower = query.toLowerCase();
    const filtered = ChallengeItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.author.toLowerCase().includes(lower) ||
        item.difficulty.toLowerCase().includes(lower) ||
        item.tags.toLowerCase().includes(lower)
    );
    setFilteredItems(filtered);
  };

  return (
    <Container className="mt-4 position-relative">
      <ScrollDownNav onSearch={handleSearch} />

      <section className="col-12 col-md-9">
        <ChallengeCardGroup items={filteredItems} />
        <div className="d-grid gap-2 col-6 mx-auto my-4">
          <Button className="btn-ct-outline">Load more</Button>
        </div>
      </section>
    </Container>
  );
}

export default ChallengeBody;
