import CV from './modules/cv.js';

const cv = new CV();

const UserForm = document.getElementById('user');
const ThemeForm = document.getElementById('theme');
const Preview = document.getElementById('preview');

if (UserForm) await cv.setUserInfoByForm(UserForm);
if (ThemeForm) cv.setThemeByForm(ThemeForm);

if (Preview) {
	cv.displayUserInfoOnPreview(Preview);
	cv.exportToHTML(Preview, Preview);
	cv.exportToPDF(Preview, Preview);
};