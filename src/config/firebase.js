import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, setDoc, where, query, orderBy } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyDRUoiVGHm1jL1Qe5nsW1yMxr_Z-mYURVQ",
  authDomain: "hassanjs1.firebaseapp.com",
  projectId: "hassanjs1",
  storageBucket: "hassanjs1.appspot.com",
  messagingSenderId: "239234016765",
  appId: "1:239234016765:web:41bc724fffb7a9fa792594",
  measurementId: "G-3MQNXJT62Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();


function loginWithGoogle() {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {

      handleLoginResult(result);
    })
    .catch((error) => {

      handleLoginError(error);
    });
}

function handleLoginResult(result) {

  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;

  const user = result.user;

  alert('Successful login:', user);
  window.location.href = '../index.html'
}

function handleLoginError(error) {

  const errorCode = error.code;
  const errorMessage = error.message;

  const email = error.customData ? error.customData.email : null;

  const credential = GoogleAuthProvider.credentialFromError(error);

  console.error('Login error:', errorCode, errorMessage, email, credential);
}

async function register(user) {
  const { fullname, email, password, phoneNumber } = user
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    await setDoc(doc(db, "users", userCredential.user.uid), {
      fullname,
      email,
      phoneNumber
    });
    alert('Registered Successfully')
    window.location.href = '../../login/login.html'

  } catch (error) {
    alert(`Registration failed. Error: ${error.message}`);
  }
}

function login(user) {
  const { email, password } = user

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      const user = userCredential.user;
      alert('Login Successfully!')

      console.log(user)

      localStorage.setItem('UID', user.uid)

      const userID = localStorage.getItem('UID')

      userID && (window.location.href = '../index.html')
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(`Login failed. Error: ${errorMessage}`);
    });
}

async function postAdToDb(ad) {

  try {
    const storageRef = ref(storage, `ads/${ad.image.name}`);
    await uploadBytes(storageRef, ad.image)
    const url = await getDownloadURL(storageRef)
    ad.image = url
    await addDoc(collection(db, "ads"), ad)
    alert('Posted successfully!')
    window.location.href = '../index.html'
  } catch (e) {
    alert(e.message)
  }
}

async function getAds() {
  const querySnapshot = await getDocs(collection(db, "ads"));
  const ads = []
  querySnapshot.forEach((doc) => {
    const ad = doc.data()
    ad.id = doc.id

    ads.push(ad)
  });
  return ads
}

async function getSingleAd(adId) {
  const docRef = doc(db, "ads", adId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const ad = docSnap.data()

    return ad
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

function logout() {
  return signOut(auth)
}

async function getUser(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const user = docSnap.data()

    return user
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

async function getMyAdsFromDb(uid) {
  const adsRef = collection(db, "ads")
  const querySnapshot = await getDocs(query(adsRef, where("uid", "==", uid)))
  const ads = []
  querySnapshot.forEach((doc) => {
    const ad = doc.data()
    ad.id = doc.id

    ads.push(ad)
  });

  return ads
}

async function searchInAds(inputValue) {
  const adsRef = collection(db, "ads")
  const querySnapshot = await getDocs(query(adsRef, where("title", "==", inputValue)))
  const ads = []
  querySnapshot.forEach((doc) => {
    const ad = doc.data()
    ad.id = doc.id

    ads.push(ad)
  });

  return ads
}

async function sortAds(sortBy) {
  try {
    const adsRef = collection(db, "ads");
    const querySnapshot = await getDocs(query(adsRef, orderBy('amount', sortBy)));
    const ads = [];
    querySnapshot.forEach((doc) => {
      const ad = doc.data();
      ad.id = doc.id;
      ads.push(ad);
    });
    return ads;
  } catch (error) {
    console.error("Error in sortAds:", error);
    return [];
  }
}

async function sortAdsByDate(sortBy) {
  try {
    const adsRef = collection(db, "ads");
    let queryResult;

    if (sortBy === 'desc') {
      // Sort by createdAt in descending order (newest first)
      queryResult = await getDocs(query(adsRef, orderBy('createdAt', 'desc')));
    } else if (sortBy === 'asc') {
      // Sort by createdAt in ascending order (oldest first)
      queryResult = await getDocs(query(adsRef, orderBy('createdAt', 'asc')));
    }

    const ads = [];
    queryResult.forEach((doc) => {
      const ad = doc.data();
      ad.id = doc.id;
      ads.push(ad);
    });

    return ads;
  } catch (error) {
    console.error("Error in sortAdsByDate:", error);
    return [];
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log(user)

    if (location.pathname !== '/index.html') {
      window.location.href = '../index.html';
    }

  } else {

  }
});


export {
  register,
  login,
  postAdToDb,
  auth,
  onAuthStateChanged,
  getAds,
  getSingleAd,
  getAuth,
  logout,
  getUser,
  getMyAdsFromDb,
  searchInAds,
  sortAds,
  sortAdsByDate,
  loginWithGoogle
}
