import Pokemon, { pokemons } from "./pokemon.js";
import { isVisible } from "./util.js";

/**
 * Pokédex card list.
 */
const list = document.querySelector("ul");

/**
 * Array of cards that are appended on the list.
 */
const cards = new Array(Pokemon.total);

/**
 * Inner html of a card.
 */
const cardHtml = `
    <div class="card loading" data-type1="normal">
        <img src="assets/icons/loading.svg" alt="Ditto">
        <div class="info">
            <span class="id">132</span>
            <span class="name">Ditto</span>
        </div>
    </div>
`;

/**
 * Creates li elements as cards for displaying the pokémons.
 * @returns the created card
 */
function createCard() {
    const card = document.createElement("li");
    card.innerHTML = cardHtml;

    return card;
}

/**
 * Creates all the cards of the pokédex and appends them to the list.
 */
export function populateList() {
    for(let i = 0; i < cards.length; i++) {
        cards[i] = createCard();
        list.appendChild(cards[i]);
    }
}

/**
 * Displays the ith pokémon of the array of pokémons on
 * the ith card of the array of cards.
 * @param {number} i the in array position of the pokémon to show
 */
function showPokemon(i) {
    // Getting the card in question
    const c = cards[i];
    // Getting the pokémon in question
    const p = pokemons[i];

    // Removing loading class for style purposes
    c.querySelector(".loading").classList.remove("loading");

    c.querySelector(".card").setAttribute("data-type1", p.type1);
    // Setting second type only if it exists
    if(p.type2) c.querySelector(".card").setAttribute("data-type2", p.type2);
    // Setting pokémon image only if found
    c.querySelector("img").setAttribute (
        "src",
        p.maleSprite ? p.maleSprite : "assets/icons/not-found.svg"
    );
    c.querySelector("img").setAttribute("alt", p.name);
    c.querySelector(".id").textContent = p.id;
    c.querySelector(".name").textContent = p.name;
}

/**
 * Fetches the data of the visible pokémons and
 * displays them on the respective cards.
 */
export function loadPokemons() {
    for(let i = 0; i < cards.length; i++) {
        if(!isVisible(cards[i])) continue;
        if(!cards[i].querySelector(".loading")) continue;
        if(pokemons[i]) continue;

        pokemons[i] = new Pokemon(i + 1);
        pokemons[i].storeBasicData().then(() => showPokemon(i));
    }
}