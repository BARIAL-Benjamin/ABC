/** Information relatif à l'utilisateur
 * @typedef { Object } UserInfo
 * @property { string } [lastname]
 * @property { string } [firstname]
 * @property { string } [poste]
 * @property { string } [mail]
 * @property { string } [tel]
 * @property { string } [address]
 * @property { string } [interests]
 * @property { string } [date_naissance]
 * @property { string } [photo] Stocker sous forme de texte en Base64
 * @property { SocialMedia } [social]
 * @property { Experience[] } [experience]
 * @property { Langue[] } [langue]
 * @property { Etude[] } [etude]
 * @property { Competence[] } [competence]
 */

/** Information relatif aux réseaux sociaux de l'utilisateur
 * @typedef { Object } SocialMedia
 * @property { string } [twitter]
 * @property { string } [linkedin]
 * @property { string } [website]
 */

/** Information relatif aux langues de l'utilisateur
 * @typedef { Object } Langue
 * @property { string } [nom]
 * @property { string } [niveau]
 */

/** Information relatif aux compétences de l'utilisateur
 * @typedef { Object } Competence
 * @property { string } [nom]
 * @property { string } [description]
 */

/** Information relatif aux études de l'utilisateur
 * @typedef { Object } Etude
 * @property { string } [date_deb]
 * @property { string } [date_fin]
 * @property { string } [lieu]
 * @property { string } [intitule]
 * @property { string } [description]
 */

/** Information relatif aux expériences de l'utilisateur
 * @typedef { Object } Experience
 * @property { string } [date_deb]
 * @property { string } [date_fin]
 * @property { string } [lieu]
 * @property { string } [intitule]
 * @property { string } [description]
 */

/** Information relatif au thème
 * @typedef { Object } ThemeInfo
 * @property { string } [palette]
 * @property { string } [template]
 */

/** Information relatif au CV
 * @typedef { Object } ABCproject
 * @property { UserInfo } user
 * @property { ThemeInfo } theme
 */

/** Type de clé pour faciliter la recherche
 * @typedef { "ABC" | "user" | "theme" } ABCKey
 */

/** Options pour la construction du bouton pour télécharger en PDF
 * @typedef { Object } PDFButtonOptions
 * @property { string } [title]
 * @property { "before" | "start" | "end" | "after" } [position]
 * @property { string | HTMLImageElement } [buttonText]
 * @property { NodeListOf<Element> | Element[] } [elementsToNotDisplay]
 * @property { string | HTMLImageElement } [buttonText]
 * @property { "JPEG" | "WEBP" | "PNG" } [format]
 */

/** Options pour la construction du bouton pour télécharger en HTML + CSS
 * @typedef { Object } HTMLButtonOptions
 * @property { string } [template]
 * @property { string } [title]
 * @property { string[] } [styles]
 * @property { string | HTMLImageElement } [buttonText]
 * @property { "start" | "end" | "before" | "after" } [position]
 */

/** Information relatif au options du CV
 * @typedef { Object } CVOptions
 * @property { Storage } storage
 * @property { UserInfo } user
 * @property { ThemeInfo } theme
 */

