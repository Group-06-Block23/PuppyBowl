const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2302-acc-pt-web-pt-d";
// Use the API URL variable for fetch requests
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

// It fetches all players from the API and returns them
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}players`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
    throw err; // Throw the error to indicate failure
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}players/${playerId}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    throw err; // Throw the error to indicate failure
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
    return data;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
    throw err; // Throw the error to indicate failure
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
    throw err; // Throw the error to indicate failure
  }
};

const renderAllPlayers = async () => {
  try {
    const tempList = await fetchAllPlayers();
    const playerList = tempList.data.players;
    console.log(playerList);
    let playerContainerHTML = "";
    playerList.forEach((player) => {
      const playerCardHTML = `
        <div class="player-card">
          <h2>${player.name}</h2>
          <p>Position: ${player.position}</p>
          <p>Team: ${player.team}</p>
          <button class="details-button" data-player-id="${player.id}">See details</button>
          <button class="remove-button" data-player-id="${player.id}">Remove from roster</button>
        </div>
      `;
      playerContainerHTML += playerCardHTML;
    });
    playerContainer.innerHTML = playerContainerHTML;

    // Add event listeners to the buttons
    const detailsButtons = document.querySelectorAll(".details-button");
    const removeButtons = document.querySelectorAll(".remove-button");

    detailsButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const playerId = button.dataset.playerId;
        const player = await fetchSinglePlayer(playerId);
        console.log("Player details:", player);
        // Update the UI with the player details
      });
    });

    removeButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const playerId = button.dataset.playerId;
        await removePlayer(playerId);
        console.log("Player removed:", playerId);
        // Update the UI by re-fetching and rendering all players
        await renderAllPlayers();
      });
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};
// Below is going to be an updated version of the form.
// There will be a <label> and <input> elements for name, position, and team.
// `required` attribute will be assigned to ensure all fields are filled out.
// Once all fields are filled out the form can be submitted.

const renderNewPlayerForm = () => {
  try {
    const formHTML = 
    `<form id= "new-player-form">
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
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      // Collect form data
      const playerObj = {
        // Extract data from form fields
        name: document.getElementById("name-input").value,
        position: document.getElementById("position-input").value,
        team: document.getElementById("team-input").value,
      };
      await addNewPlayer(playerObj);
      console.log("Player added!");
      // Update the UI by re-fetching and rendering all players
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
