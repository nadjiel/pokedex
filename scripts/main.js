import { populateList, loadPokemons } from "./dom.js";

// Creates and displays all the pokémon cards.
populateList();
// Loads the data on all the pokémon visible on screen.
loadPokemons();
window.onscroll = loadPokemons;