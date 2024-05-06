const Body = document.body
const { history, location } = window

document.getElementsByClassName("mediawiki")[0].style.border = "5px solid red"

/* ---------------- Disable the search bar and search button ---------------- */
const searchBar = document.getElementsByName("search")[0]
const searchButton = document.getElementsByClassName("cdx-search-input__end-button")[0]
searchBar.disabled = true
searchButton.disabled = true
/* -------------------------------------------------------------------------- */

class Game {
  constructor() {
    this.startTime = sessionStorage.getItem('start-time') || null
    // TODO: Maybe make this a set to prevent duplicates
    this.links = JSON.parse(sessionStorage.getItem('links')) || []
    this.startPage = sessionStorage.getItem('start-page')
    this.endPage = sessionStorage.getItem('end-page')
  }

  start() {
    if (!this.startPage || !this.endPage) {
      this.generateRandomPages()
    }

    // Make the page url the same format as the start page stored in sessionStorage
    const urlParts = location.href.split(".")
    const currentPage = `${urlParts[1]}.${urlParts[2]}` 

    console.log(currentPage)
    if (currentPage === this.startPage) {
      this.startTime = JSON.parse(sessionStorage.getItem('start-time')) || new Date().getTime()
    }

    // ! Add later when you need to click to start the game, otherwise it creates a infinite loop 
    /* wikiWindow.addEventListener('load', function() {
      //The Wikipedia page has finished loading, start the timer 
      this.startTime = JSON.parse(sessionStorage.getItem('start-time')) || new Date().getTime()

      if (!sessionStorage.getItem('start-time')) {
        sessionStorage.setItem('start-time', this.startTime)
      }

      // Perform any other actions you need to do after the page loads
      wikiWindow.removeEventListener('load', this)
    }) */

    console.log(`Timer started at ${this.startTime}`)
  } 

  end() {
    console.log(`Timer ended in: ${new Date() - this.startTime / 1000} seconds.`)
    console.log(`Links clicked: ${history.length}`)
    sessionStorage.removeItem('links')
    sessionStorage.removeItem('start-time')
    return (new Date() - this.startTime / 1000).toFixed(2)
  }

  addLink(link) {
    this.links.push(link)
    sessionStorage.setItem('links', JSON.stringify(this.links))
    // Change browser tab to the link selected, 
    // because the "a" tags have event.preventDefault() 
    location.href = link
  }

  generateRandomPages() {
    this.startPage = sessionStorage.getItem('start-page')
    this.endPage = sessionStorage.getItem('end-page')

    if (this.startPage && this.endPage) return

    // Generate random start and end pages
    fetch("https://en.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0&rnlimit=2")
    .then(response => response.json())
    .then(data => {
      if (!this.startPage) {
        this.startPage = `wikipedia.org/wiki/${data.query.random[0].title.replace(/ /g, "_")}`
        sessionStorage.setItem('start-page', this.startPage)
      }

      if (!this.endPage) {
        this.endPage = `wikipedia.org/wiki/${data.query.random[1].title.replace(/ /g, "_")}`
        sessionStorage.setItem('end-page', this.endPage)
      }

      console.log(`Get from page: ${this.startPage}`)
      console.log(`To WikiPage: ${this.endPage}`)
    })
  }
}

/* ----------------------------- Start the game ----------------------------- */

const newGame = new Game()

function startGame() {
  newGame.start()
}

startGame()

/* ------------------------ Add link event listeners ------------------------ */

const anchorTags = document.getElementsByTagName("a");
for (let i = 0; i < anchorTags.length; i++) {
  anchorTags[i].addEventListener("click", (event) => {
    event.preventDefault()

    // Don't let the users click on external links
    if (event.target.classList.contains("external")) {
      alert("You can't click on external links!")
      return
    }

    // Add the clicked link to the list of links
    newGame.addLink(event.target.href)
  });
}

/* -------------------------------------------------------------------------- */

// TODO: Make a validate function that loops through the links array,
// TODO: and checks if each link to the next page is included in the links array