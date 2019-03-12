const GLOSS = [{}];
const ABBR = [{
  title: `МВД`,
  description: `министерство внутренних дел жи`
}];

const content = document.querySelector(`.text`);
let contentClone = content.innerHTML;
const viewportHalfX = window.innerWidth / 2;
const viewportHalfY = window.innerHeight / 2;

function addAbbrSpan(toFind, num) {
  let toSearch = new RegExp(`(?:(\\ |\\/^))(${toFind})(?![А-Яа-я]|(-.{4}\\")|\\"|\\»)`, `gm`);
  contentClone = contentClone.replace(toSearch, `$1<span class=\"abbr abbr__${num}\">$2</span>`);
  return contentClone;
};

async function processAbbr() {
  let modifiedContent;
  ABBR.forEach((item, index) => {
    let value = item.title;
    if (item.tag) {
      if (item.tag.length > 1) {
        for (let tag of item.tag) {
          modifiedContent = addAbbrSpan(tag, index);
        }
      }
      value = item.tag;
    }
    modifiedContent = addAbbrSpan(value, index);
  })
  content.innerHTML = modifiedContent;
}

function appendDescription(title, text, evt) {
  const div = document.createElement(`div`);
  div.classList.add(`info`);
  if (title) {
    div.innerHTML = `<p><strong>${title}</strong><br>${text}</p>`;
  } else {
    div.textContent = text;
  }
  div.style.position = `fixed`;
  document.body.appendChild(div);
  let mouseX = evt.clientX;
  let mouseY = evt.clientY;
  if (mouseY >= viewportHalfY && mouseX >= viewportHalfX) {
    div.style.top = mouseY - div.clientHeight - 30 + `px`; // 30 px to move away from pointer
    div.style.left = mouseX - div.clientWidth + `px`;
  } else if (mouseX >= viewportHalfX) {
    div.style.top = (mouseY + 30) + `px`;
    div.style.left = mouseX - div.clientWidth + `px`;
  } else if (mouseY >= viewportHalfY) {
    div.style.top = mouseY - div.clientHeight - 30 + `px`;
    div.style.left = mouseX + `px`;
  } else {
    div.style.top = (mouseX + 30) + `px`;
    div.style.left = mouseX + `px`;
  }
}

function mouseLeaveHandler(evt) {
  evt.preventDefault();
  document.querySelectorAll(`.info`).forEach(item => item.remove());
  evt.currentTarget.removeEventListener(`mouseleave`, mouseLeaveHandler);
}

function mouseEnterHandler(evt, listName) {
  evt.preventDefault();
  const index = evt.currentTarget.className.match(/\d+/g);
  appendDescription(listName[index].title, listName[index].description, evt);
  evt.currentTarget.addEventListener(`mouseleave`, mouseLeaveHandler);
}

function addAbbrListener() {
  const abbrList = document.querySelectorAll(`.abbr`);
  abbrList.forEach(item => {
    item.addEventListener(`mouseenter`, function(evt) {mouseEnterHandler(evt, ABBR)}, true);
  })
}

processAbbr()
addAbbrListener()