import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Default navigation items for main app
const defaultItems = [
  { key: "feed", label: "Feed", to: "/feed", badge: null },
  { key: "discover", label: "Discover", to: "/discover", badge: null },
  { key: "my-kitchen", label: "My Kitchen", to: "/my-kitchen", badge: null },
  { key: "test-pages", label: "Test Pages", to: "/TestPages", badge: null },
];

// Settings navigation items
const settingsItems = [
  { key: "profile", label: "Profile", to: "/profile", badge: null },
  { key: "account", label: "Account", to: "/settings", badge: null },
  { key: "logout", label: "Logout", to: "/landing", badge: null },
];

function AsideComponent({
  items, // Allow overriding items via props
  activeKey,
  className = ""
}) {
  const location = useLocation();
  const { logout } = useAuth();
  const currentPath = activeKey || location.pathname;

  // Determine which navigation items to show based on current path
  const getNavigationItems = () => {
    // If custom items are provided via props, use them
    if (items) return items;
    
    // Show settings navigation when in settings section
    if (currentPath.startsWith('/settings')) {
      return settingsItems;
    }
    
    // Default navigation for all other pages
    return defaultItems;
  };

  const navigationItems = getNavigationItems();

  // Handle special actions like logout
  const handleItemClick = (item) => {
    if (item.key === 'logout') {
      // Prevent default navigation for logout
      logout();
      return;
    }
  };

  return (
    <aside className={`app-sidebar aside-card ${className}`}>
      <Nav className="flex-column" as="nav" aria-label="aside navigation">
        {navigationItems.map((item) => {
          const isActive = currentPath === item.to || currentPath.startsWith(`${item.to}/`);
          
          return (
            <Nav.Item key={item.key} className="mb-2">
              <Nav.Link
                as={item.key === 'logout' ? 'button' : Link} // Use button for logout
                to={item.key === 'logout' ? undefined : item.to} // No to prop for logout
                onClick={() => handleItemClick(item)}
                className={`d-flex justify-content-between align-items-center ${
                  isActive ? "aside-item--active" : "text-ct-muted"
                } ${item.key === 'logout' ? 'logout-item' : ''}`}
                aria-current={isActive ? "page" : undefined}
                style={{
                  backgroundColor: isActive ? "var(--ct-aside-active-bg)" : "transparent",
                  borderRadius: "0.375rem",
                  padding: "0.5rem 1rem",
                  border: 'none', // Remove border for button
                  width: '100%', // Full width for button
                  textAlign: 'left', // Align text properly
                }}
              >
                <span className={isActive ? "text-ct-ink" : "text-ct-muted"}>
                  {item.label}
                </span>
                {item.badge ? <small className="badge-ct">{item.badge}</small> : null}
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
    </aside>
  );
}

export default AsideComponent;