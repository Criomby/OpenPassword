// add footer content into the footer element
const footer = document.getElementById('footer');
footer.innerHTML = `
<div class="footer-left">No trackers or ads<br>
  Right to freedom<br>
</div>
<div class="footer-right">
  By Philippe Braum<br>
  v${siteVersion}
</div>
`;

// buttons

// button "talk to me"
const btnContact = document.getElementById("btn-contact");
if (btnContact != null) {
  btnContact.onclick = function() {
    window.open("https://philippebraum.com/contact");
  }
}

// button "github"
const btnGithub = document.getElementById("btn-github");
if (btnGithub != null) {
  btnGithub.onclick = function() {
    window.open("https://github.com/Criomby/openPassword");
  }
}