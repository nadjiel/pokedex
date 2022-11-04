import Pokemon, { pokemons } from "./pokemon.js";
import {
    setAttr, addClass, addClasses, changeClass,
    isVisible, rmvClass, appendChildren
} from "./util.js";

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
    // Makes the curtain open when the escape key is
    // pressed also
    window.onkeydown = e => {
        if(e.key == "Escape" && e.repeat == false) {
            if(document.querySelector(".curtain")) {
                curtain.onclick();
            }
        }
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
 * Creates a button for selecting a pokémon's gender
 * @param {string} gender the gender of the button to create (male or female)
 * @returns the created gender button
 */
function createGenderButton(gender) {
    const button = document.createElement("button");
    addClasses(button, "gender", gender);

    return button;
}

/**
 * Creates a span for displaying a pokémon's type
 * @param {string} type the type of the span to create (type1 or type2)
 * @returns the created type span
 */
function createTypeSpan(type) {
    const type2 = document.createElement("span");
    addClasses(type2, "type", type);

    return type2;
}

/**
 * Loads, if not already loaded, the data needed for an entry.
 * @param {number} i index of the entry in the array
 */
async function loadEntryData(i) {
    const p = pokemons[i];

    // Returns if the data is already loaded
    if(p.entryData) return;
    // Loads the card information, if not already loaded
    if(!p.cardData) await loadCardData(i);

    const e = entries[i];
    const {
        id, name, img, genders, types, type1,
        height, weight, species, desc, habitat
    } = e.fields;

    id.textContent = p.id;
    name.textContent = p.name;
    img.src = p.maleSprite;
    // Adds male and female button if the pokémon has gender differences
    if(p.femaleSprite) {
        const male = createGenderButton("male");
        male.onclick = () => img.src = p.maleSprite;
        const female = createGenderButton("female");
        female.onclick = () => img.src = p.femaleSprite;

        appendChildren(genders, male, female);
    }
    // Sets the first type and adds an attribute for styling
    type1.textContent = p.type1;
    setAttr(e, "data-type1", p.type1);
    // Sets the second type only if it exists
    if(p.type2) {
        // Creates and sets the second type and adds an attribute for styling
        const type2 = createTypeSpan("type2");
        type2.textContent = p.type2;
        setAttr(e, "data-type2", p.type2);

        types.appendChild(type2);
    }
    height.textContent = p.height;
    weight.textContent = p.weight;

    await p.storeEntryData();
    
    species.textContent = p.species;
    desc.textContent = p.description;
    // Sets the habitat and adds an attribute for styling
    habitat.textContent = p.habitat;
    setAttr(habitat, "data-habitat", p.habitat);

    // Removes the loading class for styling
    rmvClass(e, "loading");
}

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
    loadEntryData(i);
}

/**
 * Stores the fields of this card into a property for ease of access.
 * @param {HTMLLIElement} card the card to have its fields stored
 */
function storeCardFields(card) {
    card.fields = {
        id: card.querySelector(".id"),
        name: card.querySelector(".name"),
        img: card.querySelector("img")
    };
}

/**
 * Configures a pokédex card.
 * @param {HTMLLIElement} card the card to be set up
 */
function setupCard(card) {
    card.innerHTML = cardHtml;
    storeCardFields(card);
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
 * Stores the fields of this entry into a property for ease of access.
 * @param {HTMLDivElement} entry the entry to have its fields stored
 */
function storeEntryFields(entry) {
    entry.fields = {
        id: entry.querySelector(".id"),
        name: entry.querySelector(".name"),
        img: entry.querySelector("img"),
        genders: entry.querySelector(".gender-buttons"),
        types: entry.querySelector(".types"),
        type1: entry.querySelector(".type1"),
        height: entry.querySelector(".height"),
        weight: entry.querySelector(".weight"),
        species: entry.querySelector(".species"),
        desc: entry.querySelector(".text"),
        habitat: entry.querySelector(".habitat")
    };
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
    storeEntryFields(entry);
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
 * Loads, if not already loaded, the data needed for a card.
 * @param {number} i index of the card in the array
 */
async function loadCardData(i) {
    const c = cards[i];
    const p = pokemons[i];

    await p.storeCardData();

    setAttr(c.firstElementChild, "data-type1", p.type1);
    // Setting second type only if it exists
    if(p.type2) setAttr(c.firstElementChild, "data-type2", p.type2);
    // Setting pokémon image only if found
    setAttr(c.fields.img, "src", p.maleSprite);
    setAttr(c.fields.img, "alt", p.name);
    c.fields.id.textContent = p.id;
    c.fields.name.textContent = p.name;

    // Removing loading class for style purposes
    rmvClass(c.firstElementChild, "loading");
}

/**
 * Fetches the data of the visible pokémons and
 * displays them on the respective cards.
 */
export function loadPokemons() {
    for(let i = 0; i < cards.length; i++) {
        if(!isVisible(cards[i])) continue;
        if(!cards[i].querySelector(".loading")) continue;
        if(pokemons[i].cardData) continue;

        loadCardData(i);
    }
}