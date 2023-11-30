import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40997072-7d01e146641751499ce6c78c3';

async function fetchImages(query, page, perPage) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  const response = await axios.get(
    `${BASE_URL}?${params}&page=${page}&per_page=${perPage}`
  );
  return response.data;
}

export { fetchImages };
