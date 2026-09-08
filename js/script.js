const language = document.getElementById('language')
const translatable = document.querySelectorAll('[data-pt][data-en]')
const languageOptions = document.querySelectorAll('.language-option')
const languageMenu = language.closest('.dropdown').querySelector('.dropdown-menu')
const languageLabels = {
  pt: { code: 'PT', name: 'Português', flag: 'assets/flags/brazil.svg' },
  en: { code: 'EN', name: 'English', flag: 'assets/flags/united-states.svg' }
}

function setLanguage(value) {
  document.documentElement.lang = value === 'pt' ? 'pt-BR' : 'en'
  translatable.forEach(element => {
    element.textContent = element.dataset[value]
  })
  const selectedLanguage = languageLabels[value]
  language.innerHTML = `
    <img src="${selectedLanguage.flag}" alt="" width="20" height="14">
    <span>${selectedLanguage.code}</span>
  `
  language.setAttribute('aria-label', selectedLanguage.name)
  localStorage.setItem('portfolio-language', value)
}

languageOptions.forEach(option => {
  option.addEventListener('click', () => {
    setLanguage(option.dataset.language)
    languageMenu.classList.remove('show')
    language.setAttribute('aria-expanded', 'false')
  })
})

language.addEventListener('click', () => {
  const isOpen = languageMenu.classList.toggle('show')
  language.setAttribute('aria-expanded', String(isOpen))
})

document.addEventListener('click', event => {
  if (!language.closest('.dropdown').contains(event.target)) {
    languageMenu.classList.remove('show')
    language.setAttribute('aria-expanded', 'false')
  }
})

const savedLanguage = localStorage.getItem('portfolio-language') || 'pt'
setLanguage(savedLanguage)
