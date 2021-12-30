function createCode(len){
    var code = ''
    let chars = 'aABbCcdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ'
    for(var i = 0; i <= chars.length; i++){
        c = chars[Math.floor(Math.random() * chars.length)]
        code += c;
    }
    return code.substring(0, len);
}

module.exports = createCode