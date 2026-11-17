// MOCKUP ONLY: show or hide the review notes. Delete for the real site.
(function () {
  var btn = document.querySelector('.mock-toggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var hidden = document.body.classList.toggle('hide-notes');
    btn.textContent = hidden ? 'Show review notes' : 'Hide review notes';
  });
})();
