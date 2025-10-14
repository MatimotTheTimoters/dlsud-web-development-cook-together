import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function FeaturesComponent() {
  return (
    <section className="mt-5">
      <Container>
        <div className="d-flex flex-column gap-3">

          <Card className="ct-card">
            <Card.Body>
              <Card.Title className="text-ct-ink">Gamified Leveling System</Card.Title>
              <Card.Text className="text-ct-muted">
                Earn EXP, level up, and unlock multipliers and rewards as you cook.
              </Card.Text>
              <div className="d-flex gap-2">
                <Button as={Link} to="/home-recipes" className="btn-ct-primary">See Progression</Button>
              </div>
            </Card.Body>
            <Card.Footer className="bg-transparent border-0">
              <small className="text-ct-muted">Progression • Rewards</small>
            </Card.Footer>
          </Card>

          <Card className="ct-card">
            <Card.Body>
              <Card.Title className="text-ct-ink">Gold & Gems (Currencies)</Card.Title>
              <Card.Text className="text-ct-muted">
                Use Gold and Gems to buy recipes, consumables, and cosmetic items.
              </Card.Text>
            </Card.Body>
            <Card.Footer className="bg-transparent border-0">
              <small className="text-ct-muted">Economy • Store</small>
            </Card.Footer>
          </Card>

          <Card className="ct-card">
            <Card.Body>
              <Card.Title className="text-ct-ink">Consumable Items</Card.Title>
              <Card.Text className="text-ct-muted">
                Boosts, temporary buffs, and one-time-use items to help during challenges.
              </Card.Text>
            </Card.Body>
            <Card.Footer className="bg-transparent border-0">
              <small className="text-ct-muted">Boosts • Single-use</small>
            </Card.Footer>
          </Card>

          <Card className="ct-card">
            <Card.Body>
              <Card.Title className="text-ct-ink">Parties with other players</Card.Title>
              <Card.Text className="text-ct-muted">
                Team up with friends to complete challenges, share kitchens, and compete together.
              </Card.Text>
            </Card.Body>
            <Card.Footer className="bg-transparent border-0">
              <small className="text-ct-muted">Social • Cooperative</small>
            </Card.Footer>
          </Card>

          <Card className="ct-card">
            <Card.Body>
              <Card.Title className="text-ct-ink">Discover Recipes</Card.Title>
              <Card.Text className="text-ct-muted">
                Browse thousands of recipes submitted by the community.
              </Card.Text>
              <div>
                <Button as={Link} to="/home-recipes" variant="outline-secondary">View recipes</Button>
              </div>
            </Card.Body>
            <Card.Footer className="bg-transparent border-0">
              <small className="text-ct-muted">Free • Popular</small>
            </Card.Footer>
          </Card>

          <Card className="ct-card">
            <Card.Body>
              <Card.Title className="text-ct-ink">Join Challenges</Card.Title>
              <Card.Text className="text-ct-muted">
                Participate in timed cooking challenges and win rewards.
              </Card.Text>
              <div>
                <Button as={Link} to="/Challenges" className="btn-ct-outline">Join a challenge</Button>
              </div>
            </Card.Body>
            <Card.Footer className="bg-transparent border-0">
              <small className="text-ct-muted">Weekly events</small>
            </Card.Footer>
          </Card>

        </div>

        <div className="mt-4">
          <h5 className="mb-3 text-ct-ink">Coming Soon</h5>
          <div className="d-flex gap-3 overflow-auto">
            <Card style={{ minWidth: 260 }} className="ct-card">
              <Card.Body>
                <Card.Title as="h6" className="text-ct-ink">Questboard</Card.Title>
                <Card.Text className="text-ct-muted small">Daily and weekly quests to earn extra rewards.</Card.Text>
              </Card.Body>
            </Card>

            <Card style={{ minWidth: 260 }} className="ct-card">
              <Card.Body>
                <Card.Title as="h6" className="text-ct-ink">Classes &amp; Skills</Card.Title>
                <Card.Text className="text-ct-muted small">Learn special skills and tailor your chef class.</Card.Text>
              </Card.Body>
            </Card>

            <Card style={{ minWidth: 260 }} className="ct-card">
              <Card.Body>
                <Card.Title as="h6" className="text-ct-ink">Tools &amp; Equipment</Card.Title>
                <Card.Text className="text-ct-muted small">Unlock better tools to improve cooking results.</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>

      </Container>
    </section>
  );
}

export default FeaturesComponent;