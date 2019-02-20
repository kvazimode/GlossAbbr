const GLOSS = [{}];
const ABBR = [{}];

const content = document.querySelector(`.text`);
const contentInner = content.innerHTML;
const viewportHalfX = window.innerWidth / 2;
const viewportHalfY = window.innerHeight / 2;

function addAbbrSpan(toFind, num) {
  let toSearch = new RegExp(`(?:(\\ |\\/^))(${toFind})(?![А-Яа-я]|(-.{4}\\")|\\"|\\»)`, `gm`);
  contentInner = contentInner.replace(toSearch, `$1<span class=\"abbr abbr__${num}\">$2</span>`);
};

function processAbbr() {
  ABBR.forEach((item, index) => {
    let value = item.title;
    if (item.tag) {
      if (item.tag.length > 1) {
        for (let tag of item.tag) {
          addAbbrSpan(tag, index);
        }
      }
      value = item.tag;
    }
    addAbbrSpan(value, index);
  })
  sliceGlosTitle();
}