import React from "react";
import ChallengeCard from "../cards/ChallengeCard";
import '../../styles/layout.css';



function ChallengeCardGroup({ items }) {
  return (
    <div className="challenge-card-grid">
      {items.map((item) => (
        <ChallengeCard key={item.id} challenge={item} />
      ))}
    </div>
  );
}

export default ChallengeCardGroup;
