import React from "react";
import { Container, Card, CardGroup, Carousel } from "react-bootstrap";
import "../styles/colors.css";

export default function Features() {
  return (
    <section className="mt-5">
      <Container>
        {/* Vertical stacked group */}
        <div className="d-flex flex-column gap-3">

          {/* Gamified Leveling System */}
          <Card>
            <Carousel variant="dark" interval={null} indicators={false} aria-label="Leveling carousel">
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Leveling 1" />
              </Carousel.Item>
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Leveling 2" />
              </Carousel.Item>
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Leveling 3" />
              </Carousel.Item>
            </Carousel>

            <Card.Body>
              <Card.Title>Gamified Leveling System</Card.Title>
              <Card.Text className="text-muted">
                Earn EXP, level up, and unlock multipliers and rewards as you cook.
              </Card.Text>
            </Card.Body>

            <Card.Footer className="bg-transparent border-0">
              <small className="text-muted">Progression • Rewards</small>
            </Card.Footer>
          </Card>

          {/* Gold & Gems (Currencies) */}
          <Card>
            <Carousel variant="dark" interval={null} indicators={false} aria-label="Currencies carousel">
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Currencies 1" />
              </Carousel.Item>
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Currencies 2" />
              </Carousel.Item>
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Currencies 3" />
              </Carousel.Item>
            </Carousel>

            <Card.Body>
              <Card.Title>Gold & Gems (Currencies)</Card.Title>
              <Card.Text className="text-muted">
                Use Gold and Gems to buy recipes, consumables, and cosmetic items.
              </Card.Text>
            </Card.Body>

            <Card.Footer className="bg-transparent border-0">
              <small className="text-muted">Economy • Store</small>
            </Card.Footer>
          </Card>

          {/* Consumable Items */}
          <Card>
            <Carousel variant="dark" interval={null} indicators={false} aria-label="Consumables carousel">
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Consumable 1" />
              </Carousel.Item>
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Consumable 2" />
              </Carousel.Item>
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Consumable 3" />
              </Carousel.Item>
            </Carousel>

            <Card.Body>
              <Card.Title>Consumable Items</Card.Title>
              <Card.Text className="text-muted">
                Boosts, temporary buffs, and one-time-use items to help during challenges.
              </Card.Text>
            </Card.Body>

            <Card.Footer className="bg-transparent border-0">
              <small className="text-muted">Boosts • Single-use</small>
            </Card.Footer>
          </Card>

          {/* Parties */}
          <Card>
            <Carousel variant="dark" interval={null} indicators={false} aria-label="Parties carousel">
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Parties 1" />
              </Carousel.Item>
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Parties 2" />
              </Carousel.Item>
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Parties 3" />
              </Carousel.Item>
            </Carousel>

            <Card.Body>
              <Card.Title>Parties with other players</Card.Title>
              <Card.Text className="text-muted">
                Team up with friends to complete challenges, share kitchens, and compete together.
              </Card.Text>
            </Card.Body>

            <Card.Footer className="bg-transparent border-0">
              <small className="text-muted">Social • Cooperative</small>
            </Card.Footer>
          </Card>

          {/* Discover Recipes */}
          <Card>
            <Carousel variant="dark" interval={null} indicators={false} aria-label="Discover recipes carousel">
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Discover 1" />
              </Carousel.Item>
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Discover 2" />
              </Carousel.Item>
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Discover 3" />
              </Carousel.Item>
            </Carousel>

            <Card.Body>
              <Card.Title>Discover Recipes</Card.Title>
              <Card.Text className="text-muted">
                Browse thousands of recipes submitted by the community.
              </Card.Text>
              <a href="home-recipes.html" className="stretched-link" aria-label="View recipes">View recipes</a>
            </Card.Body>

            <Card.Footer className="bg-transparent border-0">
              <small className="text-muted">Free • Popular</small>
            </Card.Footer>
          </Card>

          {/* Join Challenges */}
          <Card>
            <Carousel variant="dark" interval={null} indicators={false} aria-label="Challenges carousel">
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Challenge 1" />
              </Carousel.Item>
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Challenge 2" />
              </Carousel.Item>
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Challenge 3" />
              </Carousel.Item>
            </Carousel>

            <Card.Body>
              <Card.Title>Join Challenges</Card.Title>
              <Card.Text className="text-muted">
                Participate in timed cooking challenges and win rewards.
              </Card.Text>
              <a href="home-challenges.html" className="stretched-link" aria-label="Join a challenge">Join a challenge</a>
            </Card.Body>

            <Card.Footer className="bg-transparent border-0">
              <small className="text-muted">Weekly events</small>
            </Card.Footer>
          </Card>

          {/* Create Kitchens */}
          <Card>
            <Carousel variant="dark" interval={null} indicators={false} aria-label="Kitchens carousel">
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Kitchen 1" />
              </Carousel.Item>
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Kitchen 2" />
              </Carousel.Item>
              <Carousel.Item>
                <img src="assets/images/placeholder.svg" className="d-block w-100 ct-img" alt="Kitchen 3" />
              </Carousel.Item>
            </Carousel>

            <Card.Body>
              <Card.Title>Create Kitchens</Card.Title>
              <Card.Text className="text-muted">
                Form kitchens to share recipes and collaborate with friends.
              </Card.Text>
              <a href="home-kitchens.html" className="stretched-link" aria-label="Create a kitchen">Create a kitchen</a>
            </Card.Body>

            <Card.Footer className="bg-transparent border-0">
              <small className="text-muted">Community groups</small>
            </Card.Footer>
          </Card>

        </div>

        {/* Coming Soon horizontal group */}
        <div className="mt-4">
          <h5 className="mb-3">Coming Soon</h5>

          <div className="d-flex gap-3 overflow-auto">
            <Card style={{ minWidth: 260 }}>
              <Card.Img src="assets/images/placeholder.svg" className="ct-img ct-img--thumb" alt="Questboard" />
              <Card.Body>
                <Card.Title as="h6">Questboard</Card.Title>
                <Card.Text className="text-muted small">Daily and weekly quests to earn extra rewards.</Card.Text>
              </Card.Body>
            </Card>

            <Card style={{ minWidth: 260 }}>
              <Card.Img src="assets/images/placeholder.svg" className="ct-img ct-img--thumb" alt="Classes and Skills" />
              <Card.Body>
                <Card.Title as="h6">Classes &amp; Skills</Card.Title>
                <Card.Text className="text-muted small">Learn special skills and tailor your chef class.</Card.Text>
              </Card.Body>
            </Card>

            <Card style={{ minWidth: 260 }}>
              <Card.Img src="assets/images/placeholder.svg" className="ct-img ct-img--thumb" alt="Tools and Equipment" />
              <Card.Body>
                <Card.Title as="h6">Tools &amp; Equipment</Card.Title>
                <Card.Text className="text-muted small">Unlock better tools to improve cooking results.</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}