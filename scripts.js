const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let results = document.getElementsByClassName('results')[0];

  function el(type) {
    const element = document.createElement(type);
    return element;
  }

  function clear() {
    const parent = results.parentElement;
    const newResults = el('div');
    newResults.classList.add('results');
    parent.removeChild(results);
    parent.appendChild(newResults);
    results = newResults;
  }

  function message(text) {
    const theDiv = el('div');
    theDiv.appendChild(document.createTextNode(text));
    results.appendChild(theDiv);
  }

  function loadingScreen() {
    const loading = el('div');
    const image = el('img');
    image.setAttribute('src', '/loading.gif');
    image.setAttribute('class', 'loading img');
    loading.setAttribute('class', 'loading');
    loading.appendChild(image);
    results.appendChild(loading);
  }

  async function fetchData(companyName) {
    if (companyName === '') {
      return message('Lén verður að vera strengur');
    }
    loadingScreen();
    try {
      const result = await fetch(`${API_URL}${companyName}`);
      clear();
      if (result.status !== 200) {
        return console.error('Non 200 status');
      }
      const data = await result.json();
      if (data.results === 0) {
        return message('Ekkert fyrirtæki fannst fyrir leitarstreng');
      }
      return data;
    } catch (e) {
      clear();
      return message('Villa við að sækja gögn');
    }
  }

  function makeList(key, value, element) {
    const keyEl = el('dt');
    const valueEl = el('dd');
    keyEl.appendChild(document.createTextNode(key));
    valueEl.appendChild(document.createTextNode(value));
    element.appendChild(keyEl);
    element.appendChild(valueEl);
  }

  function makeCompany(object) {
    const company = el('div');
    const dl = el('dl');
    company.classList.add('company');
    company.appendChild(dl);
    makeList('name', object.name, dl);
    makeList('sn', object.sn, dl);
    if (object.active === 1) {
      makeList('address', object.address, dl);
      company.classList.add('company--active');
    } else {
      company.classList.add('company--inactive');
    }
    results.appendChild(company);
  }

  function showData(data) {
    for (const company of data.results) { /* eslint-disable-line */
      makeCompany(company);
    }
  }

  async function formHandler(e) {
    e.preventDefault();
    clear();
    const texti = document.getElementsByTagName('input')[0].value;
    const uppl = await fetchData(texti);
    showData(uppl);
  }

  function init() {
    const form = document.getElementsByTagName('form');
    form[0].addEventListener('submit', formHandler);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  program.init();
});
