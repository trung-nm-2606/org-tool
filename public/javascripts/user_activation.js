((w) => {
  const el = w.document.getElementById('renew-user-activation');
  el.addEventListener('click', (e) => {
    e.preventDefault();
    location.href = `/users/renew-activation${location.search}`
  });
})(window);
