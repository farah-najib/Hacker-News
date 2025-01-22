import { fetchNews } from './api'
import type { NewsItem } from './api.types'
import './assets/scss/styles.scss'

const searchQueryInput = document.getElementById(
    'search-query'
) as HTMLInputElement
const searchButton = document.getElementById(
    'search-button'
) as HTMLButtonElement
const sortBySelect = document.getElementById('sort-by') as HTMLSelectElement
const newsList = document.getElementById('news-list') as HTMLDivElement
const currentPageSpan = document.getElementById(
    'current-page'
) as HTMLSpanElement
const prevButton = document.getElementById('prev-button') as HTMLButtonElement
const nextButton = document.getElementById('next-button') as HTMLButtonElement

let currentPage = 0
let currentQuery = '...'
let currentSort = "time";  // Default sort by time

const renderNewsItems = (items: NewsItem[]) => {
    newsList.innerHTML = ''
    items.forEach((item) => {
        const newsItemDiv = document.createElement('div')
        newsItemDiv.classList.add('news-item')
        newsItemDiv.innerHTML = `
            <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
            <p>Score: ${item.points} | By: ${item.author} | ${new Date(
            item.created_at
        ).toLocaleString()}</p>
        `
        newsList.appendChild(newsItemDiv)
    })
}


const loadNews = async () => {
    const response = await fetchNews(currentQuery, currentPage)
    if (response) {
        renderNewsItems(response.hits)
        const sortedItems = sortNews(response.hits, currentSort)
         renderNewsItems(sortedItems)
        currentPageSpan.textContent = `Page ${currentPage + 1}`
        prevButton.disabled = currentPage === 0
        nextButton.disabled = currentPage >= response.nbPages - 1
    }
}


const handleSearch = () => {
    currentQuery = searchQueryInput.value
    currentPage = 0
    loadNews()

}

const sortNews = (items: NewsItem[], sortBy: string): NewsItem[] => {
    if (sortBy === "points") {

        return items.sort((a, b) => b.points - a.points);
    } else {

        return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
};


const handleSortChange = () => {
    currentSort = sortBySelect.value;
    loadNews(); 
};

const handlePagination = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 0) {
        currentPage--
    } else if (direction === 'next') {
        currentPage++
    }
    loadNews()
}



const loadDefaultNews = () => {
    currentQuery = '...'
    loadNews()
}


searchButton.addEventListener('click', handleSearch)
sortBySelect.addEventListener('change', handleSortChange)
prevButton.addEventListener('click', () => handlePagination('prev'))
nextButton.addEventListener('click', () => handlePagination('next'))
window.addEventListener('load', loadDefaultNews)
