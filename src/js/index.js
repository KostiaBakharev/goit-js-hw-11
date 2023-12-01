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
  btn: document.querySelector('.load-more'),
};
const { form, gallery, btn } = refs;

let query = '';
let page = 1;
const perPage = 40;

form.addEventListener('submit', onSubmit);
//

function createMarkup(images) {
  if (!gallery) {
    return;
  }

  const markup = images
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
      return `
      <a class="gallery__link" href="${largeImageURL}">
      <div class="photo-card">
        <img class="gallery__image" src="${webformatURL}" alt="${tags}" width="440" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes: </b>${likes}</p>
          <p class="info-item"><b>Views: </b>${views}</p>
          <p class="info-item"><b>Comments: </b>${comments}</p>
          <p class="info-item"><b>Downloads: </b>${downloads}</p>
        </div>
        </div>
      </a>`;
    })
    .join('');

  // gallery.innerHTML = markup;
  gallery.insertAdjacentHTML('beforeend', markup);
  // lightbox.refresh();
}
//
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
        createMarkup(data.hits);
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
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

// s

//
// Прокручування сторінки
// function scrollToGallery() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
// btn.addEventListener('click', loadMoreImg);

function loadMoreImg() {
  page += 1;
  // lightbox.destroy();

  fetchImages(query, page, perPage)
    .then(data => {
      createMarkup(data.hits);
      lightbox.refresh();

      const totalPages = Math.random(totalHits / perPage);

      gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
      if (page > totalPages) {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        // btn.removeEventListener('click', loadMoreImg);
        // window.removeEventListener('scroll', showLoadMorePage);
        // lightbox.refresh();
      }
    })
    .catch(error => {
      console.error('Error fetching images:', error);
    });
}
function checkIfEndOfPage() {
  return (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
  );
}
function showLoadMorePage() {
  if (checkIfEndOfPage()) {
    loadMoreImg();
  }
}
window.addEventListener('scroll', showLoadMorePage);
