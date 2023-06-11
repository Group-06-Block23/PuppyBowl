const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

const cohortName = "2302-acc-pt-web-pt-d";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}players`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
    throw err;
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}players/${playerId}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    throw err;
  }
};

const addNewPlayer = async (playerObj) => {
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

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}players/${playerId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
    throw err;
  }
};

const renderAllPlayers = async () => {
  try {
    const tempList = await fetchAllPlayers();
    const playerList = tempList.data.players;
    console.log(playerList);
    playerContainer.innerHTML = ""; // Clear previous content

    playerList.forEach((player) => {
      const playerCard = document.createElement("div");
      playerCard.classList.add("player-card");

      const playerName = document.createElement("h2");
      playerName.textContent = player.name;

      const playerPosition = document.createElement("p");
      playerPosition.textContent = `Position: ${player.position}`;

      const playerTeam = document.createElement("p");
      playerTeam.textContent = `Team: ${player.team}`;

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
      playerCard.appendChild(playerName);
      playerCard.appendChild(playerPosition);
      playerCard.appendChild(playerTeam);
      playerCard.appendChild(playerDetails);
      playerCard.appendChild(playerImage);
      playerCard.appendChild(detailsButton);
      playerCard.appendChild(removeButton);
      playerContainer.appendChild(playerCard);

      detailsButton.addEventListener("click", async () => {
        const playerId = detailsButton.dataset.playerId;
        const player = await fetchSinglePlayer(playerId);
        console.log("Player details:", player);

        playerDetails.style.display =
          playerDetails.style.display === "none" ? "block" : "none";
      });

      removeButton.addEventListener("click", async () => {
        const playerId = removeButton.dataset.playerId;
        await removePlayer(playerId);
        console.log("Player removed:", playerId);
        await renderAllPlayers();
      });
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};



const renderNewPlayerForm = () => {
  try {
    const formHTML = `<form id= "new-player-form">
      <label for = "name-input"> Name:</label>
      <input type = "text" id = "name-input" name = "name-input" required>
      <label for = "position-input"> Position:</label>
      <input type = "text" id = "position-input" name = "position-input" required>
      <label for = "team-input"> Team:</label>
      <input type= "text" id = "team-input" name = "team-input" required>
      <button type= "submit"> Add Player </button>
    </form>
  `;

    newPlayerFormContainer.innerHTML = formHTML;

    const form = document.getElementById("new-player-form");

const renderNewPlayerForm = () => {
  try {
    const form = document.createElement("form");
    form.id = "new-player-form";

    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Name:";
    nameLabel.setAttribute("for", "name-input");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "name-input";
    nameInput.name = "name-input";
    nameInput.required = true;

    const positionLabel = document.createElement("label");
    positionLabel.textContent = "Position:";
    positionLabel.setAttribute("for", "position-input");

    const positionInput = document.createElement("input");
    positionInput.type = "text";
    positionInput.id = "position-input";
    positionInput.name = "position-input";
    positionInput.required = true;

    const teamLabel = document.createElement("label");
    teamLabel.textContent = "Team:";
    teamLabel.setAttribute("for", "team-input");

    const teamInput = document.createElement("input");
    teamInput.type = "text";
    teamInput.id = "team-input";
    teamInput.name = "team-input";
    teamInput.required = true;

    const addButton = document.createElement("button");
    addButton.type = "submit";
    addButton.textContent = "Add Player";

    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(positionLabel);
    form.appendChild(positionInput);
    form.appendChild(teamLabel);
    form.appendChild(teamInput);
    form.appendChild(addButton);

    newPlayerFormContainer.innerHTML = ""; // Clear previous content
    newPlayerFormContainer.appendChild(form);


    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const playerObj = {
        name: nameInput.value,
        position: positionInput.value,
        team: teamInput.value,
      };

      await addNewPlayer(playerObj);
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
