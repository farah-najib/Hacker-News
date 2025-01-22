import axios from 'axios'


const baseURL = 'https://hn.algolia.com/api/v1/search'
// Create a new axios instance
const instance = axios.create({
	baseURL,
	headers: {
		"Accept": "application/json",
		"Content-Type": "application/json",
	},
	timeout: 10000,
});


export const fetchNews = async <T = any>(query: string, page: number) => {
    const response = await instance.get<T>(``, {
        params: {
            query: encodeURIComponent(query), // Search query
            page // Current page number
        }
    })
    return response.data
}
