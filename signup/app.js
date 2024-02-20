import { register }  from '../src/config/firebase.js'


window.onSignup = function () {
    const allInputs = document.getElementsByTagName('input')
    const fullname = allInputs[0]
    const email = allInputs[1]
    const password = allInputs[2]
    const confirmPassword = allInputs[3]
    const phoneNumber = allInputs[4]

    const user = {
        fullname,
        email,
        password,
        phoneNumber,

    }

    register(user)
        
}
