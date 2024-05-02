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
    this.links = JSON.parse(localStorage.getItem('links')) || []
  }

  start() {
    const wikiWindow = window.open("https://en.wikipedia.org/wiki/Special:Random")

    wikiWindow.addEventListener('load', function() {
      // The Wikipedia page has finished loading, start the timer
      this.time = new Date()
      console.log(`Timer started at ${time}`)
      // Perform any other actions you need to do after the page loads
      wikiWindow.removeEventListener('load', this)
    })

    console.log(`Timer started at ${this.time}`)
  } 

  end() {
    console.log(`Timer ended in: ${new Date() - this.time / 1000} seconds.`)
    console.log(`Links clicked: ${history.length}`)
    localStorage.removeItem('links')
    return (new Date() - this.time / 1000).toFixed(2)
  }

  addLink(event) {
    this.links.push(event.target.href)
    localStorage.setItem('links', JSON.stringify(this.links))
    location.href = event.target.href
  }
}

const newGame = new Game()

// newGame.start()
// newGame.addLink()

/* ------------------------ Add link event listeners ------------------------ */

const anchorTags = document.getElementsByTagName("a");
for (let i = 0; i < anchorTags.length; i++) {
  anchorTags[i].addEventListener("click", (event) => {
    event.preventDefault()
    newGame.addLink(event)
    console.log("Link clicked:", anchorTags[i].href);
  });
}