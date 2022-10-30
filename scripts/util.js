/**
 * Tells if an element is either visible on the screen or not.
 * @param {HTMLElement} el html element to have visibility checked
 * @returns true if the passed element is visible on the browser screen
 */
export function isVisible(el) {
    const elRect = el.getBoundingClientRect();

    return (
        (elRect.bottom >= 0 && elRect.top <= window.innerHeight) &&
        (elRect.right >= 0 && elRect.left <= window.innerWidth)
    );
}

/**
 * Capitalizes and returns the passed string.
 * @param {string} str the string to capitalize
 * @returns the received string with its first letter in upper case 
 */
export function Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}