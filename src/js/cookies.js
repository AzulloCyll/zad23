function setCookie(name, value) {
  console.log(name, value);
  document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
}
function deleteCookie(name) {
  document.cookie =
    encodeURIComponent(name) + '=; expires=' + new Date().toGMTString();
}

function getCookie(name) {
  var cookies = document.cookie.split(';');
  for (var cookie of cookies) {
    let [n, v] = cookie.trim().split('=');
    if (name == decodeURIComponent(n)) {
      return decodeURIComponent(v);
    }
  }
}

export { setCookie, deleteCookie, getCookie };
