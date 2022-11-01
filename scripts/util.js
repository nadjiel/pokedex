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
export function capitailize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Adds a class to the passed element.
 * @param {HTMLElement} el the element to which to add the class
 * @param {string} classStr the class to be added to the element
 */
export function addClass(el, classStr) {
    el.classList.add(classStr);
}

/**
 * Adds various classes to the passed element
 * @param {HTMLElement} el the element to which to add the classes
 * @param  {...string} classStrs the classes that should be
 * added to the element
 */
export function addClasses(el, ...classStrs) {
    for(const classStr of classStrs)
        addClass(el, classStr);
}

/**
 * Removes a class from the passed element.
 * @param {HTMLElement} el the element from which to remove the class
 * @param {string} classStr the class to be removed from the element
 */
export function rmvClass(el, classStr) {
    el.classList.remove(classStr);
}

/**
 * Removes a class from the passed element and thereafter adds another one.
 * @param {HTMLElement} el the element that should have the classes changed
 * @param {string} oldClass the class to be removed from the element 
 * @param {string} newClass the class to be added to the element
 */
export function changeClass(el, oldClass, newClass) {
    rmvClass(el, oldClass);
    addClass(el, newClass);
}

/**
 * Sets an attribute with the determined value to the received element.
 * @param {HTMLElement} el the element that will have an attribute set
 * @param {string} attrName the attribute to be set
 * @param {string} attrValue the value to be set to the attribute
 */
export function setAttr(el, attrName, attrValue) {
    el.setAttribute(attrName, attrValue);
}