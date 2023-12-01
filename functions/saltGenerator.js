// This is not an industry
// standard best practice salt generator, I made this for
// shits and giggles, but it should still improve security

const SPECIAL_CHARACTERS = ['~!@#$%^&*_-+=`|\(){}[]:;"\'<>,.?/'];

export const  _getRandomInt = function(max){
    return Math.floor(Math.random() * max);
}

export const  generateSalt = function (username,email){
    let salt = "";
    
    salt += SPECIAL_CHARACTERS[_getRandomInt(SPECIAL_CHARACTERS.length)];
    salt += SPECIAL_CHARACTERS[_getRandomInt(SPECIAL_CHARACTERS.length)];
    salt += SPECIAL_CHARACTERS[_getRandomInt(SPECIAL_CHARACTERS.length)];

    salt += username[_getRandomInt(username.length)];
    salt += username[_getRandomInt(username.length)];
    salt += username[_getRandomInt(username.length)];

    salt += email[_getRandomInt(email.length)];
    salt += email[_getRandomInt(email.length)];
    salt += email[_getRandomInt(email.length)];

    return salt
}