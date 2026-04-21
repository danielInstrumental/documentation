// File: poke_async.js


const getPokemon = async (pokemonName) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`HTTP ${response.status} — ${body}`);
    }

    const data = await response.json();

    console.log(`Name: ${data.name}`);
    console.log(`ID: ${data.id}`);
    console.log(`Height: ${data.height}`);
    console.log(`Weight: ${data.weight}`);
    console.log("Abilities:");
    data.abilities.forEach(ability => {
      console.log(` - ${ability.ability.name}`);
    });
  } catch (error) {
    console.error("Error fetching Pokémon:", error.message);
  }
};

// Call the function
getPokemon("pikachu");