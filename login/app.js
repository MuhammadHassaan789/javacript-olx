import { login, loginWithGoogle } from '../src/config/firebase.js'



window.onLogin = function () {

    const allInputs = document.getElementsByTagName('input')
    const email = allInputs[0].value
    const password = allInputs[1].value

    const user = { email , password }
    login(user)
}


window.onLoginGoogle = function () {
    loginWithGoogle();
};