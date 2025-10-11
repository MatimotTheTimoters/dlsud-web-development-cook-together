import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const defaultItems = [
  { key: "feed", label: "Feed", to: "/feed", badge: null },
  { key: "discover", label: "Discover", to: "/discover", badge: null },
  { key: "my-kitchen", label: "My Kitchen", to: "/my-kitchen", badge: null },
];

function AsideComponent({
  items = defaultItems,
  activeKey,
  className = ""
}) {
  const location = useLocation();
  const currentPath = activeKey || location.pathname;

  return (
    <aside className={`app-sidebar aside-card ${className}`}>
      <Nav className="flex-column" as="nav" aria-label="aside navigation">
        {items.map((it) => {
          const isActive = currentPath === it.to || currentPath.startsWith(`${it.to}/`);
          return (
            <Nav.Item key={it.key} className="mb-2">
              <Nav.Link
                as={Link}
                to={it.to}
                className={`d-flex justify-content-between align-items-center ${isActive ? "aside-item--active" : "text-ct-muted"
                  }`}
                aria-current={isActive ? "page" : undefined}
                style={{
                  backgroundColor: isActive ? "var(--ct-aside-active-bg)" : "transparent",
                  borderRadius: "0.375rem",
                  padding: "0.5rem 1rem",
                }}
              >
                <span className={isActive ? "text-ct-ink" : "text-ct-muted"}>{it.label}</span>
                {it.badge ? <small className="badge-ct">{it.badge}</small> : null}
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
    </aside>
  );
}

export default AsideComponent;