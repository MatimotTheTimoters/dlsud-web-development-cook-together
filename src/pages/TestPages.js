import React from "react";
import AsideComponent from "../components/AsideComponent";
import ScrollDownNav from "../components/ScrollDownNav";
import SettingsPage from "./SettingsPage";

function TestPages() {
  return (
    <div className="settingspage-layout">
      <AsideComponent />
      <ScrollDownNav />
      <div className="settingspage-main">
        <h2 className="settingspage-title">Settings</h2>
        <SettingsPage />
      </div>
    </div>
  );
}

export default TestPages;
