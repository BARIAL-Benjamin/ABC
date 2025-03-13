import CV from './modules/cv.js';

const cv = new CV();

const UserForm = document.getElementById('user');
const ThemeForm = document.getElementById('theme');
const Preview = document.getElementById('preview');
const Summary = document.getElementById('summary');
const Buttons = document.getElementById('buttons');

if (UserForm) await cv.setUserInfoByForm(UserForm);
if (ThemeForm) cv.setThemeByForm(ThemeForm);

if (Preview) {
	// cv.displayAllInfoOnSummary(Summary);
	cv.displayUserInfoOnPreview(Preview);
	await cv.exportToHTML(Buttons, Preview, { position: "start" });
	await cv.exportToPDF(Buttons, Preview, { position: "start" });
};