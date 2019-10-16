const GLOSS = [{
  title: `текст`,
  description: `набор слов`
}];
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

function addGlosSpan(toFind, num, poly) {
  if (poly) { // if there are n words in glossary term, 
    for (let i = 0; i < 2; i++) { // crop 2 words
      toFind[i] = toFind[i].slice(0, 4).toLowerCase();
    }
    const toSearch = new RegExp(`(?:(\\ |\\/|^))(${toFind[0]})(?:([А-Яа-я]*))([ -])(${toFind[1]})(?:([А-Яа-я]*))`, `gm`);
    contentClone = contentClone.replace(toSearch, `$1<span class=\"glos glos__${num}\">$2$3$4$5$6</span>`)
  } else {
    const firstPart = toFind.slice(0, 4);
    const secondPart = toFind.slice(4, 9);
    const toSearch = new RegExp(`(?:(\\ |\\/|^))(${firstPart})(?:([А-Яа-я]*))`, `gm`);
    contentClone = contentClone.replace(toSearch, (match, g1, g2, g3) => {
      const g31 = g3.slice(0, 5);
      if (g31.search(secondPart) != -1 || !secondPart) {
        return `${g1}<span class=\"glos glos__${num}\">${g2 + g3}</span>`
      } else {
        return match;
      }
    })
  }
  return contentClone;
}

function processAbbr() {
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
  return modifiedContent;
}

function sliceGlosTitle() {
  GLOSS.forEach((item, index) => {
    let sliced = item.title.split(/[ )(-]/g);
    if (sliced.length > 1) {
      sliced.forEach((part, i) => {
        if (part === '') { sliced.splice(i, 1) }
      })
    }
    item.slicedTitle = sliced;
  })
}

function processGlos() {
  sliceGlosTitle();
  let modifiedContent;
  GLOSS.forEach((item, i) => {
    let value = item.slicedTitle[0];
    if (item.slicedTitle.length > 1) {
      value = item.slicedTitle.slice(0, 2)        
      modifiedContent = addGlosSpan(value, i, true);
    } else {
      modifiedContent = addGlosSpan((value).toLowerCase(), i);
    }
  })
  return modifiedContent;
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
  // moves div away from borders
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
    div.style.top = (mouseY + 30) + `px`;
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

function checkRules(node) { // list of cases, when description should not be added
  if (node.tagName === `STRONG` || node.tagName === `TD` || node.parentElement.tagName === `TD` || node.tagName === `B` || node.tagName === `span` || node.tagName === `A` || node.hasAttribute(`alt`) || node.hasAttribute(`title`)) {
    return true;
  } 
  return false;
}

function addAbbrListener() {
  const abbrList = document.querySelectorAll(`.abbr`);
  abbrList.forEach(item => {
    let parent = item.parentElement;
    if (checkRules(parent)) {
      item.removeAttribute(`class`)
    } else {
      item.addEventListener(`mouseenter`, function(evt) {mouseEnterHandler(evt, ABBR)}, true);
    }
  })
}

function addGlosListener() {
  const glosList = document.querySelectorAll(`.glos`);
  glosList.forEach((item, i) => {
    let parent = item.parentElement;
    if (checkRules(parent)) {
      let spanCode = item.outerHTML;
      let spanText = spanCode.replace(/<[^>]*>/gi, '');
      item.outerHTML = spanText;
    } else {
      item.addEventListener(`mouseenter`, function(evt) {mouseEnterHandler(evt, GLOSS)}, true)
    } 
  })
}

contentClone = processAbbr()
contentClone = processGlos()
content.innerHTML = contentClone
addAbbrListener()
addGlosListener()
