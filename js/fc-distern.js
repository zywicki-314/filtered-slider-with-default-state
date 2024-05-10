const slider = document.querySelector('div.slider');
const slidesColection = document.querySelector('div.slides-wrapper');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
let currentSlide = 0;

// ==============================================

const selectElement = document.getElementById('kat-prod');
const allItems = document.querySelectorAll('div.slide');
const allCategorys = document.querySelectorAll('div.category-item');
const boxOfCategorys = document.querySelector('div.cat-filteredCat');
const catArr = ['matchday', 'everyday'];
// const catArr = ['category-1', 'category-2']
//let activeSlides = [...allItems]; mod
const inputOption = document.querySelectorAll('option');
let activeSlides = [];

//
let testActiveSlides = [];
let ostatniPoziomFiltracjiFoto = [];
let SETostatniPoziomFiltracjiFoto = [];
let odfiltrowaneKlucze = [];
let aktywneKlucze = [];
let SETwidoczneKategorie = [];
let widoczneKategorie = [...allCategorys];

//

// Dodanie-kasowanie klasy 'display-none' ze wszystkich slidów

const hideAllSlides = function () {
  allItems.forEach((i) => {
    i.classList.add('display-none');
    //  mod
    i.style = '';
  });
};

const showAllSlides = function () {
  allItems.forEach((i) => {
    i.classList.remove('display-none');
  });
};

const showActiveSlides = function () {
  activeSlides.forEach((s) => {
    s.classList.remove('display-none');
  });
};

const hideAllActiveCategories = function () {
  allCategorys.forEach((c) => {
    c.classList.remove('category-item__On-Click');
  });
};

let activeCategory;

const defaultCategory = function () {
  activeCategory = allCategorys[0];
  activeCategory.classList.add('category-item__On-Click');
};

const defaultInputOption = function () {
  selectElement.value = inputOption[2].value;
};
const defaultActiveSlides = function () {
  allItems.forEach((s) => {
    s.classList.contains(`${selectElement.value}`) &&
    s.classList.contains(`${catArr[0]}`)
      ? activeSlides.push(s)
      : s;
  });
  return activeSlides;
};

const defaultOptions = function () {
  defaultInputOption();
  defaultCategory();
  hideAllSlides();
  defaultActiveSlides();
  showActiveSlides();
};
defaultOptions();

const inPutSelect = function () {
  selectElement.addEventListener('change', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const selectedOption = event.target.value;
    testActiveSlides = [];
    hideAllActiveCategories();
    pierwszyEtapFiltracji(selectedOption);
    filtracjaPoWybraniuKategorii();
    wubranyInPutWszystko(selectedOption);
    creatDotsForActiveSlides(activeSlides);
    activateCurrentDot(currentSlide);
    moveSlideByDrag(activeSlides);
  });
};

inPutSelect();

const pierwszyEtapFiltracji = function (selectedOption) {
  SETostatniPoziomFiltracjiFoto = [];
  testActiveSlides = [];
  activeSlides = [];
  showAllSlides();
  hideAllSlides();
  currentSlide = 0;
  defaultCategory();
  allItems.forEach((i) => {
    if (i.classList.contains(`${selectedOption}`)) {
      catArr.forEach((c) => {
        if (
          activeCategory.classList.contains(`${c}`) &&
          i.classList.contains(`${c}`)
        ) {
          i.classList.remove('display-none');
          testActiveSlides.push(i);
          filtracjaKategoriiPoInpucie();
        }
      });
    }
    activeSlides = testActiveSlides;
    startFromFirstSlide(currentSlide);
    activateCurrentDot(currentSlide);
    return ostatniPoziomFiltracjiFoto;
  });
};

const filtracjaKategoriiPoInpucie = function () {
  odfiltrowaneKlucze = [];
  SETwidoczneKategorie = [];
  widoczneKategorie = [];
  allCategorys.forEach((c) => {
    catArr.forEach((el) => {
      activeSlides.forEach((ti) => {
        if (ti.classList.contains(`${el}`)) {
          odfiltrowaneKlucze.push(el);
          SETostatniPoziomFiltracjiFoto.push(ti);
          ostatniPoziomFiltracjiFoto = [
            ...new Set(SETostatniPoziomFiltracjiFoto),
          ];
        }
      });
    });
    aktywneKlucze = [...new Set(odfiltrowaneKlucze)];
    aktywneKlucze.forEach((elem) => {
      if (c.classList.contains(`${elem}`)) {
        c.classList.remove('display-none');
        SETwidoczneKategorie.push(c);
      }
    });
    widoczneKategorie = [...new Set(SETwidoczneKategorie)];
  });
};

const filtracjaPoWybraniuKategorii = function () {
  widoczneKategorie.forEach((c) => {
    c.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      hideAllSlides();
      hideAllActiveCategories();
      c.classList.add('category-item__On-Click');
      wybranaGrupaFoto = [];
      activeSlides = [];
      currentSlide = 0;
      aktywneKlucze.forEach((activeC) => {
        if (c.classList.contains(`${activeC}`)) {
          ostatniPoziomFiltracjiFoto.forEach((f) => {
            f.classList.add('display-none');
            if (f.classList.contains(`${activeC}`)) {
              f.classList.remove('display-none');
              activeSlides.push(f);
            }
          });
        }
      });
      creatDotsForActiveSlides(activeSlides);
      activateCurrentDot(currentSlide);
      startFromFirstSlide(currentSlide);
      return currentSlide;
    });
  });
};

