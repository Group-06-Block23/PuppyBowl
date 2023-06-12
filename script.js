// Create player container and new player form elements
const playerContainer = document.createElement("div");
playerContainer.id = "all-players-container";
const newPlayerFormContainer = document.createElement("div");
newPlayerFormContainer.id = "new-player-form";

// Append player container and new player form to the document body
document.body.appendChild(playerContainer);
document.body.appendChild(newPlayerFormContainer);

const cohortName = "2302-acc-pt-web-pt-d";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

// Fetch players from the API
const fetchPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}players`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
    throw err;
  }
};

// Fetch a single player from the API
const fetchPlayer = async () => {
  try {
    const response = await fetch(`${API_URL}players`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Uh oh, trouble fetching player!", err);
    throw err;
  }
};

// Add a new player to the API
const addPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${API_URL}players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });
    const data = await response.json();
    console.log("Player added:", data);
    return data;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
    throw err;
  }
};

// Remove a player from the API
const deleteParty = async (playerId) => {
  // your code here
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      // Party successfully deleted
      console.log("Player Removed");
    } else {
      // Failed to delete player
      console.error("Whoops, trouble removing the player from the roster!");
    }
  } catch (error) {
    console.error(error);
  }
};

// Render a player card with details
const renderPlayerCard = (player) => {
  const playerCard = document.createElement("div");
  playerCard.classList.add("player-card");

  const playerName = document.createElement("h2");
  playerName.textContent = player.name;

  const dateCreated = document.createElement("p");
  dateCreated.textContent = `Created: ${player.createdAt}`;

  const dateModified = document.createElement("p");
  dateModified.textContent = `Modified: ${player.updatedAt}`;

  const playerPosition = document.createElement("p");
  playerPosition.textContent = `Status: ${player.status}`;

  const playerId = document.createElement("p");
  playerId.textContent = `ID Number: ${player.id}`;

  const playerTeam = document.createElement("p");
  playerTeam.textContent = `Team: ${player.cohortId}`;

  const playerDetails = document.createElement("div");
  playerDetails.classList.add("player-details");

  const playerBreed = document.createElement("p");
  playerBreed.classList.add("player-breed");
  playerBreed.textContent = `Breed: ${player.breed}`;

  const playerImage = document.createElement("img");
  playerImage.src = player.imageUrl;
  playerImage.alt = player.name;
  playerImage.classList.add("player-image");

  const detailsButton = document.createElement("button");
  detailsButton.classList.add("details-button");
  detailsButton.dataset.playerId = player.id;
  detailsButton.textContent = "See details";

  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-button");
  removeButton.dataset.playerId = player.id;
  removeButton.textContent = "Remove from roster";

  playerDetails.appendChild(playerBreed);
  playerDetails.appendChild(playerPosition);
  playerDetails.appendChild(playerTeam);
  playerDetails.appendChild(dateCreated);
  playerDetails.appendChild(dateModified);
  playerCard.appendChild(playerName);
  playerCard.appendChild(playerId);
  playerCard.appendChild(playerDetails);
  playerCard.appendChild(playerImage);
  playerCard.appendChild(detailsButton);
  playerCard.appendChild(removeButton);
  playerContainer.appendChild(playerCard);

  // Styling player card and its components
  playerCard.style.border = "1px solid #ccc";
  playerCard.style.padding = "10px";
  playerCard.style.marginBottom = "10px";

  playerName.style.marginBottom = "5px";
  playerName.style.fontSize = "18px";

  playerPosition.style.margin = "0";
  playerPosition.style.fontSize = "14px";

  playerTeam.style.margin = "0";
  playerTeam.style.fontSize = "14px";

  playerBreed.style.margin = "0";
  playerBreed.style.fontSize = "14px";

  dateCreated.style.margin = "0";
  dateCreated.style.fontSize = "14px";

  dateModified.style.margin = "0";
  dateModified.style.fontSize = "14px";

  playerImage.style.width = "150px";
  playerImage.style.height = "150px";
  playerImage.style.objectFit = "cover";

  detailsButton.style.marginTop = "5px";
  removeButton.style.marginTop = "5px";

  detailsButton.addEventListener("click", async () => {
    const playerId = detailsButton.dataset.playerId;
    const player = await fetchPlayer(`${API_URL}players/${playerId}`);
    console.log("Player details:", player);

    playerDetails.style.display =
      playerDetails.style.display === "none" ? "block" : "none";
  });

  removeButton.addEventListener("click", async () => {
    const playerId = removeButton.dataset.playerId;
    await deleteParty(playerId); // Updated function name
    console.log("Player removed:", playerId);
    await renderAllPlayers();
  });
};

// Render all players
const renderAllPlayers = async () => {
  try {
    const {
      data: { players },
    } = await fetchPlayers(`${API_URL}players`);
    playerContainer.innerHTML = ""; // Clear previous content

    players.forEach((player) => {
      renderPlayerCard(player);
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

// Render the new player form
const renderNewPlayerForm = () => {
  const formContainer = document.createElement("div");
  formContainer.id = "new-player-form-container";

  const formTitle = document.createElement("h2");
  formTitle.textContent = `"New Player Form"`;

  const form = document.createElement("form");
  form.id = "new-player-form";

  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Name:";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.name = "name";
  nameInput.required = true;

  const idLabel = document.createElement("label");
  idLabel.textContent = "Team ID:";
  const idInput = document.createElement("input");
  idInput.type = "text";
  idInput.name = "name";
  idInput.required = true;

  const positionLabel = document.createElement("label");
  positionLabel.textContent = "Position ( field or bench ):";
  const positionInput = document.createElement("input");
  positionInput.type = "text";
  positionInput.name = "position";
  positionInput.required = true;

  const teamLabel = document.createElement("label");
  teamLabel.textContent = "Team ( Ruff or Fluff ):";
  const teamInput = document.createElement("input");
  teamInput.type = "text";
  teamInput.name = "team";
  teamInput.required = true;

  const breedLabel = document.createElement("label");
  breedLabel.textContent = "Breed:";
  const breedInput = document.createElement("input");
  breedInput.type = "text";
  breedInput.name = "team";
  breedInput.required = true;

  const imageLabel = document.createElement("label");
  imageLabel.textContent = "Image URL:";
  const imageInput = document.createElement("input");
  imageInput.type = "text";
  imageInput.name = "team";
  imageInput.required = false;

  const addButton = document.createElement("button");
  addButton.type = "submit";
  addButton.textContent = "Add Player";

  form.appendChild(nameLabel);
  form.appendChild(nameInput);
  //form.appendChild(idLabel);
  //form.appendChild(idInput);
  form.appendChild(positionLabel);
  form.appendChild(positionInput);
  form.appendChild(teamLabel);
  form.appendChild(teamInput);
  form.appendChild(breedLabel);
  form.appendChild(breedInput);
  form.appendChild(imageLabel);
  form.appendChild(imageInput);
  form.appendChild(addButton);

  formContainer.appendChild(formTitle);
  formContainer.appendChild(form);

  // Add form styling if needed
  formContainer.style.marginBottom = "10px";

  document.body.appendChild(formContainer);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const player = {
      name: nameInput.value,
      status: positionInput.value,
      //team: teamInput.value,
      teamId: 777,
      chortId: 422,
      "imageUrl": imageInput.value,
      breed: breedInput.value,
    };

    try {
      await addPlayer(player);
      console.log("Player added successfully!");
      form.reset();
      await renderAllPlayers();
    } catch (error) {
      console.error("Failed to add player:", error);
    }
  });
};

const init = async () => {
  await renderAllPlayers();
  renderNewPlayerForm();
};

init();
