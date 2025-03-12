/**
 * @typedef { Object } PDFOptions
 * @property { string } [title]
 * @property { NodeListOf<Element> | Element[] } [elementsToNotDisplay]
 * @property { string | HTMLImageElement } [buttonText]
 * @property { "JPEG" | "WEBP" | "PNG" } [format]
 */

/**
 * @typedef { Object } PDFButtonOptions
 * @property { string } [title]
 * @property { "before" | "start" | "end" | "after" } [position]
 * @property { string | HTMLImageElement } [buttonText]
 * @property { NodeListOf<Element> | Element[] } [elementsToNotDisplay]
 * @property { string | HTMLImageElement } [buttonText]
 * @property { "JPEG" | "WEBP" | "PNG" } [format]
 */

export default class PDF {
	/** Traite, génère et sauvegarde un PDF
	 * @param {HTMLElement | Element} content Élément à capturer
	 * @param { PDFOptions } options Options pour la génération du PDF
	 */
	static async generate(
		content,
		options = {
			elementsToNotDisplay: null,
			format: "WEBP",
			title: document.title
		}
	) {
		try {
			await import("../plugins/html2canvas.min.js");
			await import("../plugins/jspdf.umd.min.js");

			const { jsPDF } = window.jspdf;
			const pdf = new jsPDF();

			if (options.elementsToNotDisplay) options.elementsToNotDisplay.forEach(el => (el.style.display = "none"));

			const originalStyles = {};
			for (let i = 0; i < content.style.length; i++) {
				const key = content.style[i];
				originalStyles[key] = content.style[key];
			}

			content.style.backgroundColor = "none";
			content.style.backgroundImage = "none";
			content.style.boxShadow = "none";

			const canvas = await html2canvas(content);
			const imgData = canvas.toDataURL(content, `image/${options?.format?.toLowerCase() ?? "webp"}`);
			pdf.addImage(imgData, options.format, 0, 0);

			pdf.save(`${options.title}.pdf`);

			for (const key in originalStyles) {
				content.style[key] = originalStyles[key];
			}

			if (options.elementsToNotDisplay) options.elementsToNotDisplay.forEach((el) => (el.style.display = ""));
		} catch (e) {
			console.error(e);
		}
	}

	/** Créer le bouton pour créer le PDF associé au contenu
	 * @param {HTMLElement | Element} where Élément auquel le bouton va se référer
	 * @param {HTMLElement | Element} content Élément à capturer
	 * @param { PDFButtonOptions } options Options pour la création du bouton PDF
	*/
	static async createButton(
		where,
		content,
		options = {
			position: "before",
			buttonText: "PDF ⭳",
			format: "WEBP",
			title: document.title
		}) {

		if (!where) throw new Error("L'élément référent ne peut pas être vide. Vérifier que votre élément existe ou est bien créé avant son appel.");
		if (!content) throw new Error("Le contenu ne peut pas être vide. Vérifier que votre élément existe ou est bien créé avant son appel.");

		options.title = options?.title?.replace(/[^a-zA-Z0-9À-ÿ\ ]+/g, '-') ?? document.title;
		
		const button = document.createElement("button");
		button.innerHTML = options.buttonText ?? "PDF ⭳";
		button.title = options.title;
		button.type = "button";

		delete options.buttonText;
		
		const pos = {
			before: "beforebegin",
			start: "afterbegin",
			end: "beforeend",
			after: "afterend"
		}[options.position ?? "before"] || "beforebegin";

		delete options.position;
		button.addEventListener("click", async () => await PDF.generate(content, options));
		where.insertAdjacentElement(pos, button);
	}
}