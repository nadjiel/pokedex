import { createCards, loadPokemons, createEntries } from "./dom.js";

// Creates and displays all the pokémon cards.
createCards();
// Creates all the polémon entries.
createEntries();
// Loads the data on all the pokémon visible on screen.
loadPokemons();
window.onscroll = loadPokemons;