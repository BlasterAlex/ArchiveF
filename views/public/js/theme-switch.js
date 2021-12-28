const DARK_THEME_PATH = '/css/third-party/bootswatch-4/darkly.bootstrap.min.css';
const WHITE_THEME_PATH = '/css/third-party/bootswatch-4/litera.bootstrap.min.css';
const DARK_BACKGROUND = '#222';
const WHITE_BACKGROUND = '#fff';

const themeStyle = document.getElementById('theme-style');
const isDarkMode = localStorage.getItem('lightMode') === null || localStorage.getItem('lightMode') !== 'enabled';

function setBackgroundColor(isDarkMode) {
  if (isDarkMode) {
    document.documentElement.style.backgroundColor = DARK_BACKGROUND;
  } else {
    document.documentElement.style.backgroundColor = WHITE_BACKGROUND;
  }
}
setBackgroundColor(isDarkMode);

window.addEventListener('load', function () {
  let darkSwitch = document.getElementById('darkSwitch');
  if (darkSwitch) {
    darkSwitch.checked = isDarkMode;
    darkSwitch.checked ? activateDark() : deactivateDark();
    darkSwitch.addEventListener('change', function () {
      darkSwitch.checked ? activateDark() : deactivateDark();
    });
  }
});

function activateDark() {
  setBackgroundColor(true);
  themeStyle.setAttribute('href', DARK_THEME_PATH);
  document.body.setAttribute('data-theme', 'dark');
  localStorage.removeItem('lightMode');
}

function deactivateDark() {
  setBackgroundColor(false);
  themeStyle.setAttribute('href', WHITE_THEME_PATH);
  document.body.removeAttribute('data-theme');
  localStorage.setItem('lightMode', 'enabled');
}
