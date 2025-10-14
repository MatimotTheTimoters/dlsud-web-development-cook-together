import React from "react";
import RecipeCard from "../cards/RecipeCard";

function RecipeCardGroup({ items }) {
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
  };

  const cardWrapperStyle = {
    display: "flex",
    alignItems: "stretch",
  };

  return (
    <div style={gridStyle}>
      {items.map((item) => (
        <div key={item.id} style={cardWrapperStyle}>
          <RecipeCard recipe={item} />
        </div>
      ))}
    </div>
  );
}

export default RecipeCardGroup;
