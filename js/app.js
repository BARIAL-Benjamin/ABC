import CV from './modules/cv.js';

const cv = new CV();

const UserForm = document.getElementById('user');
const ThemeForm = document.getElementById('theme');
const Preview = document.getElementById('preview');
const Summary = document.getElementById('summary');

if (UserForm) await cv.setUserInfoByForm(UserForm);
if (ThemeForm) cv.setThemeByForm(ThemeForm);

if (Preview) {
	cv.setThemeInfo({
		palette: "./css/style.css"
	})
	cv.displayAllInfoOnSummary(Summary);
	cv.displayUserInfoOnPreview(Preview);
	await cv.exportToHTML(Preview, Preview, { position: "after" });
	await cv.exportToPDF(Preview, Preview, { position: "after" });
};