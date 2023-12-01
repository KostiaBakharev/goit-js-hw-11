import { fetchImages } from './fetchImages';
import '../sass/styles.css';
import { Notify } from 'notiflix';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};
const { form, gallery } = refs;
const btn = document.querySelector('.load-more');
let query = '';
let page = 1;
const perPage = 40;

form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  page = 1;
  query = evt.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (query === '') {
    Notify.failure('Please enter your search!');
    return;
  }

  fetchImages(query, page, perPage)
    .then(data => {
      if (data.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        createMarkup(data.hits);
        // scrollToGallery();
        lightbox.refresh();
      }
      if (data.totalHits > perPage) {
        window.addEventListener('scroll', scrollToGallery);
      }
    })
    .catch(error => {
      console.error('Error fetching images:', error);
    })
    .finally(() => form.reset());
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function createMarkup(array) {
  // if (!gallery) {
  //   return;
  // }

  const markup = array
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `<div class="gallery__item"
      <a class="gallery__link" href="${largeImageURL}">
      <img class="gallery__image" src="${webformatURL}" alt="${tags}" width="300" loading="lazy" />
      
      <div class="info">
      <p class="info-item"><b>Likes: </b>${likes}</p>
      <p class="info-item"><b>Views: </b>${views}</p>
      <p class="info-item"><b>Comments: </b>${comments}</p>
      <p class="info-item"><b>Downloads: </b>${downloads}</p>
      </div></div> 
      </a>
      `;
    })
    .join('');

  gallery.innerHTML = markup;
  lightbox.refresh();
}

// s

//
// Прокручування сторінки
function scrollToGallery() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
btn.addEventListener('click', loadMoreImg);

function loadMoreImg() {
  page += 1;
  // lightbox.destroy();
  fetchImages()
    .then(data => {
      createMarkup(data.hits);
      lightbox.refresh();

      const totalPages = Math.round(data.totalHits / perPage);

      gallery.insertAdjacentHTML('beforeend', createMarkup);
      if (page > totalPages) {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        // lightbox.refresh();
      }
    })
    .catch(error => {
      console.error('Error fetching images:', error);
    });
}
// function checkIfEndOfPage() {
//   return (
//     window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
//   );
// }
function showLoadMorePage() {
  if (checkIfEndOfPage()) {
    loadMoreImg();
  }
}
// window.addEventListener('scroll', showLoadMorePage);
