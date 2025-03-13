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
 * @property { string } [introduction]
 * @property { string } [permis]
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
		'poste', 'introduction', // general
		'lastname', 'firstname', 'address', 'tel', 'mail', 'date_naissance', "photo", 'permis', 'interests', // personal
		'linkedin', 'twitter', 'website', // social
		'langue_name', 'langue_level', // langue
		'competence_name', 'competence_description', // competences
		'etude_date_deb', 'etude_date_fin', 'etude_lieu', 'etude_intitule', 'etude_description', // etudes
		'experience_date_deb', 'experience_date_fin', 'experience_lieu', 'experience_intitule', 'experience_description' // experiences
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
		this.#app.user.social ??= {};
		this.#app.user.experience ??= {};
		this.#app.user.etude ??= {};
		this.#app.user.competence ??= {};
		this.#app.user.langue ??= {};
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

	/** Récupère les informations relatif à l'utilisateur via un écoute d'un champ radio depuis un formulaire donnée
	 * @param { HTMLFormElement } form
	 */
	setThemeByForm(form) {
		const templates = form.querySelector('#templates');
		const palettes = form.querySelector('#couleurs');
		/**
		 * @type { NodeListOf<HTMLInputElement> }
		 */
		const templatesRadios = templates.querySelectorAll('input[name="choix_template"]');
		/**
		 * @type { NodeListOf<HTMLInputElement> }
		 */
		const palettesRadios = palettes.querySelectorAll('input[name="choix_couleur"]');

		templatesRadios.forEach(radio => {
			if (radio) {
				radio.addEventListener('change', () => {
					const value = radio.getAttribute('data-template');
					if (value) this.setThemeInfo({ template: `./themes/templates/${value}/index.html` })
				})
			}
		})

		palettesRadios.forEach(radio => {
			if (radio) {
				radio.addEventListener('change', () => {
					const value = radio.getAttribute('data-palette');
					if (value) this.setThemeInfo({ palette: `./themes/palette/${value}/style.css` })
				})
			}
		})

		form.addEventListener('submit', e => { e.preventDefault(); location.href = './preview.html' })
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
	async displayUserInfoOnPreview(preview) {
		function select(element) { return doc.querySelectorAll(element) }

		const theme = this.#app.theme;
		const palette = theme.palette ?? './themes/palette/0/style.css';
		const template = theme.template ?? './themes/templates/0/index.html';

		const doc = (new DOMParser()).parseFromString(await fetch(template).then(r => r.text()), "text/html"); // Document du template

		const user = this.#app.user;

		/** Définition d'un "champ"
		 * @typedef Champ
		 * @property { NodeListOf<Element> } champs Tableau des champs sélectionner
		 * @property { string | Etude[] | Langue[] | Competence[] | Experience[] } value Valeur associé aux champs
		 * @property { string } type Type de champ
		 */

		/**
		 * @type { Champ[] }
		 */
		const TabChamps = [
			{
				champs: select('span.lastname'),
				value: user.lastname ?? "Nom",
				type: "lastname"
			},
			{
				champs: select('span.firstname'),
				value: user.firstname ?? "Prénom",
				type: "firstname"
			},
			{
				champs: select('span.permis'),
				value: user.permis ?? "",
				type: "permis"
			},
			{
				champs: select('span.introduction'),
				value: user.introduction ?? "",
				type: "introduction"
			},
			{
				champs: select('span.fullname'),
				value: `${user.firstname ?? "Prénom"} ${user.lastname ?? "Nom"}`,
				type: "fullname"
			},
			{
				champs: select('span.adresse'),
				value: user.address ?? "",
				type: "adresse"
			},
			{
				champs: select('span.poste'),
				value: user.poste ?? "",
				type: "poste"
			},
			{
				champs: select('span.interests'),
				value: user.interests ?? "",
				type: "interests"
			},
			{
				champs: select('span.tel'),
				value: user.tel ?? "06 06 06 06 06",
				type: "tel"
			},
			{
				champs: select('span.mail'),
				value: user.mail ?? "exemple@gmail.com",
				type: "mail"
			},
			{
				champs: select('a.linkedin'),
				value: user.social?.linkedin ?? "",
				type: "linkedin"
			},
			{
				champs: select('a.twitter'),
				value: user.social?.twitter ?? "",
				type: "twitter"
			},
			{
				champs: select('a.website'),
				value: user.social?.website ?? "",
				type: "website"
			},
			{
				champs: select('span.date_naissance'),
				value: user.date_naissance ?? "",
				type: "date_naissance"
			},
			{
				champs: select('#photo'),
				value: user.photo ?? "",
				type: "photo"
			},
			{
				champs: select('#competences'),
				value: user.competence ?? {},
				type: 'competences'
			},
			{
				champs: select('#etudes'),
				value: user.etude ?? {},
				type: 'etudes'
			},
			{
				champs: select('#experiences'),
				value: user.experience ?? {},
				type: 'experiences'
			},
			{
				champs: select('#langues'),
				value: user.langue ?? {},
				type: 'langues'
			}
		]

		const specialType = [
			'website', 'twitter', 'linkedin',
			'competences', 'langues', 'etudes',
			'experiences'
		]

		if (palette) {
			const link = doc.createElement('link');
			link.rel = "stylesheet";
			link.href = palette;
			doc.head.append(link);
		}

		for (const { champs, value, type } of Object.values(TabChamps)) {
			for (const champ of champs) {
				if (type === 'photo') {
					champ.src = value ?? '';
					champ.alt = "User's photo";
				} else if (typeof value === 'string') {
					if (['twitter', 'linkedin', 'website'].includes(type)) {
						switch (type) {
							case 'linkedin':
								champ.href = `https://www.linkedin.com/in/${value}`;
								break;
							case 'twitter':
								champ.href = `https://x.com/${value}`;
								break;
							case 'website':
							default:
								champ.href = value;
								break;
						}
						champ.target = '_blank';
						champ.textContent = user.social[type];
					} else {
						if (value) champ.textContent = value;
					}
				} else if (specialType.includes(type) && Array.isArray(value)) {
					value.forEach(item => {
						const ul = document.createElement('ul');
						Object.entries(item).forEach(([key, val]) => {
							if (val) {
								const li = document.createElement('li');
								li.textContent = val;
								ul.append(li);
							}
						});
						champ.append(ul);
					});
				}
			}
		}
		preview.appendChild(doc.documentElement);
	}

	/** Affiche les informations relatif à l'utilisateur et au thème dans le récapitulatif
	 * @param { HTMLElement | Element } summary 
	 */
	displayAllInfoOnSummary(summary) {
		const h1 = document.createElement('h1');
		h1.textContent = "Récapitulatif de vos informations";

		summary.append(
			h1,
			this.#displayInfoPerso(),
			this.#displayExperience(),
			this.#displayEtude(),
			this.#displayCompetence(),
			this.#displayLangue(),
			this.#displaySocial()
		)
	}

	#displaySocial() {
		const section = document.createElement('section')
		const h2 = document.createElement('h2');
		h2.textContent = "Réseaux sociaux";
		const ul = document.createElement('ul');

		const xp = this.#app.user.social;

		Object.entries(xp).forEach(([key, value]) => {
			const li = document.createElement('li');
			switch (key) {
				case 'twitter':
					li.textContent = `Twitter : ${value}`;
					break;
				case 'linkedin':
					li.textContent = `LinkedIn : ${value}`;
					break;
				case 'website':
					li.textContent = `Site web : ${value}`;
					break;
				default:
					console.warn(`Clé (${key}) non pris en charge : ${value}`);
					break;
			}
			ul.append(li);
		});

		section.append(h2, ul);
		return section;

	}

	#displayLangue() {
		const section = document.createElement('section')
		const h2 = document.createElement('h2');
		h2.textContent = "Langues";
		const ul = document.createElement('ul');

		const xp = this.#app.user.langue;

		Object.keys(xp).forEach(key => {
			const liXP = document.createElement('li');
			const ulXP = document.createElement('ul');
			ulXP.textContent = `Langue : ${Number(key) + 1}`;
			if (Object.keys(xp[key]).length > 0) {
				Object.entries(xp[key]).forEach(([k, v]) => {
					if (v !== '') {
						const li = document.createElement('li');
						switch (k) {
							case "nom":
								li.textContent = `Nom : ${v}`;
								break;
							case "niveau":
								li.textContent = `Niveau : ${v}`;
								break;
							default:
								console.warn(`Clé (${k}) non pris en charge : ${v}`);
								break;
						}
						ulXP.append(li);
					}
				})
			}
			liXP.append(ulXP);
			ul.append(liXP);
		});

		section.append(h2, ul);
		return section;

	}

	#displayExperience() {
		const section = document.createElement('section')
		const h2 = document.createElement('h2');
		h2.textContent = "Expériences";
		const ul = document.createElement('ul');

		const xp = this.#app.user.experience;

		Object.keys(xp).forEach(key => {
			const liXP = document.createElement('li');
			const ulXP = document.createElement('ul');
			ulXP.textContent = `Expérience : ${Number(key) + 1}`;

			if (Object.keys(xp[key]).length > 0) {
				Object.entries(xp[key]).forEach(([k, v]) => {
					if (v !== '') {
						const li = document.createElement('li');
						switch (k) {
							case "intitule":
								li.textContent = `Intitulé : ${v}`;
								break;
							case "lieu":
								li.textContent = `Lieu : ${v}`;
								break;
							case "description":
								li.textContent = `Description : ${v}`;
								break;
							case "date_deb":
								li.textContent = `Date de début : ${v}`;
								break;
							case "date_fin":
								li.textContent = `Date de fin : ${v}`;
								break;
							default:
								console.warn(`Clé (${k}) non pris en charge : ${v}`);
								break;
						}
						ulXP.append(li);
					}
				})
			}
			liXP.append(ulXP);
			ul.append(liXP);
		});

		section.append(h2, ul);
		return section;

	}

	#displayEtude() {
		const section = document.createElement('section')
		const h2 = document.createElement('h2');
		h2.textContent = "Études";
		const ul = document.createElement('ul');

		const xp = this.#app.user.etude;

		Object.keys(xp).forEach(key => {
			const liXP = document.createElement('li');
			const ulXP = document.createElement('ul');
			ulXP.textContent = `Étude : ${Number(key) + 1}`;

			if (Object.keys(xp[key]).length > 0) {
				Object.entries(xp[key]).forEach(([k, v]) => {
					if (v !== '') {
						const li = document.createElement('li');
						switch (k) {
							case "intitule":
								li.textContent = `Intitulé : ${v}`;
								break;
							case "lieu":
								li.textContent = `Lieu : ${v}`;
								break;
							case "description":
								li.textContent = `Description : ${v}`;
								break;
							case "date_deb":
								li.textContent = `Date de début : ${v}`;
								break;
							case "date_fin":
								li.textContent = `Date de fin : ${v}`;
								break;
							default:
								console.warn(`Clé (${k}) non pris en charge : ${v}`);
								break;
						}
						ulXP.append(li);
					}
				})
			}
			liXP.append(ulXP);
			ul.append(liXP);
		});

		section.append(h2, ul);
		return section;

	}

	#displayCompetence() {
		const section = document.createElement('section')
		const h2 = document.createElement('h2');
		h2.textContent = "Compétences";
		const ul = document.createElement('ul');

		const xp = this.#app.user.competence;

		Object.keys(xp).forEach(key => {
			const liXP = document.createElement('li');
			const ulXP = document.createElement('ul');
			ulXP.textContent = `Compétence : ${Number(key) + 1}`;
			if (Object.keys(xp[key]).length > 0) {
				Object.entries(xp[key]).forEach(([k, v]) => {
					if (v !== '') {
						const li = document.createElement('li');
						switch (k) {
							case "nom":
								li.textContent = `Nom : ${v}`;
								break;
							case "description":
								li.textContent = `Description : ${v}`;
								break;
							default:
								console.warn(`Clé (${k}) non pris en charge : ${v}`);
								break;
						}
						ulXP.append(li);
					}
				})
			}
			liXP.append(ulXP);
			ul.append(liXP);
		});

		section.append(h2, ul);
		return section;

	}

	/** Créer la section pour afficher les informations perso */
	#displayInfoPerso() {
		const section = document.createElement('section')
		const h2 = document.createElement('h2');
		h2.textContent = "Informations personnel";
		const ul = document.createElement('ul');

		Object.entries(this.#app.user).forEach(([key, value]) => {
			if (typeof value !== 'object') {
				const li = document.createElement('li');
				switch (key) {
					case 'photo':
						const img = new Image();
						img.src = value;
						img.style.width = "200px";
						img.style.height = "auto";
						li.textContent = "Photo de profil : ";
						li.append(img);
						break;
					case 'poste':
						li.textContent = `Poste recherché : ${value}`;
						break;
					case 'lastname':
						li.textContent = `Nom : ${value}`;
						break;
					case 'firstname':
						li.textContent = `Prénom : ${value}`;
						break;
					case 'introduction':
						li.textContent = `Introduction : ${value}`;
						break;
					case 'date_naissance':
						const age = CV.computeAgeOfUser(value);
						const displayAge = age >= 0 ? `(${age} ans)` : "";
						const formatDate = value ? new Intl.DateTimeFormat('fr-FR', { dateStyle: "long" }).format(new Date(value)) : "";
						li.textContent = `Date de naissance : ${formatDate} ${displayAge}`;
						break;
					case 'tel':
						li.textContent = `Téléphone : ${value}`;
						break;
					case 'mail':
						li.textContent = `Mail : ${value}`;
						break;
					case 'address':
						li.textContent = `Adresse : ${value}`;
						break;
					case 'permis':
						li.textContent = `Permis : ${value}`;
						break;
					default:
						console.warn(`Clé (${key}) non pris en charge : ${value}`);
						break;
				}
				ul.append(li);
			}
		})

		section.append(h2, ul);
		return section;
	}

	/** Récupère les informations relatif à l'utilisateur via un écoute d'un formulaire
	 * @param { HTMLFormElement } form 
	 */
	async setUserInfoByForm(form) {
		form.addEventListener('submit', async e => {
			e.preventDefault();

			const global = form.querySelector('#global');
			const personal = form.querySelector('#personal');
			const experiences = form.querySelector('#experiences');
			const competences = form.querySelector('#competences');
			const langues = form.querySelector('#langues');
			const social = form.querySelector('#social');
			const etudes = form.querySelector('#etudes');

			global.querySelectorAll('input, textarea').forEach(input => {
				const key = input.name;
				if (CV.#userInputs.includes(key)) this.#app.user[key] = input.value;
			});

			social.querySelectorAll('input').forEach(input => {
				const key = input.name;
				if (CV.#userInputs.includes(key)) this.#app.user.social[key] = input.value;
			});

			await Promise.all(Array.from(personal.querySelectorAll('input, textarea')).map(async input => {
				const key = input.name;
				if (CV.#userInputs.includes(key) && key !== "photo") {
					this.#app.user[key] = input.value;
				} else if (input.files.length > 0) {
					this.#app.user[key] = await CV.#convertImageToBase64(input.files[0]);
				}
			}));

			this.#app.user.experience = this.#getExperiencesFromElement(experiences);
			this.#app.user.competence = this.#getCompetencesFromElement(competences);
			this.#app.user.langue = this.#getLanguesFromElement(langues);
			this.#app.user.etude = this.#getEtudesFromElement(etudes);

			this.#saveDataAppToStorage();
			location.href = "./theme.form.html";
		});
	}

	/** Récupère les langues du formulaire
	 * @param { HTMLElement } element - Élément de référence contenant les langues
	 * @returns { Langue[] } - Un tableau d'objets représentant les langues
	 */
	#getLanguesFromElement(element) {
		/**
		 * @type { Langue[] }
		 */
		const langues = [];
		if (element) {
			element.querySelectorAll('.langue').forEach(el => {
				if (el) {
					const langue = {
						nom: el.querySelector('input[name="langue_name"]')?.value,
						niveau: el.querySelector('input[name="langue_level"]')?.value
					};
					if (langue.nom || langue.niveau) {
						langues.push(langue);
					}
				}
			});
		}
		return langues;
	}

	/** Récupère les études du formulaire
	 * @param { HTMLElement } element - Élément de référence contenant les études
	 * @returns { Etude[] } - Un tableau d'objets représentant les études
	 */
	#getEtudesFromElement(element) {
		/**
		 * @type { Etude[] }
		 */
		const etudes = [];
		if (element) {
			element.querySelectorAll('.etude').forEach(el => {
				if (el) {
					const etude = {
						date_deb: el.querySelector('input[name="etude_date_deb"]')?.value,
						date_fin: el.querySelector('input[name="etude_date_fin"]')?.value,
						lieu: el.querySelector('input[name="etude_lieu"]')?.value,
						intitule: el.querySelector('input[name="etude_intitule"]')?.value,
						description: el.querySelector('textarea[name="etude_description"]')?.value
					};
					if (etude.date_deb || etude.date_fin || etude.lieu || etude.intitule || etude.description) {
						etudes.push(etude);
					}
				}
			});
		}
		return etudes;
	}

	/** Récupère les compétences du formulaire
	 * @param { HTMLElement } element - Élément de référence contenant les compétences
	 * @returns { Competence[] } - Un tableau d'objets représentant les compétences
	 */
	#getCompetencesFromElement(element) {
		/**
		 * @type { Competence[] }
		 */
		const competences = [];
		if (element) {
			element.querySelectorAll('.competence').forEach(el => {
				if (el) {
					const competence = {
						nom: el.querySelector('input[name="competence_name"]')?.value,
						description: el.querySelector('textarea[name="competence_description"]')?.value
					};

					// Vérifie si au moins un des champs est rempli
					if (competence.nom || competence.description) {
						competences.push(competence);
					}
				}
			});
		}
		return competences;
	}

	/** Récupère les expériences professionnelles du formulaire
	 * @param { HTMLElement } element - Élément de référence contenant les expériences professionnelles
	 * @returns { Experience[] } - Un tableau d'objets représentant les expériences professionnelles
	 */
	#getExperiencesFromElement(element) {
		/**
		 * @type { Experience[] }
		 */
		const experiences = [];
		if (element) {
			element.querySelectorAll('.experience').forEach(el => {
				if (el) {
					const experience = {
						intitule: el.querySelector('input[name="experience_intitule"]')?.value,
						lieu: el.querySelector('input[name="experience_lieu"]')?.value,
						date_deb: el.querySelector('input[name="experience_date_deb"]')?.value,
						date_fin: el.querySelector('input[name="experience_date_fin"]')?.value,
						description: el.querySelector('textarea[name="experience_description"]')?.value
					};
					if (experience.intitule || experience.lieu || experience.date_deb || experience.date_fin || experience.description) {
						experiences.push(experience);
					}
				}
			});
		}
		return experiences;
	}

	/** Export le CV au format PDF
	 * @param { HTMLElement | Element } where 
	 * @param { HTMLElement | Element } content
	 * @param { PDFButtonOptions } [options={}] 
	 */
	async exportToPDF(where, content, options = {}) {
		const { default: PDF } = await import("./pdf.min.js");
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
	async exportToHTML(where, content, options = {}) {
		const { default: HTML } = await import("./htmlcss.min.js");
		const title = options.title ?? `CV${this.#app.user.lastname ? ` - ${this.#app.user.lastname}` : ""}${this.#app.user.firstname ? ` ${this.#app.user.firstname}` : ""}`;
		const themeTemplate = options.template ?? this.#app.theme.template ?? "";
		const styles = options.styles ?? [this.#app.theme.palette] ?? [];
		delete options.template;

		HTML.createButton(
			where,
			content,
			options = { ...options, title: title, template: themeTemplate, styles: styles }
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
}