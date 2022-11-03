import { API, language }  from "./global.js";
import { capitalize } from "./util.js";

/**
 * Stores information received from the API about a pokémon.
 */
class Pokemon {

    /**
     * Flag telling if the data needed for a card was already loaded.
     */
    cardData = false;

    /**
     * Flag telling if the data needed for an entry was already loaded.
     */
    entryData = false;

    /**
     * The name of this pokémon.
     */
    name = "Unknown name";

    /**
     * The sprite for this pokémon in its male
     * version.
     */
    maleSprite = "assets/icons/not-found.svg";

    /**
     * The sprite for this pokémon in its female
     * version.
     */
    femaleSprite = null;

    /**
     * The first type of this pokémon.
     */
    type1 = "unknown";

    /**
     * The second type of this pokémon.
     */
    type2 = null;

    /**
     * The height of this pokémon.
     */
    height = "Unknown";

    /**
     * The weight of this pokémon.
     */
    weight = "Unknown";

    /**
     * The species in which this pokémon is classified.
     */
    species = "Unknown species pokémon";

    /**
     * The description about this pokémon.
     */
    description = "Details about this pokémon are unknown.";

    /**
     * The habitat of this pokémon.
     */
    habitat = "Unknown habitat";

    /**
     * Creates a pokémon instance.
     * @param {number} id id of the pokémon represented by this instance
     */
    constructor(id) {
        this.id = id;
    }

    /**
     * Total amount of existing pokémon.
     */
    static get total() {
        return 905;
    }

    /**
     * Stores the name of this pokémon, if it is found.
     * @param {string} name the name to be stored
     */
    storeName = name => {
        if(!name) return;

        // Capitilizing name
        name = capitalize(name);
        // Substituting hyphen for empty space
        name = name.replaceAll("-", " ");
        // Substituting m (male) for male symbol
        name = name.replace(/ m$/, " ♂");
        // Substituting f (female) for female symbol
        name = name.replace(/ f$/, " ♀");

        this.name = name;
    };

    /**
     * Stores the sprite of this pokémon in its male form, if it is found.
     * @param {object} sprites object with the sprites of this pokémon
     */
    storeMaleSprite = sprites => {
        if(!sprites?.front_default) return;

        this.maleSprite = sprites.front_default;
    };

    /**
     * Stores the sprite of this pokémon in its female form, if it is found.
     * @param {object} sprites object with the sprites of this pokémon
     */
    storeFemaleSprite = sprites => {
        if(!sprites?.front_female) return;

        this.femaleSprite = sprites.front_female;
    };

    /**
     * Stores the first type of this pokémon, if it is found.
     * @param {object[]} types array with the types of this pokémon
     */
    storeType1 = types => {
        if(!types?.[0]?.type?.name) return;

        this.type1 = types[0].type.name;
    };

    /**
     * Stores the second type of this pokémon, if it is found.
     * @param {object[]} types array with the types of this pokémon
     */
    storeType2 = types => {
        if(!types?.[1]?.type?.name) return;

        this.type2 = types[1].type.name;
    };

    /**
     * Stores the height of this pokémon, if it is found.
     * @param {number} height the height to be stored
     */
    storeHeight = height => {
        if(!height) return;

        this.height = height;
    };

    /**
     * Stores the weight of this pokémon, if it is found.
     * @param {number} weight the weight to be stored
     */
    storeWeight = weight => {
        if(!weight) return;

        this.weight = weight;
    };

    /**
     * Stores this pokémon's species that's in
     * the right language, if it is found.
     * @param {object[]} genera array with the genera of
     * this pokémon in various languages
     */
    storeSpecies = genera => {
        if(!genera?.[0]?.genus) return;

        this.species = genera.findLast (
            el => {
                if(!el?.language?.name) return true;

                return el.language.name == language
            }
        ).genus;
    };


    /**
     * Stores the description about this pokémon that's in
     * the right language, if it is found.
     * @param {object[]} flavorTexts array with the flavor texts
     * (descriptions) of this pokémon in various languages
     */
    storeDescription = flavorTexts => {
        if(!flavorTexts?.[0]?.flavor_text) return;

        this.description = flavorTexts.findLast (
            el => {
                if(!el?.language?.name) return true;

                return el.language.name == language;
            }
        ).flavor_text;
    };

    /**
     * Stores the habitat of this pokémon, if it is found.
     * @param {object} habitat object with the habitat of this pokémon
     */
    storeHabitat = habitat => {
        if(!habitat?.name) return;

        // Capitalizing the habitat string
        habitat.name = capitalize(habitat.name);
        // Substituting hyphens for empty spaces
        habitat.name = habitat.name.replaceAll("-", " ");
        // Substituting "Waters" for "Water"
        habitat.name = habitat.name.replace("Waters", "Water");

        this.habitat = habitat.name;
    };

    /**
     * Consumes the API for data needed for a card and
     * saves the obtained data in this instance.
     */
    storeCardData = async () => {
        const data = await this.cardFetch();

        this.storeName(data.name);
        this.storeMaleSprite(data.sprites);
        this.storeFemaleSprite(data.sprites);
        this.storeType1(data.types);
        this.storeType2(data.types);
        this.storeHeight(data.height);
        this.storeWeight(data.weight);

        this.cardData = true;
    };

    /**
     * Consumes the API for data needed for an entry and
     * saves the obtained data in this instance.
     */
    storeEntryData = async () => {
        if(!this.cardData) await this.storeCardData();

        const data = await this.entryFetch();

        this.storeSpecies(data.genera);
        this.storeDescription(data.flavor_text_entries);
        this.storeHabitat(data.habitat);

        this.entryData = true;
    };
    
    /**
     * Fetches the API for data for this pokémon's card.
     * @returns promise containing the fetched data
     */
    cardFetch = async () => {
        return await fetch(API + "pokemon/" + this.id)
            .then(res => res.json());
    };

    /**
     * Fetches the API for data for this pokémon's entry.
     * @returns promise containing the fetched data
     */
    entryFetch = async () => {
        return await fetch(API + "pokemon-species/" + this.id)
            .then(res => res.json());
    };

}

/**
 * Array of pokémons that stores the data obtained on them.
 */
export const pokemons = new Array(Pokemon.total);

/**
 * Instantiates all pokémon that will later store data.
 */
export function createPokemons() {
    for(let i = 0; i < pokemons.length; i++)
        pokemons[i] = new Pokemon(i + 1);
}

export default Pokemon;