const xhr = new XMLHttpRequest()
    
xhr.open('GET', '/userInfo/1', true)

xhr.onload = function() {
    console.log(xhr.response)
}
xhr.send()
