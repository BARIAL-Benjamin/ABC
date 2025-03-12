/**
 * @typedef { Object } HTMLOptions
 * @property { string } [title]
 * @property { string[] } [styles]
 * @property { string } [type]
 */

/**
 * @typedef { Object } HTMLButtonOptions
 * @property { string } [title]
 * @property { string[] } [styles]
 * @property { string | HTMLImageElement } [buttonText]
 * @property { "start" | "end" | "before" | "after" } [position]
 */

export default class HTML {
    /** Traite, génère et sauvegarde un HTML
     * @param {HTMLElement | Element} content Élément à capturer
     * @param {string} template Lien vers le template
     * @param {HTMLOptions} options Options pour la génération du HTMLCSS
     */
    static async generate(
        content,
        template,
        options = {
            title: document.title,
            styles: [],
            type: 'text/html'
        }
    ) {
        try {
            const doc = (new DOMParser()).parseFromString(await fetch(template).then(r => r.text()), "text/html"); // Document du template

            if (options.styles && options.styles.length !== 0) {
                await Promise.all(options.styles.map(async style => {
                    const s = document.createElement('style');
                    s.innerHTML = await fetch(style).then(r => r.text());
                    doc.head.append(s);
                }));
            }

            doc.title = options.title ?? document.title;

            const html = `
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    ${doc.head.outerHTML}
                </head>
                <body>
                    ${content.innerHTML}
                </body>
                </html>
            `;

            const dl = document.createElement("a");
            dl.href = URL.createObjectURL(new Blob([html], { type: options.type ?? 'text/html' }));
            dl.download = doc.title;
            dl.click();
        } catch (e) {
            console.error(e);
        }
    }

    /** Créer le bouton pour créer le HTML associé au contenu
     * @param {HTMLElement | Element} where Élément auquel le bouton va se référer
     * @param {HTMLElement | Element} content Élément à capturer
     * @param {string} template Lien vers le template
     * @param {HTMLButtonOptions} options Options pour la création du bouton HTMLCSS
     */
    static async createButton(
        where,
        content,
        template,
        options = {
            styles: [],
            position: "before",
            buttonText: "HTML + CSS ⭳",
            title: document.title
        }
    ) {
        if (!where) throw new Error("L'élément référent ne peut pas être vide. Vérifier que votre élément existe ou est bien créé avant son appel.");
        if (!content) throw new Error("Le contenu ne peut pas être vide. Vérifier que votre élément existe ou est bien créé avant son appel.");

        options.title = options?.title?.replace(/[^a-zA-Z0-9À-ÿ\ ]+/g, '-') ?? document.title;

        const button = document.createElement("button");
        button.innerHTML = options.buttonText ?? "HTML + CSS ⭳";
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
        button.addEventListener("click", async () => await HTML.generate(content, template, options));
        where.insertAdjacentElement(pos, button);
    }
}