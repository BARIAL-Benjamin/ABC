import { GithubLink, LinkedInLink, WebSiteLink } from "./modules/social.mjs";
import Settings from "./modules/settings.mjs";
import PDF from "./modules/pdf.mjs";
import HTML from "./modules/htmlcss.mjs";

const formUser = document.querySelector("#social");
/**
 * @type {HTMLInputElement}
 */
const inputMedia = document.querySelector("#media");
const labelPseudo = formUser.querySelector('label[for="pseudo"]');
/**
 * @type {HTMLInputElement}
 */
const inputPseudo = document.querySelector("#pseudo");
const labelWebsiteLink = formUser.querySelector('label[for="websiteLink"]');
/**
 * @type {HTMLInputElement}
 */
const inputWebsiteLink = document.querySelector("#websiteLink");

const list = document.getElementById("list");

inputMedia.addEventListener("change", () => {
	const isWebsite = inputMedia.value === "WebSite";
	labelPseudo.textContent = isWebsite ? "Nom du site" : "Pseudonyme";
	inputPseudo.placeholder = isWebsite ? "Nom" : "Votre pseudo";
	if (isWebsite) labelWebsiteLink.classList.toggle('inactive');
	if (isWebsite) inputWebsiteLink.classList.toggle('inactive');
});

/** Créer un objet
 * @param { string } type
 * @param { string } name
 * @param { string } link
 * @param { Object } [user=null] Objet de l'utilisateur
 * @param { string } user.login
 * @param { number } user.id
 * @param { string } user.node_id
 * @param { string } user.avatar_url
 * @param { string } user.gravatar_id
 * @param { string } user.url
 * @param { string } user.html_url
 * @param { string } user.followers_url
 * @param { string } user.following_url
 * @param { string } user.gists_url
 * @param { string } user.starred_url
 * @param { string } user.subscriptions_url
 * @param { string } user.organizations_url
 * @param { string } user.repos_url
 * @param { string } user.events_url
 * @param { string } user.received_events_url
 * @param { string } user.type
 * @param { string } user.user_view_type
 * @param { string } user.site_admin
 * @param { string } user.name
 * @param { string } user.company
 * @param { string } user.blog
 * @param { string } user.location
 * @param { string } user.email
 * @param { string } user.hireable
 * @param { string } user.bio
 * @param { string } user.twitter_username
 * @param { string } user.public_repos
 * @param { string } user.public_gists
 * @param { string } user.followers
 * @param { string } user.following
 * @param { string } user.created_at
 * @param { string } user.updated_at
 * @returns { GithubLink | LinkedInLink | WebSiteLink }
 */
function createMediaObject(type, name, link = null) {
	switch (type) {
		case "linkedin":
			return new LinkedInLink(name, link);
		case "github":
			return new GithubLink(name, link);
		case "website":
			return new WebSiteLink(name, link);
		default:
			return new LinkedInLink(name, link);
	}
}

const settings = new Settings();

(async () => {
	for (const key of Object.keys(settings.links)) {
		for (const link of settings.links[key]) {
			const media = createMediaObject(key, link.name, link.link);
			await buildMediaLink(list, media);
		}
	}
})();

/** Construit les vues des liens
 * @param {HTMLUListElement} list
 * @param {GithubLink | WebSiteLink | LinkedInLink} media
 */
async function buildMediaLink(list, media) {
	const li = document.createElement("li");

	const pPseudo = document.createElement("p");
	pPseudo.textContent = media.name + " - ";

	const pMedia = document.createElement("p");
	pMedia.textContent = media.constructor.name + " - ";

	li.append(pMedia, pPseudo, media.anchor);
	list.prepend(li);
}

formUser.addEventListener("submit", async (e) => {
	try {
		e.preventDefault();
		const type = inputMedia.value.toLowerCase();
		const name = inputPseudo.value.trim();
		const media = createMediaObject(type, name);
		buildMediaLink(list, media);
		settings.addLink(type, media);

		formUser.reset();
	} catch (e) {
		console.error(e);
	}
});

// Construit les boutons pour télécharger le document au format PDF et HTMLCSS
(async () => {
	try {
		await PDF.createButton(
			document.getElementById('list'),
			document.getElementById('list')
		);
	} catch (e) {
		console.error(e);
		document.getElementById('error').textContent = e;
	}

	try {
		await HTML.createButton(
			document.getElementById('list'),
			document.getElementById('cv')
		);
	} catch (e) {
		console.error(e);
		document.getElementById('error').textContent = e;
	}
})();