import Pokemon, { pokemons } from "./pokemon.js";
import { setAttr, addClass, addClasses, changeClass, isVisible, rmvClass } from "./util.js";

const body = document.querySelector("body");

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
 * Array of pokémon entries.
 */
const entries = new Array(Pokemon.total);

/**
 * Inner html of an entry.
 */
const entryHtml = `
    <span class="id">132</span>
        <div class="main">
            <div class="about">
                <div class="display">
                    <div class="gender-buttons">
                    </div>
                    <img src="assets/icons/loading.svg" alt="Ditto">
                </div>
                <h2 class="name">Ditto</h2>
                <h3 class="species">Transform Pokémon</h3>
            </div>
            <div class="desc">
                <p class="text">
                    It can reconstitute its entire cellular structure to
                    change into what it sees, but it returns to normal
                    when it relaxes.
                </p>
                <div class="types">
                    <span class="type1 type">normal</span>
                </div>
                <div class="measures">
                    <span class="measure height">0,3</span>
                    <span class="measure weight">4</span>
                </div>
            </div>
        </div>
    <span class="habitat" data-habitat="Unknown habitat">Unknown habitat</span>
`;

/**
 * Configures the curtain element.
 * @param {HTMLDivElement} curtain the curtain to set up
 */
function setupCurtain(curtain) {
    addClass(curtain, "curtain");
    // Makes the curtain auto remove itself from the
    // DOM when it fades out (opens itself)
    curtain.onanimationend = e => {
        if(e.animationName == "fade-out")
            body.removeChild(curtain);
    }
    // Makes the curtain open itself and close the
    // currently opened entry when clicked on. 
    curtain.onclick = () => {
        openCurtain();
        closeEntry();
    }
}

/**
 * Creates a div element as a curtain for darkening the cards.
 * @returns the created curtain
 */
function createCurtain() {
    const curtain = document.createElement("div");
    setupCurtain(curtain);

    return curtain;
}

/**
 * Div that serves to darken the cards behind an opened entry.
 */
const curtain = createCurtain();



/**
 * Darkens the cards by appending the curtain to the body
 * (over them) to highlight the opened entry.
 */
function closeCurtain() {
    changeClass(curtain, "fade-out", "fade-in");
    body.appendChild(curtain);
}

/**
 * Lightens the cards by making the curtain fade out and
 * remove itself from the DOM.
 */
function openCurtain() {
    changeClass(curtain, "fade-in", "fade-out");
}

/**
 * Closes the entry that is currently opened by making it
 * slide down and remove itself from the DOM.
 */
function closeEntry() {
    const e = document.querySelector(".entry");
    changeClass(e, "slide-up", "slide-down");
}

/**
 * Opens the entry corresponding the i position in the array
 * @param {number} i index of the entry in the array
 */
function openEntry(i) {
    const e = entries[i];

    closeCurtain();
    changeClass(e, "slide-down", "slide-up");
    body.appendChild(e);
}

/**
 * Configures a pokédex card.
 * @param {HTMLLIElement} card the card to be set up
 */
function setupCard(card) {
    card.innerHTML = cardHtml;
}

/**
 * Creates li elements as cards for displaying the pokémons.
 * @returns the created card
 */
function createCard() {
    const card = document.createElement("li");
    setupCard(card);

    return card;
}

/**
 * Creates all the cards of the pokédex and appends them to the list.
 */
export function createCards() {
    for(let i = 0; i < cards.length; i++) {
        cards[i] = createCard();
        // Setting cards to open respective entry on click
        cards[i].onclick = () => openEntry(i);
        list.appendChild(cards[i]);
    }
}

/**
 * Configures a pokédex entry
 * @param {HTMLDivElement} entry the entry to set up
 */
function setupEntry(entry) {
    // Entry is set with a loading class and normal type by default
    addClasses(entry, "entry", "loading");
    setAttr(entry, "data-type1", "normal");
    entry.innerHTML = entryHtml;
    // Makes the entry auto remove itself from the DOM when
    // it slides downwards to outside of the view
    entry.onanimationend = e => {
        if(e.animationName == "slide-down")
            body.removeChild(entry);
    };
}

/**
 * Creates a div element as an entry for pokémon data.
 * @returns the created entry
 */
function createEntry() {
    const entry = document.createElement("div");
    setupEntry(entry);

    return entry;
}

/**
 * Creates all the entries of the pokédex.
 */
export function createEntries() {
    for(let i = 0; i < entries.length; i++) {
        entries[i] = createEntry();
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