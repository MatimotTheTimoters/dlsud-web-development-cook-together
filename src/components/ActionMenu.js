// src/components/ActionMenu.js
import React, { useState } from "react";
import { Button, Card, Collapse } from "react-bootstrap";
import "../styles/colors.css";

export default function ActionMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="position-fixed"
        style={{ right: "1.5rem", bottom: "1.5rem", zIndex: 1050 }}
      >
        <div className="d-flex flex-column align-items-end">
          <Button
            className="action-toggle mb-2"
            aria-controls="actionCollapse"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            title={open ? "Close actions" : "Open actions"}
          >
            +
          </Button>

          <Collapse in={open}>
            <div id="actionCollapse">
              <Card className="action-card">
                <Card.Body className="p-2 d-flex flex-column gap-2">
                  <a className="btn btn-danger btn-sm" href="/home-challenges" role="button">
                    🏆 Build Challenge
                  </a>

                  <a className="btn btn-warning btn-sm" href="/home-kitchens" role="button">
                    👨‍🍳 New Kitchen
                  </a>

                  <a className="btn btn-success btn-sm" href="/home-create-recipe" role="button">
                    📖 Create Recipe
                  </a>

                  <a className="btn btn-info btn-sm text-white" href="/people-friends" role="button">
                    👥 Add Friends
                  </a>
                </Card.Body>
              </Card>
            </div>
          </Collapse>
        </div>
      </div>
    </>
  );
}