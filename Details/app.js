import { auth, onAuthStateChanged, getUser } from "../src/config/firebase.js";
import { logout } from '../src/config/firebase.js'

onAuthStateChanged(auth, (user) => {
  if (user) {
    const emailElement = document.getElementById('email')
    emailElement.innerHTML = user.email
  } else {
    location.href = '../login/login.html'
  }
});


 import { getSingleAd } from '../src/config/firebase.js'

 async function getAdDetail() {
  const adId = location.search.slice(6);

  const ad = await getSingleAd(adId);
  const user = await getUser(ad.uid)
  console.log('user', user)

  const container = document.getElementById('cantainer');

  const card = document.createElement('div');
  card.className = 'first-card'; 

  const img = document.createElement('img');
  img.src = ad.image;
  img.alt = 'Product Image';
  img.className = 'product-img'
  img.style.width = '300px';
  img.style.height = '319px';

  const cardContent = document.createElement('div');
  cardContent.className = 'card-content';

  const title = document.createElement('h2');
  title.innerHTML = ad.title;

  const amount = document.createElement('h5'); // Use an appropriate tag for the amount
  amount.innerHTML = `Price: Rs. ${ad.amount}`;

  const description = document.createElement('p');
  description.innerHTML = ad.description;

  const contact = document.createElement('h3')
  contact.innerHTML = 'Contact Information:'

  const username = document.createElement('h4')
  username.innerHTML = user.fullname

  const phoneNumber = document.createElement('h6')
  phoneNumber.innerHTML = user.phoneNumber

  cardContent.append(title);
  cardContent.append(amount);
  cardContent.append(description);
  cardContent.append(contact);
  cardContent.append(username);
  cardContent.append(phoneNumber);


  card.append(img);
  card.append(cardContent);

  container.append(card);
}


getAdDetail();

window.signout = function() {
  logout()
}
