const http = new EasyHTTP;

document.getElementById('sendRequest').addEventListener('click', function(e) {
    http.get('https://jsonplaceholder.typicode.com/users')
    .then(data => console.log(data))
    .catch(err => console.log(err));

    
    http.get('http://localhost:8080/test')
    .then(data => console.log(data))
    .catch(err => console.log(err));
})
