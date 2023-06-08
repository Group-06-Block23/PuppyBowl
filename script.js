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
    console.log ("Player added:", data);
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
          <p>Position: ${player.status}</p>
          <p>Team: ${player.teamId}</p>
          <div class="player-details">
         <p class="player-breed">Breed: ${player.breed}</p>
          </div>
          <img src="${player.imageUrl}" alt="${player.name}" class="player-image"><br>
          <button class="details-button" data-player-id="${player.id}">See details</button>
          <button class="remove-button" data-player-id="${player.id}">Remove from roster</button>
        </div>
      `;
      playerContainerHTML += playerCardHTML;
    });
    playerContainer.innerHTML = playerContainerHTML;
    playerContainer.innerHTML = `<div class="player-container">${playerContainerHTML}</div>`;

  


    // Add event listeners to the buttons
    const detailsButtons = document.querySelectorAll(".details-button");
    const removeButtons = document.querySelectorAll(".remove-button");

    detailsButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const playerId = button.dataset.playerId;
        const player = await fetchSinglePlayer(playerId);
        console.log("Player details:", player);

    const playerCard = button.closest(".player-card");

    const playerDetails = playerCard.querySelector(".player-details");

    playerDetails.style.display = playerDetails.style.display === "none" ? "block" : "none";
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
    const form = document.createElement("form");
    form.id = "new-player-form";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "name-input";
    nameInput.name = "name-input";
    nameInput.required = true;
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Name:";
    nameLabel.setAttribute("for", "name-input");
    form.appendChild(nameLabel);
    form.appendChild(nameInput);

    const positionInput = document.createElement("input");
    positionInput.type = "text";
    positionInput.id = "position-input";
    positionInput.name = "position-input";
    positionInput.required = true;
    const positionLabel = document.createElement("label");
    positionLabel.textContent = "Position:";
    positionLabel.setAttribute("for", "position-input");
    form.appendChild(positionLabel);
    form.appendChild(positionInput);

    const teamInput = document.createElement("input");
    teamInput.type = "text";
    teamInput.id = "team-input";
    teamInput.name = "team-input";
    teamInput.required = true;
    const teamLabel = document.createElement("label");
    teamLabel.textContent = "Team:";
    teamLabel.setAttribute("for", "team-input");
    form.appendChild(teamLabel);
    form.appendChild(teamInput);

    const addButton = document.createElement("button");
    addButton.type = "submit";
    addButton.textContent = "Add Player";
    form.appendChild(addButton);

    newPlayerFormContainer.innerHTML = "";
    newPlayerFormContainer.appendChild(form);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("Form submitted");
      // Collect form data
     // Collect form data
    const playerObj = {
  // Extract data from form fields
    name: document.getElementById("name-input").value,
    position: document.getElementById("position-input").value,
    team: document.getElementById("team-input").value,
  };

      await addNewPlayer(playerObj);
      console.log("Player added!");
      // Clear input fields
      form.reset();
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
