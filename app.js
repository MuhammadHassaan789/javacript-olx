import { auth, onAuthStateChanged } from "./src/config/firebase.js";
import { getAds, logout, searchInAds, sortAds, sortAdsByDate } from './src/config/firebase.js'

onAuthStateChanged(auth, (user) => {
  if (user) {
    const emailElement = document.getElementById('email')
    emailElement.innerHTML = user.email
    renderAds()
  } else {
  }
});


window.search = async function () {
  const inputValue = document.getElementById('search-input').value
  if (!inputValue) {
      renderAds()
  } else {
      const ads = await searchInAds(inputValue)
      renderAdItems(ads)
  }

}

async function renderAds() {
  const ads = await getAds();

  renderAdItems(ads)

}



async function renderAdItems(ads) {
  const container = document.getElementById('container');
  container.innerHTML = ''

  for (var i = 0; i < ads.length; i++) {
    const ad = ads[i];

    const card = document.createElement('div');
    card.className = 'card';
    card.style = 'width: 18rem;';

    card.onclick = function () {
      location.href = './Details/index.html?adId=' + ad.id;
    };

    const img = document.createElement('img');
    img.className = 'card-img-top';
    img.src = ad.image;
    img.alt = 'Card Image';

    const titleCard = document.createElement('div');
    titleCard.className = 'card-body';

    const title = document.createElement('h5');
    title.className = 'card-title';
    title.innerHTML = ad.title;

    const amount = document.createElement('p');
    amount.className = 'card-text';
    amount.innerHTML = `Rs. ${ad.amount}`;

    titleCard.append(title);
    titleCard.append(amount);

    card.append(img);
    card.append(titleCard);

    container.append(card);
  }
}

window.sort = async function (event) {
  const sortBy = event.target.value

  if (!sortBy) {
      renderAds()
  } else {
      const ads = await sortAds(sortBy)
      renderAdItems(ads)
  }
}

window.sortDate = async function (event) {
  const sortBy = event.target.value;

  if (!sortBy) {
      renderAds();
  } else {
      const ads = await sortAdsByDate(sortBy);
      renderAdItems(ads);
  }
}


window.myAds = function () {
  location.href = '../myAds/myAds.html'
}

window.signout = function() {
  logout()
}
