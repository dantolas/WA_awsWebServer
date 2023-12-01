import crypto from "crypto";

export const hashPassword = function(password){
    return crypto.pbkdf2Sync(password, '0x00', 1000, 64, "sha512").toString("hex");
}

export const validatePassword = function(password,hash){
    return hashPassword(password).trim === hash.trim 
}