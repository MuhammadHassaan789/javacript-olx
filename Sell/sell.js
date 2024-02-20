import { postAdToDb, auth } from "../src/config/firebase.js"

window.onPost = function() {
    const uid = auth.currentUser.uid
    const allInputs = document.getElementsByTagName('input')
    const title = allInputs[0].value
    const description = allInputs[1].value
    const amount = +allInputs[2].value
    const image = allInputs[3].files[0]
    const createdAt = new Date();

    const ad = {
        title,
        description,
        amount,
        image,
        uid,
        createdAt
    }
    
    postAdToDb(ad)
}
