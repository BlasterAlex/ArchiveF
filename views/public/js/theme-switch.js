const DARK_THEME_PATH = '/css/third-party/bootswatch-4/darkly.bootstrap.min.css';
const WHITE_THEME_PATH = '/css/third-party/bootswatch-4/litera.bootstrap.min.css';
const DARK_BACKGROUND = '#222';
const WHITE_BACKGROUND = '#fff';

const themeStyle = document.getElementById('theme-style');
const isDarkMode = localStorage.getItem('darkSwitch') !== null && localStorage.getItem('darkSwitch') === 'dark';
setBackgroundColor(isDarkMode);

window.addEventListener('load', function () {
  let darkSwitch = document.getElementById('darkSwitch');
  if (darkSwitch) {
    darkSwitch.checked = localStorage.getItem('darkSwitch') !== null && localStorage.getItem('darkSwitch') === 'dark';
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
  localStorage.setItem('darkSwitch', 'dark');
}

function deactivateDark() {
  setBackgroundColor(false);
  themeStyle.setAttribute('href', WHITE_THEME_PATH);
  document.body.removeAttribute('data-theme');
  localStorage.removeItem('darkSwitch');
}

function setBackgroundColor(isDarkMode) {
  if (isDarkMode) {
    document.documentElement.style.backgroundColor = DARK_BACKGROUND;
  } else {
    document.documentElement.style.backgroundColor = WHITE_BACKGROUND;
  }
}