const wubranyInPutWszystko = function (selectedOption) {
  if (selectedOption === 'all') {
    activeSlides = [...allItems];
    showActiveSlides();
    document.querySelectorAll('div.category-item').forEach((c) => {
      c.classList.remove('display-none');
      c.classList.remove('category-item__On-Click');
    });
    creatDotsForActiveSlides(activeSlides);
    startFromFirstSlide();
    clickNaKategorie();
    return activeSlides;
  }
};

const clickNaKategorie = function () {
  allCategorys.forEach((c) => {
    c.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      activeCategory = c;
      activatedCategory(c);
    });
  });
  return activeCategory;
};
clickNaKategorie();

const activatedCategory = (c) => {
  currentSlide = 0;
  activeSlides = [];
  aktywneKlucze = [];
  hideAllActiveCategories();
  c.classList.add('category-item__On-Click');
  hideAllSlides();
  catArr.forEach((key) => {
    if (c.classList.contains(`${key}`)) {
      aktywneKlucze.push(key);
    }
  });
  allItems.forEach((i) => {
    if (
      i.classList.contains(`${[...aktywneKlucze]}`) &&
      i.classList.contains(`${selectElement.value}`)
    ) {
      activeSlides.push(i);
    }
  });
  showActiveSlides();
  startFromFirstSlide(activeSlides);
  creatDotsForActiveSlides(activeSlides);
};

// *****************************************

// *****************************************
//  KONIEC FILTRA
// *****************************************

// *****************************************
//  SLIDER
// *****************************************

const removeDotActiveFromAll = function () {
  document
    .querySelectorAll('.dots__dot')
    .forEach((dot) => dot.classList.remove('dots__dot--active'));
};

const addDotActiveForCurrentDot = function (index) {
  document
    .querySelector(`.dots__dot[data-slide ="${index}"]`)
    .classList.add('dots__dot--active');
};

const creatDotsForActiveSlides = function () {
  dotContainer.innerHTML = ' ';
  activeSlides.forEach(function (_, index) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
  addDotActiveForCurrentDot(currentSlide);
};

creatDotsForActiveSlides();

const activateCurrentDot = function (currentSlide) {
  if (currentSlide >= 0) {
    removeDotActiveFromAll();
    addDotActiveForCurrentDot(currentSlide);
  } else {
    dotContainer.innerHTML = ' ';
  }
};

const startFromFirstSlide = function () {
  activeSlides.forEach((s, index) => {
    // mod start
    // if (s.style.transform === `translateX(0%)`) {
    //   s.style.transform = `translateX(${index * 100}%)`;
    // }
    // if (index === 0) {
    //   s.style.transform = `translateX(${index}%)`;
    // }
    index === 0
      ? (s.style.transform = `translateX(${index}%)`)
      : (s.style.transform = `translateX(${index * 100}%)`);
    //   mod end
  });
};

const moveToSlide = function (slide) {
  activeSlides.forEach((s, index) => {
    s.style.transform = `translateX(${(index - slide) * 100}%)`;
  });
};

const nextSlide = function () {
  if (currentSlide === activeSlides.length - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};

const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = activeSlides.length - 1;
  } else {
    currentSlide--;
  }
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};

moveToSlide(0);

btnRight.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  nextSlide();
});

btnLeft.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  previousSlide();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') previousSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    moveToSlide(slide);
    activateCurrentDot(slide);
  }
});

// ***********************************************************
// Touch&Drag Slides
// ***********************************************************

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;
let currentIndex = 0;

const moveSlideByDrag = function () {
  activeSlides.forEach((slide, index) => {
    // const slideImage = slide.querySelector('img');
    // disable default image drag
    // slideImage.addEventListener('dragstart', (e) => e.preventDefault());
    slide.addEventListener('dragstart', (e) => e.preventDefault());
    if (slide[index] === slide[currentSlide]) {
      // touch events
      slide.addEventListener('touchstart', touchStart(currentSlide));
      slide.addEventListener('touchend', touchEnd);
      slide.addEventListener('touchmove', touchMove);
      // mouse events
      slide.addEventListener('mousedown', touchStart(currentSlide));
      slide.addEventListener('mouseup', touchEnd);
      slide.addEventListener('mousemove', touchMove);
      slide.addEventListener('mouseleave', touchEnd);
    }
  });
};

moveSlideByDrag();

// make responsive to viewport changes
window.addEventListener('resize', setPositionByIndex);
// prevent menu popup on long press
window.oncontextmenu = function (event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

// -------------------------------------

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function touchStart(index) {
  return function (event) {
    currentIndex = index;
    startPos = getPositionX(event);
    isDragging = true;
    animationID = requestAnimationFrame(animation);
    activeSlides.forEach((s) => {
      s.classList.add('grabbing');
    });
  };
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function touchEnd() {
  cancelAnimationFrame(animationID);
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;
  // if moved enough negative then snap to next slide if there is one
  if (movedBy < -100) {
    nextSlide();
    currentIndex += 1;
  }
  // if moved enough positive then snap to previous slide if there is one
  if (movedBy > 100) {
    previousSlide();
    currentIndex -= 1;
  }
  setPositionByIndex();
  // slidesColection.classList.remove('grabbing')
  activeSlides.forEach((s) => {
    s.classList.remove('grabbing');
  });
}

function animation() {
  touchEnd();
  if (isDragging) requestAnimationFrame(animation);
}

function animation() {
  //   setSliderPosition()
  if (isDragging) requestAnimationFrame(animation);
}

function setPositionByIndex() {
  currentTranslate = currentIndex * 100;
  prevTranslate = currentTranslate;
  // setSliderPosition()
}

// function setSliderPosition() {
//     // slidesColection.style.transform = `translateX(${currentTranslate}%)`
//     allCategorys.style.transform = `translateX(${currentTranslate}%)`
// }
