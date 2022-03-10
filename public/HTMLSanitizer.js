var entities = {
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&apos;": "'"
}

function sanitize() {
    var str = this.valueOf();
    Object.entries(entities).forEach(entry => {
        const [key, value] = entry;
        str = str.replace(key, value);
    })
    return str;
}


module.exports = sanitize;