const language = document.getElementById('language')
const translatable = document.querySelectorAll('[data-pt][data-en]')
const languageOptions = [...document.querySelectorAll('.language-option')]
const languageMenu = document.getElementById('languageMenu')
const languageLabels = {
  pt: {
    code: 'PT',
    name: 'Português',
    flag: 'assets/flags/brazil.svg',
    label: 'Idioma',
    newTab: '(abre em nova aba)'
  },
  en: {
    code: 'EN',
    name: 'English',
    flag: 'assets/flags/united-states.svg',
    label: 'Language',
    newTab: '(opens in a new tab)'
  }
}

function setLanguage(value) {
  if (!languageLabels[value]) value = 'pt'
  const selectedLanguage = languageLabels[value]
  document.documentElement.lang = value === 'pt' ? 'pt-BR' : 'en'
  translatable.forEach((element) => {
    element.textContent = element.dataset[value]
  })

  // links externos: aviso para leitores de tela
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    let hint = link.querySelector('.visually-hidden')
    if (!hint) {
      hint = document.createElement('span')
      hint.className = 'visually-hidden'
      link.append(hint)
    }
    hint.textContent = ` ${selectedLanguage.newTab}`
  })

  language.querySelector('img').src = selectedLanguage.flag
  language.querySelector('span').textContent = selectedLanguage.code
  language.setAttribute(
    'aria-label',
    `${selectedLanguage.label}: ${selectedLanguage.name}`
  )
  languageOptions.forEach((option) => {
    const isCurrent = option.dataset.language === value
    option.classList.toggle('active', isCurrent)
    if (isCurrent) option.setAttribute('aria-current', 'true')
    else option.removeAttribute('aria-current')
  })
  try {
    localStorage.setItem('portfolio-language', value)
  } catch {
    /* armazenamento indisponível */
  }
}

function isMenuOpen() {
  return languageMenu.classList.contains('show')
}

function openMenu(focusCurrent = false) {
  languageMenu.classList.add('show')
  language.setAttribute('aria-expanded', 'true')
  if (focusCurrent) {
    const current = languageOptions.findIndex((option) =>
      option.hasAttribute('aria-current')
    )
    languageOptions[Math.max(current, 0)].focus()
  }
}

function closeMenu(returnFocus = false) {
  languageMenu.classList.remove('show')
  language.setAttribute('aria-expanded', 'false')
  if (returnFocus) language.focus()
}

languageOptions.forEach((option) => {
  option.addEventListener('click', () => {
    setLanguage(option.dataset.language)
    closeMenu(true)
  })
})

language.addEventListener('click', () => {
  if (isMenuOpen()) closeMenu()
  else openMenu()
})

language.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    openMenu(true)
  } else if (event.key === 'Escape' && isMenuOpen()) {
    closeMenu()
  }
})

languageMenu.addEventListener('keydown', (event) => {
  const index = languageOptions.indexOf(document.activeElement)
  const last = languageOptions.length - 1
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      languageOptions[index >= last ? 0 : index + 1].focus()
      break
    case 'ArrowUp':
      event.preventDefault()
      languageOptions[index <= 0 ? last : index - 1].focus()
      break
    case 'Home':
      event.preventDefault()
      languageOptions[0].focus()
      break
    case 'End':
      event.preventDefault()
      languageOptions[last].focus()
      break
    case 'Escape':
      event.preventDefault()
      closeMenu(true)
      break
    case 'Tab':
      closeMenu()
      break
  }
})

document.addEventListener('click', (event) => {
  if (!language.closest('.dropdown').contains(event.target)) closeMenu()
})

// fecha o menu móvel ao escolher uma seção
const mainNav = document.getElementById('mainNav')
document.querySelectorAll('#mainNav .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    if (mainNav.classList.contains('show')) {
      bootstrap.Collapse.getOrCreateInstance(mainNav).hide()
    }
  })
})

// botões dos cartões: "Ver projeto" descrito pelo nome do projeto
document.querySelectorAll('.project-card').forEach((card, index) => {
  const title = card.querySelector('.card-title')
  title.id = `project-title-${index}`
  card.querySelectorAll('a.btn').forEach((link) => {
    link.setAttribute('aria-describedby', title.id)
  })
})

// barra de progresso de leitura
const progress = document.getElementById('scrollProgress')
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const ratio = max > 0 ? window.scrollY / max : 0
  progress.style.transform = `scaleX(${Math.min(1, ratio)})`
}
window.addEventListener('scroll', updateProgress, { passive: true })
window.addEventListener('resize', updateProgress)
updateProgress()

// link ativo conforme a seção visível
const navLinks = document.querySelectorAll('.navbar .nav-link')
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      navLinks.forEach((link) => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        )
      })
    })
  },
  { rootMargin: '-45% 0px -50% 0px' }
)
document
  .querySelectorAll('main section[id]')
  .forEach((section) => sectionObserver.observe(section))

// luz que acompanha o cursor nos cartões
document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    card.style.setProperty('--my', `${event.clientY - rect.top}px`)
  })
})

let savedLanguage = 'pt'
try {
  savedLanguage = localStorage.getItem('portfolio-language') || 'pt'
} catch {
  /* armazenamento indisponível */
}
setLanguage(savedLanguage)
