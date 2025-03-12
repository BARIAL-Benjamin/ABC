export default class Wait {
    /** Attends une quantité de temps donné avec son unité
     * @param {number} time Temps
     * @param {"ms" | "s" | "m"} unit Unité de temps (default: "ms")
     * @returns {Promise<void>} Rien
     */
    static wait(time, unit = "ms") {
        return new Promise(_ => setTimeout(_, time * { ms: 1, s: 1000, m: 60000 }[unit]));
    }

    /** Attends jusqu'au timestamp donné
     * @param {number} timestamp Temps
     * @returns {Promise<void>} Rien
     */
    static waitUntil(timestamp) {
        const time = timestamp - Date.now();
        return time <= 0 ? Promise.resolve(): new Promise(_ => setTimeout(_, time));
    }

    /** Attends un certain nombre de minutes
     * @param {number} minutes Nombre de minutes
     * @returns {Promise<void>} Rien
     */
    static waitMinutes(minutes) {
        return Wait.wait(minutes, 'm');
    }

    /** Attends un certain nombre d'heures
     * @param {number} hours Nombre d'heures
     * @returns {Promise<void>} Rien
     */
    static waitHours(hours) {
        return Wait.wait(hours * 60, 'm');
    }

    /** Attends jusqu'à une date donnée
     * @param {Date} date Date
     * @returns {Promise<void>} Rien
     */
    static waitUntilDate(date) {
        return Wait.waitUntil(date.getTime());
    }
}