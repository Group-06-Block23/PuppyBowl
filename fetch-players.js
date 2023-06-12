export async function fetchPlayers() {
  // Your fetchPlayers implementation
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
}
