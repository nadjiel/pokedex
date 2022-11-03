import { createCards, loadPokemons, createEntries } from "./dom.js";
import { createPokemons } from "./pokemon.js";

// Creates instances for all pokémons.
createPokemons();
// Creates and displays all the pokémon cards.
createCards();
// Creates all the pokémon entries.
createEntries();
// Loads the data on all the pokémon visible on screen.
loadPokemons();
window.onscroll = loadPokemons;