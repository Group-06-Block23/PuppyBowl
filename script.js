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
const removePlayer = async () => {
  try {
    const response = await fetch(`${API_URL}players`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Whoops, trouble removing the player from the roster!", err);
    throw err;
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
    await removePlayer(`${API_URL}players/${playerId}`);
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
  try {
    const form = document.createElement("form");
    form.id = "new-player-form";

    const createInput = (
      labelText,
      inputType,
      inputName,
      isRequired = true
    ) => {
      const label = document.createElement("label");
      label.textContent = labelText;
      label.setAttribute("for", inputName);

      const input = document.createElement("input");
      input.type = inputType;
      input.id = inputName;
      input.name = inputName;
      input.required = isRequired;

      return { label, input };
    };

    const nameInput = createInput("Name:", "text", "name-input");
    const positionInput = createInput("Position:", "text", "position-input");
    const teamInput = createInput("Team:", "text", "team-input");

    const addButton = document.createElement("button");
    addButton.type = "submit";
    addButton.textContent = "Add Player";

    form.append(
      nameInput.label,
      nameInput.input,
      positionInput.label,
      positionInput.input,
      teamInput.label,
      teamInput.input,
      addButton
    );

    // Styling new player form
    form.style.marginBottom = "10px";
    addButton.style.marginTop = "5px";

    newPlayerFormContainer.innerHTML = ""; // Clear previous content
    newPlayerFormContainer.appendChild(form);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const playerObj = {
        name: nameInput.input.value,
        position: positionInput.input.value,
        team: teamInput.input.value,
      };

      await addPlayer(playerObj);
      console.log("Player added!");
      form.reset();
      await renderAllPlayers();
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

const init = async () => {
  await renderAllPlayers();
  renderNewPlayerForm();
};

init();
