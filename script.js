const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "YOUR COHORT NAME HERE";
// Use the API URL variable for fetch requests
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

// /**
//  * It fetches all players from the API and returns them
//  * @returns An array of objects.
//  */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}players`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}players/${playerId}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
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
  }
};

// /**
//  * It takes an array of player objects, loops through them, and creates a string of HTML for each
//  * player, then adds that string to a larger string of HTML that represents all the players.
//  *
//  * Then it takes that larger string of HTML and adds it to the DOM.
//  *
//  * It also adds event listeners to the buttons in each player card.
//  *
//  * The event listeners are for the "See details" and "Remove from roster" buttons.
//  *
//  * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
//  * API to get the details for a single player.
//  *
//  * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
//  * the API to remove a player from the roster.
//  *
//  * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
//  * @param playerList - an array of player objects
//  * @returns the playerContainerHTML variable.
//  */
const renderAllPlayers = (playerList) => {
  try {
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
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
      });
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    const formHTML = `
      <form id="new-player-form">
        <!-- Add your form fields here -->
        <button type="submit">Add Player</button>
      </form>
    `;
    newPlayerFormContainer.innerHTML = formHTML;

    const form = document.getElementById("new-player-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      // Collect form data
      const playerObj = {
        // Extract data from form fields
      };
      await addNewPlayer(playerObj);
      console.log("Player added!");
      // Update the UI by re-fetching and rendering all players
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

init();
