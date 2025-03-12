import PDF from './pdf.min.js'
import HTMLCSS from './htmlcss.mjs'

// Construit le bouton pour télécharger le document au format PDF
(async () => {
    try {
        await PDF.createButtonPDF({
            where: document.getElementById('list'),
            content: document.getElementById('list')
        });
    } catch (e) {
        console.error(e);
        document.getElementById('error').textContent = e;
    }

    try {
        await HTMLCSS.createButtonHTMLCSS({
            where: "",
            content: ""
        });
    } catch (e) {
        console.error(e);
        document.getElementById('error').textContent = e;
    }
})()