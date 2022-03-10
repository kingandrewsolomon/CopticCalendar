var tzOffset = -new Date().getTimezoneOffset() / 60;
console.log("here");
window.location.replace(`${window.location.href}?tzOffset=${tzOffset}`);