export default class CV {
	static #APP = "ABC";
	static #userInputs = [
		'lastname', 'firstname', 'poste',
		'address', 'tel', 'mail', 'linkedin',
		'twitter', 'website', 'date_naissance',
		"photo", 'langue_name', 'langue_level',
		'competence_name', 'competence_description',
		'etude_date_deb', 'etude_date_fin', 'etude_lieu',
		'etude_intitule', 'etude_description',
		'experience_date_deb', 'experience_date_fin', 'experience_lieu',
		'experience_intitule', 'experience_description', 'interests'
	];

	/**
	 * @type { ABCproject }
	 */
	#app;
	#storage;

	/**
	 * @param { CVOptions } options
	 */
	constructor(options = {}) {
		this.#storage = options.storage ?? localStorage;
		this.#app = this.#getDataAppFromStorage() ?? {}; // On récupère les données depuis le store sinon on créer un nouveau
		this.#app.user = options.user ?? this.#app.user ?? {}; // Si ce paramètre est définit alors on l'applique sinon on garde l'original
		this.#app.theme = options.theme ?? this.#app.theme ?? {}; // Si ce paramètre est définit alors on l'applique sinon on garde l'original
	}

	/** Sauvegarde une données (data) dans le store grâce à une clé donnée (key)
	 * @param { ABCproject } data Données à sauvegarder
	 * @returns Vrai si réussite, sinon faux
	 */
	#saveDataAppToStorage(data = this.#app) {
		try {
			this.#storage.setItem(CV.#APP, JSON.stringify(data));
			return true;
		} catch {
			return false;
		}
	}

	/** Sauvegarde une données (data) dans un objet (app) grâce à une clé donnée (key)
	 * @param { ABCproject | UserInfo | ThemeInfo } data Donnée à sauvegarder
	 * @param { ABCKey } key Clé
	 * @param { ABCproject } [app=this.#app] Objet à explorer
	 * @returns { boolean } Vrai si réussite, sinon Faux si clé non trouvé ou erreur lors de la sauvegarde
	 */
	saveDataApp(data, key, app = this.#app) {
		if (key === CV.#APP || app[key]) {
			app[key] = { ...app[key], ...data };
			return this.#saveDataAppToStorage();
		}

		for (const k of Object.keys(app)) {
			if (typeof app[k] === 'object' && this.saveDataApp(data, key, app[k])) {
				return true;
			}
		}

		return false;
	}

	/** Récupère une données dans un objet (app) grâce à une clé donnée (key) 
	 * @param { ABCKey } [key=CV.#APP] Clé
	 * @param { ABCproject } [app=this.#app] Objet à explorer
	 */
	getDataApp(key = CV.#APP, app = this.#app) {
		if (key === CV.#APP) return app;
		if (app[key]) return app[key];
		for (const k of Object.keys(app)) {
			if (typeof app[k] === 'object') {
				const result = this.getDataApp(key, app[k]);
				if (result) return result;
			}
		}
		return null;
	}

	/** Récupère les données du CV depuis le store
	 * @returns { ABCproject | null }
	 */
	#getDataAppFromStorage() {
		const appStorage = this.#storage.getItem(CV.#APP);
		return appStorage && appStorage.includes('{') ? JSON.parse(appStorage) : null;
	}

	/** Fusionne les propriétés existant par des nouveaux
	 * @param { UserInfo } user 
	 * @param { boolean } [save=true] Sauvegarder dans le store ?
	 */
	setUserInfo(user, save = true) {
		save ? this.saveDataApp(user, "user", this.#app) : this.#app.user = { ...this.#app.user, ...user };
	}

	/** Fusionne les propriétés existant par des nouveaux
	 * @param { ThemeInfo } theme
	 * @param { boolean } [save=true] Sauvegarder dans le store ?
	 */
	setThemeInfo(theme, save = true) {
		save ? this.saveDataApp(theme, "theme", this.#app) : this.#app.theme = { ...this.#app.theme, ...theme };
	}

	setThemeByForm(form) {
		const radio = form.querySelector('input[type="radio"]');
		radio.addEventListener('change', () => {
			switch (radio.name) {
				case 'choix_couleur':
					this.setThemeInfo({ palette: radio.value })
					break;
				case 'choix_template':
					this.setThemeInfo({ template: radio.value })
					break;
			}
		})
	}

	/** Récupère les informations relatif à l'utilisateur via un écoute d'un champ radio depuis un formulaire donnée
	 * @param { HTMLFormElement } form
	 */
	setThemePaletteByForm(form) {
		/**
		 * @type { HTMLInputElement }
		 */
		const radio = form.querySelector('input[type="radio"]');
		radio.addEventListener('change', () => this.#app.theme.palette = `./themes/palette/${radio.value}/style.css`);
	}

	/** Récupère les informations relatif à l'utilisateur via un écoute d'un champ radio depuis un formulaire donnée
	 * @param { HTMLFormElement } form
	 */
	setThemeTemplateByForm(form) {
		/**
		 * @type { HTMLInputElement }
		 */
		const radio = form.querySelector('input[type="radio"]');
		radio.addEventListener('change', () => this.#app.theme.template = `./themes/template/${radio.value}/index.html`);
	}

	/** Affiche les informations relatif à l'utilisateur dans la pré-vue
	 * @param {HTMLElement | Element } preview 
	 */
	displayUserInfoOnPreview(preview) {
		function select(element) { return preview.querySelectorAll(element) }

		const user = this.#app.user;

		/** Définition d'un "champ"
		 * @typedef Champ
		 * @property { NodeListOf<Element> } champs Tableau des champs sélectionner
		 * @property { string } value Valeur associé aux champs
		 * @property { string } type Type de champ
		 */

		/**
		 * @type { Champ[] }
		 */
		const TabChamps = [
			{
				champs: select('span.lastname'),
				value: user.lastname,
				type: "lastname"
			},
			{
				champs: select('span.firstname'),
				value: user.firstname,
				type: "firstname"
			},
			{
				champs: select('span.fullname'),
				value: `${user.firstname} ${user.lastname}`,
				type: "fullname"
			},
			{
				champs: select('span.adresse'),
				value: user.address,
				type: "adresse"
			},
			{
				champs: select('span.poste'),
				value: user.poste,
				type: "poste"
			},
			{
				champs: select('span.interests'),
				value: user.interests,
				type: "interests"
			},
			{
				champs: select('span.tel'),
				value: user.tel,
				type: "tel"
			},
			{
				champs: select('span.mail'),
				value: user.mail,
				type: "mail"
			},
			{
				champs: select('span.linkedin'),
				value: user.social.linkedin,
				type: "linkedin"
			},
			{
				champs: select('span.twitter'),
				value: user.social.twitter,
				type: "twitter"
			},
			{
				champs: select('span.website'),
				value: user.social.website,
				type: "website"
			},
			{
				champs: select('span.date_naissance'),
				value: user.date_naissance,
				type: "date_naissance"
			},
			{
				champs: select('#photo'),
				value: user.photo,
				type: "photo"
			}
		]

		for (const { champs, value, type } of Object.values(TabChamps)) {
			for (const champ of champs) {
				if (type !== 'photo') {
					champ.textContent = value ?? '';
				} else {
					champ.src = value ?? '';
					champ.alt = "User's photo"
				}
			}
		}
	}

	/** Récupère les informations relatif à l'utilisateur via un écoute d'un formulaire
	 * @param { HTMLFormElement } form 
	 */
	async setUserInfoByForm(form) {
		form.addEventListener('submit', e => {
			e.preventDefault();

			document.querySelectorAll('input').forEach(async input => {
				const key = input.name;
				const value = input.value;

				if (CV.#userInputs.includes(key)) {
					this.#app.user.social ??= {};
					this.#app.user.experience ??= {};
					this.#app.user.etude ??= {};
					this.#app.user.competence ??= {};
					this.#app.user.langue ??= {};

					if (input.hasAttribute('data-social')) {
						this.#app.user.social[key] = value;
					} else if (input.hasAttribute('data-photo')) {
						this.#app.user.photo = await CV.#convertImageToBase64(input.files[0]);
					} else if (input.hasAttribute('data-competence')) {
						this.#app.user.competence.push({ [key]: value });
					} else if (input.hasAttribute('data-etude')) {
						this.#app.user.etude.push({ [key]: value });
					} else if (input.hasAttribute('data-experience')) {
						this.#app.user.experience.push({ [key]: value });
					} else if (input.hasAttribute('data-langues')) {
						this.#app.user.langue.push({ [key]: value });
					} else {
						this.#app.user[key] = value;
					}
				}
			});

			this.#saveDataAppToStorage();
			location.href = "./form.theme.html";
		});
	}

	/** Convertit une image en base64
	 * @param {File} image Le fichier image à convertir
	 * @returns Une promesse qui se résout avec la chaîne base64 de l'image
	 */
	static async #convertImageToBase64(image) {
		return new Promise(_ => {
			const r = new FileReader();
			r.onloadend = () => _(r.result);
			r.readAsDataURL(image);
		});
	}

	/** Export le CV au format PDF
	 * @param { HTMLElement | Element } where 
	 * @param { HTMLElement | Element } content
	 * @param { PDFButtonOptions } [options={}] 
	 */
	async exportToPDF(where, content, options = {}) {
		const { default: PDF } = await import("./pdf.mjs");
		const title = options.title ?? `CV${this.#app.user.lastname ? ` - ${this.#app.user.lastname}` : ""}${this.#app.user.firstname ? ` ${this.#app.user.firstname}` : ""}`;
		PDF.createButton(
			where,
			content,
			options = { ...options, title: title }
		);
	}

	/** Export le CV au format HTML
	 * @param { HTMLElement | Element } where 
	 * @param { HTMLElement | Element } content 
	 * @param { string[] } styles 
	 * @param { HTMLButtonOptions } [options={}]
	 */
	async exportToHTML(where, content, options = { template: this.#app.theme.template }) {
		const { default: HTML } = await import("./htmlcss.mjs");
		const title = options.title ?? `CV${this.#app.user.lastname ? ` - ${this.#app.user.lastname}` : ""}${this.#app.user.firstname ? ` ${this.#app.user.firstname}` : ""}`;
		const themeTemplate = options.template ?? this.#app.theme.template ?? "";
		delete options.template;
		HTML.createButton(
			where,
			content,
			template = themeTemplate,
			options = { ...options, title: title }
		);
	}

	/** Calcul l'âge de l'utilisateur
	 * @param { string } date Valeur d'un champ input type date
	 * @returns Âge de l'utilisateur
	 */
	static computeAgeOfUser(date) {
		if (!date) return -1; // Âge absurde pour signaler une erreur
		/** Date actuelle */
		const n = new Date();
		/** Date de naissance */
		const dn = new Date(date);
		/** Différence entre le mois actuel et le mois de naissance */
		const m = n.getMonth() - dn.getMonth();

		/** Si le mois de naissance est déjà passé sur l'année en cours */
		const BirthDayMonthAlreadyPass = m < 0; // Si 0 = même mois => Faux
		/** Si le mois de naissance est celui en cours ainsi que le jour de naissance n'est pas encore passé */
		const BirthDayDateAlreadyPass = m === 0 && n.getDate() < dn.getDate(); // Si 0 = même jour => Faux
		let age = n.getFullYear() - dn.getFullYear(); // Calcul préliminaire de l'âge
		return (BirthDayMonthAlreadyPass || BirthDayDateAlreadyPass) ? --age : age; // Re-calcul de l'âge selon condition
	}
}

const cv = new CV();

await cv.setUserInfoByForm(document.getElementById('user'));