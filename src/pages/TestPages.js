import React from "react";
import AsideComponent from "../components/AsideComponent";
import ChallengeBody from "../components/ChallengeBody";
import ScrollDownNav from "../components/ScrollDownNav";
import "../styles/layout.css";

function TestPages() {
  return (
    <div className="testpage-layout">
      <AsideComponent />
      <ScrollDownNav />
      <div className="testpage-main">
        <h2 className="testpage-title">Challenges</h2>
        <ChallengeBody />
      </div>
    </div>
  );
}

export default TestPages;
