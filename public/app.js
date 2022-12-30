const http = new EasyHTTP;

document.getElementById('sendRequest').addEventListener('click', function(e) {
    const requestEndpoint = document.getElementById("textField").value

    if (requestEndpoint != "") {
        http.get(requestEndpoint)
        .then(data => console.log(data))
        .catch(err => console.log(err));
    } else {
        alert("Cannot send empty request")
    }

})
