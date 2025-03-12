import { GithubLink, LinkedInLink, WebSiteLink } from "./social.mjs";
import Theme from "./theme.mjs";

/** Modèle des liens
 * @typedef Links
 * @type { { github: GithubLink[], linkedin: LinkedInLink[], website: WebSiteLink[] } }
 */

/** Gestion des paramètres
 * @typedef Settings
 * @type {{
 *  links: Links,
 *  theme: Theme
 * }}
 */
export default class Settings {
  static default_settings = {
    links: {
      github: [],
      linkedin: [],
      website: [],
    },
    theme: null,
  };

  #settings = this.#load();

  /** Construit les paramètres d'ABC
   * @param {{
   *  links: Links,
   *  theme: Theme
   * }}
  */
  constructor({ links, theme } = {}) {
    if (links !== undefined) {
      for (const key in Object.keys(links)) {
        for (const link in links[key]) {
          this.addLink(link);
        }
      }
    }
    if (theme !== undefined) this.changeTheme(theme);
    this.#save();
  }

  /** Ajoute un lien en paramètre
   * @param { "github" | "linkedin" | "website" } type
   * @param { GithubLink | LinkedInLink | WebSiteLink } link
   * @returns { boolean } Vrai si réussite, sinon Faux
   */
  addLink(type, link) {
    this.#settings.links[type].push(link);
    return this.#save();
  }

  /** Change le paramètre thème
   * @param { Theme } theme
   * @returns { boolean } Vrai si réussite, sinon Faux
   */
  changeTheme(theme) {
    this.#settings.theme = theme;
    return this.#save();
  }

  /** Sauvegarde les paramètres dans le localStorage
   * @returns {boolean} Vrai si réussite, sinon Faux
   */
  #save() {
    try {
      const serializedLinks = {
        github: this.#settings.links.github.map(link => link.toJSON()),
        linkedin: this.#settings.links.linkedin.map(link => link.toJSON()),
        website: this.#settings.links.website.map(link => link.toJSON())
      };
      const settingsToSave = {
        ...this.#settings,
        links: serializedLinks
      };

      localStorage.setItem('settings', JSON.stringify(settingsToSave));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  /** Charge les paramètres
   * @returns {{links: Links, theme: Theme}}
   */
  #load() {
    try {
      const settings = localStorage.getItem("settings");
      return settings ? JSON.parse(settings) : Settings.default_settings;
    } catch (e) {
      console.error(e);
      return Settings.default_settings;
    }
  }

  set theme(v) {
    v instanceof Theme
      ? (this.#settings.theme = v)
      : console.error("La valeur doit être une instance de Theme");
  }

  set links(v) {
    v instanceof Object
      ? (this.#settings.links = v)
      : console.error(
        "La valeur doit être une instance de GithubLink, LinkedInLink ou WebSiteLink"
      );
  }

  get links() {
    return this.#settings.links;
  }

  get theme() {
    return this.#settings.theme;
  }
}
