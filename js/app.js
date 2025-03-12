import CV from './modules/cv.mjs';
const cv = new CV();

const UserForm = document.getElementById('user');
const ThemeForm = document.getElementById('theme');

const onPreview = !(UserForm || ThemeForm);

if (UserForm) cv.setUserInfoByForm(UserForm);
if (ThemeForm) cv.setThemeByForm(ThemeForm);

if (onPreview) cv.displayUserInfoOnPreview(document.getElementById('preview'));