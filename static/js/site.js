// add footer content into the footer element
const footer = document.getElementById('footer');
footer.innerHTML = `
  <div class="footer-left"><i class="fa-solid fa-rectangle-xmark"></i> No cookies, trackers, ads<br>
    <i class="fa-solid fa-person"></i> Right to freedom<br>
  </div>
  <div class="footer-right">
    <i class="fa-regular fa-circle-user"></i> By <a href="https://philippebraum.com/" class="hover-underline-animation" style="color: blue">Philippe Braum</a><br>
    ${siteVersion}
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