import { API, language }  from "./global.js";
import { Capitalize } from "./util.js";

/**
 * Stores information received from the API about a pokémon.
 */
class Pokemon {

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
     * Tells if a species is in the right language.
     * @param {object} species species to examine
     * @returns boolean indicating if the received species is
     * in the correct language
     */
    findSpecies = species => species.language.name == language;


    /**
     * Tells if a description concerns the right pokémon
     * game and language.
     * @param {object} desc description to examine
     * @returns boolean indicating if the received description is
     * related to the right game and in the correct language
     */
    findDescription = desc => {
        return desc.version.name == "red" && desc.language.name == language;
    }

    /**
     * Refines the name of this pokémon received by the API.
     * @param {string} name the name of this pokémon
     * @returns the refined version of the received name
     */
    refineName = name => {
        name = Capitalize(name);
        // Substituting hyphen for empty space
        name = name.replaceAll("-", " ");
        // Substituting m (male) for male symbol
        name = name.replace(/ m$/, " ♂");
        // Substituting f (female) for female symbol
        name = name.replace(/ f$/, " ♀");

        return name;
    };

    /**
     * Refines the description of this pokémon received by the API.
     * @param {string} desc the description of this pokémon
     * @returns the refined version of the received description
     */
    refineDescription = desc => {
        // Substituting new line for empty space
        desc = desc.replaceAll("\n", " ");
        // Substituting form feed for empty space
        desc = desc.replaceAll("\u000c", " ");

        return desc;
    };
    
    /**
     * Fetches the API for data on this pokémon.
     * @returns promise containing the fetched data
     */
    basicFetch = async () => {
        return await fetch(API + "pokemon/" + this.id)
            .then(res => res.json());
    }

    /**
     * Fetches the API for more data on this pokémon.
     * @returns promise containing the fetched data
     */
    advancedFetch = async () => {
        return await fetch(API + "pokemon-species/" + this.id)
            .then(res => res.json());
    }

    /**
     * Consumes the API and saves the obtained data in this instance.
     */
    storeBasicData = async () => {
        const data = await this.basicFetch();

        this.name = this.refineName(data.name);
        this.maleSprite = data.sprites.front_default;
        this.femaleSprite = data.sprites.front_female;
        this.type1 = data.types[0].type.name;
        // Stores the second type only if it exists
        this.type2 = data.types[1]?.type.name;
        this.height = data.height;
        this.weight = data.weight;
    };

    /**
     * Consumes the API for more data and saves it in this instance.
     */
    storeAdvancedData = async () => {
        const data = await this.advancedFetch();

        // Stores the species that is in the right language
        this.species = data.genera.find(this.findSpecies).genus;
        // Stores and refines the description that concerns
        // the right game and is in the correct language
        this.description = this.refineDescription (
            data.flavor_text_entries.find(this.findDescription).flavor_text
        );
        this.habitat = data.habitat.name;
    };

}

/**
 * Array of pokémons that stores the data obtained on them.
 */
export const pokemons = new Array(Pokemon.total);

export default Pokemon;