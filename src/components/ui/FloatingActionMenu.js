import React, { useState } from 'react';
import { Button, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import BuildChallengeModal from '../modals/BuildChallengeModal';
import CreateRecipeModal from '../modals/CreateRecipeModal';

function FloatingActionMenu() {
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  return (
    <>
      {/* Floating Action Menu */}
      <div className="floating-action-menu">
        <ButtonGroup vertical className="floating-button-group">
          <OverlayTrigger
            placement="left"
            overlay={<Tooltip>Create New Recipe</Tooltip>}
          >
            <Button
              className="floating-action-button"
              onClick={() => setShowRecipeModal(true)}
            >
              📝
            </Button>
          </OverlayTrigger>
          
          <OverlayTrigger
            placement="left"
            overlay={<Tooltip>Build Challenge</Tooltip>}
          >
            <Button
              className="floating-action-button"
              onClick={() => setShowChallengeModal(true)}
            >
              🏆
            </Button>
          </OverlayTrigger>
        </ButtonGroup>
      </div>

      {/* Modals */}
      <CreateRecipeModal 
        show={showRecipeModal}
        onHide={() => setShowRecipeModal(false)}
      />
      
      <BuildChallengeModal 
        show={showChallengeModal}
        onHide={() => setShowChallengeModal(false)}
      />
    </>
  );
}

export default FloatingActionMenu;