import { auth, onAuthStateChanged, getMyAdsFromDb } from "../src/config/firebase.js";
import { logout } from '../src/config/firebase.js'


onAuthStateChanged(auth, (user) => {
  
  if (user) {
    const emailElement = document.getElementById('email')
    emailElement.innerHTML = user.email
    getMyAds()
  } else {
    location.href = '../login/login.html'
  }
});

async function getMyAds() {
  const uid = auth.currentUser.uid;
  console.log('uid', uid);
  const container = document.getElementById('container');

  const ads = await getMyAdsFromDb(uid);

  for (let i = 0; i < ads.length; i++) {
    const ad = ads[i];

    const card = document.createElement('div');
    card.className = 'card';
    card.style = 'width: 18rem;'; // Set the width inline to match the static card

    const img = document.createElement('img');
    img.src = ad.image;
    img.className = 'card-img-top';
    img.alt = '...';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const title = document.createElement('h5');
    title.className = 'card-title';
    title.innerHTML = ad.title;

    const text = document.createElement('p');
    text.className = 'card-text';
    text.innerHTML = `Rs. ${ad.amount}`;

    card.onclick = function () {
      location.href = '../Details/index.html?adId=' + ad.id;
    };

    cardBody.append(title);
    cardBody.append(text);

    card.append(img);
    card.append(cardBody);

    container.append(card);
  }
}






window.signout = function() {
    logout()
  }
  