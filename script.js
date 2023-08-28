// finding object
const mealContainer = document.getElementById("meals");
const favorite = document.querySelector("#fav-items");
const searchItems = document.getElementById("search-item");
const searchBtn = document.querySelector(".search");
const popupContainer = document.querySelector(".info-main-container");
const popupCancelBtn = document.querySelector("#close-btn");

const getRandomMeal = async () => {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const randomMeal = await res.json();
  const randomMeals = randomMeal.meals[0];
  showRandomMeal(randomMeals);
  return randomMeals;
};

getRandomMeal();
const getMealById = async (id) => {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const respData = await resp.json();
  const meals = respData.meals[0];
  return meals;
};

const getMealBySearch = async (term) => {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  const randomMeal = await res.json();
  const meal = randomMeal.meals;
  return meal;
};

const showRandomMeal = (mealData) => {
  const meals = document.createElement("div");
  meals.classList.add("meal-container");
  meals.innerHTML = ` 
    <div class="meal-header"><h2>Random Recepies</h2>
      <img id="meal-img" src=${mealData.strMealThumb} alt="${mealData.strMeal}">
    </div>
    <div class="meal-footer">
      <h4 class="meal-info">${mealData.strMeal}</h4>
      <button class="fav-btn " id="fav-icon"><i class="fas fa-heart"></i><span class="fav-tool">Add to Favorite</span></button>
    </div>
    </div>`;
  mealContainer.appendChild(meals);
  index = 0;
  const btn = meals.querySelector("#fav-icon");
  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      removeMealFromLs(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      setMealToLs(mealData.idMeal);
      btn.classList.add("active");
    }
    addFavSection(mealData);
    index++;
  });
};

const addFavSection = (mealData) => {
  const favoriteDiv = document.createElement("li");
  favoriteDiv.classList.add("fav-meals");
  favoriteDiv.innerHTML = `<li><img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span class="img-details">${mealData.strMeal}</span></li>`;
  favorite.appendChild(favoriteDiv);
};

const setMealToLs = (mealId) => {
  const meals = getMealToLs();
  localStorage.setItem("meals", JSON.stringify([...meals, mealId]));
};

const removeMealFromLs = (mealId) => {
  const meals = getMealToLs();
  localStorage.setItem(
    "meals",
    JSON.stringify(meals.filter((id) => id !== mealId))
  );
};

const getMealToLs = () => {
  const meals = JSON.parse(localStorage.getItem("meals"));
  return meals === null ? [] : meals;
};

const fetchFavMeals = async () => {
  favorite.innerHTML = "";
  const mealsId = getMealToLs();
  for (let i = 0; i < mealsId.length; i++) {
    const meals = mealsId[i];
    const mealData = await getMealById(meals);
    addToFavSec(mealData);
    // addFavSection(meal);
  }
};
fetchFavMeals();
const addToFavSec = (data) => {
  popupContainer.innerHTML="";
  // // get ingredients & measures
  const ingredents = [];
  // const index=1;
  for (let i = 1; i <= 20; i++) {
    if (data["strIngredient" + i]) {
      ingredents.push(`${data["strIngredient" + i]}
      -${data["strMeasure" + i]}`);
    } else {
      break;
    }
  }
  const favoriteDiv = document.createElement("li");
  favoriteDiv.classList.add("fav-meals");
  favoriteDiv.innerHTML = `<img src="${data.strMealThumb}" alt="${data.strMeal}"><span class="img-details">${data.strMeal}</span><button class="cancel-btn"><i class="fa-regular fa-circle-xmark"></i></button>`;
  const button = favoriteDiv.querySelector(".cancel-btn");
  button.addEventListener("click", (e) => {
    removeMealFromLs(data.idMeal);
    fetchFavMeals();
  });
  favorite.appendChild(favoriteDiv);

  favoriteDiv.addEventListener("click", () => {
    if (popupContainer.classList.contains("hidden")) {
      popupContainer.classList.remove("hidden");
    }
    popupContainer.classList.add("open");
    popupContainer.innerHTML = ` <div class="info-container">
    <div class="info-header">
      <div class="text-header">
        <h3>${data.strMeal}</h3>
        <button id="close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
      <img class="info-img"src="${data.strMealThumb}" alt="" class="${
      data.strMeal
    }">
    </div>
   <div class="info-details">
    <h3>Meal Information</h3>
    <ul class="info-ingredient-container"><p>${data.strInstructions}</p>
      <h4>Ingredient Details</h4>
    ${ingredents.map((e) => `<li>${e}</li>`).join("")}
      <div id="cook-video">       
        <h4>Try to cook this delicious meal by watching video's instructions.</h4>
        <button class="cook-video"><a href="${
          data.strYoutube
        }">Click here to watch video</a></button> 
      </div>
    </ul>
   </div>
  </div>`;
    const popupCancelBtn = popupContainer.querySelector("#close-btn");
    popupCancelBtn.addEventListener("click", () => {
      if (popupContainer.classList.contains("open")) {
        popupContainer.classList.remove("open");
      }
      popupContainer.classList.add("hidden");
    });
    popupContainer.innerHTML='';
  });
};

searchBtn.addEventListener("click", async (e) => {
  // clean container
  mealContainer.innerHTML = "";
  const value = searchItems.value;
  const mealIteam = await getMealBySearch(value);
  if (mealIteam) {
    mealIteam.forEach((element) => {
      // show meal again
      showRandomMeal(element);
    });
  } else {
    mealContainer.innerHTML = "";
    alert(`"${value}" search item isn't match! Random meal show again. `);
    getRandomMeal();
  }
  searchItems.value = "";
});
