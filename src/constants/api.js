const mainApi = "https://sheetdb.io/api/v1/3qimhi9nbg9bl";
const apiSheets = {
    users: `${mainApi}?sheet=users`,
    usersRelationships: `${mainApi}?sheet=users-relationships`,
    usersFriendRequests: `${mainApi}?sheet=users-friend-requests`,
    recipes: `${mainApi}?sheet=recipes`,
    recipesIngredients: `${mainApi}?sheet=recipes-ingredients`,
    recipesSteps: `${mainApi}?sheet=recipes-steps`,
    userRecipes: `${mainApi}?sheet=user-recipes`,
    challengesCookQuota: `${mainApi}?sheet=challenges-cook-quota`,
    challengesCookQuotaParticipants: `${mainApi}?sheet=challenges-cook-quota-participants`,

}

export default apiSheets;