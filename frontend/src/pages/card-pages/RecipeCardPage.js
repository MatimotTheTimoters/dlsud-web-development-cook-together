import React from "react";

function RecipeCardPage() {
  const recipes = [
    {
      id: "r1",
      coverImage: "",
      title: "Spaghetti Bolognese",
      origin: "Italy",
      preparationTime: "45 mins",
      servingSize: 4,
      tags: "pasta,italian,main dish",
      expReward: 100,
      goldReward: 50,
      gemReward: 5,
      isPaid: false,
      goldPrice: 0,
      gemPrice: 0,
      purchaseCount: 10,
      isPublic: true,
      author: "John",
      ratingAverage: 4.5,
      likeCount: 50,
      favoriteCount: 20,
      commentCount: 5,
    },
    {
      id: "r2",
      coverImage: "",
      title: "Chicken Adobo",
      origin: "Philippines",
      preparationTime: "1 hour",
      servingSize: 5,
      tags: "filipino,chicken,savory",
      expReward: 120,
      goldReward: 60,
      gemReward: 8,
      isPaid: true,
      goldPrice: 30,
      gemPrice: 2,
      purchaseCount: 15,
      isPublic: true,
      author: "Mary",
      ratingAverage: 4.8,
      likeCount: 80,
      favoriteCount: 40,
      commentCount: 12,
    },
  ];

  const layoutStyle = {
    display: "flex",
    flexDirection: "row",
    minHeight: "100vh",
  };

  const mainStyle = {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  };

  return (
    <div style={layoutStyle}>
      <div style={mainStyle}>
        
      </div>
    </div>
  );
}

export default RecipeCardPage;
