import React, { useState } from "react";
import AsideComponent from "../components/AsideComponent";
import RecipeBody from "../components/RecipeBody";
import ScrollDownNav from "../components/ScrollDownNav";
import "../styles/layout.css";

function TestPages() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="testpage-layout">
      <AsideComponent />

      <ScrollDownNav
        query={searchQuery}
        onQueryChange={setSearchQuery} 
        onSearch={setSearchQuery}     
      />

      <div className="testpage-main">
        <h2 className="testpage-title">Recipe</h2>

        <RecipeBody
          query={searchQuery}
          onQueryChange={setSearchQuery} 
        />
      </div>
    </div>
  );
}

export default TestPages;
