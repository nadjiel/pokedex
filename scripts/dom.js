import Pokemon from "./pokemon.js";

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