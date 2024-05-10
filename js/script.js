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
const catArr = ['category-1', 'category-2'];
const inputOption = document.querySelectorAll('option');
let selectedOption;

// *****************************************
//  FILTR START
// *****************************************

// object start
const filterStateValue = {
  activeCategory: catArr[1],
  activeValueInput: inputOption[2].value,
  activeSlides: [],

  filterState: function () {
    allItems.forEach((s) => {
      if (
        s.classList.contains(this.activeCategory) &&
        s.classList.contains(this.activeValueInput)
      ) {
        s.classList.remove('display-none');
      } else {
        s.classList.add('display-none');
      }
    });
  },

  activeSlidesState: function () {
    this.activeSlides = [];
    allItems.forEach((s) => {
      if (
        s.classList.contains(this.activeCategory) &&
        s.classList.contains(this.activeValueInput)
      ) {
        this.activeSlides.push(s);
      }
      if (this.activeValueInput === 'all' && this.activeCategory === '') {
        this.activeSlides = [...allItems];
      }
      if (
        this.activeValueInput === 'all' &&
        s.classList.contains(this.activeCategory)
      ) {
        this.activeSlides.push(s);
      }
      //
      if (
        s.classList.contains(this.activeValueInput) &&
        this.activeCategory === ''
      ) {
        this.activeSlides.push(s);
      }
    });
  },

  activeSlidePosition: function () {
    this.activeSlides.forEach((s, index) => {
      s.classList.remove('display-none');
      if (index === 0) {
        s.style.transform = `translateX(${index}%)`;
      }
      if (index !== 0) {
        s.style.transform = `translateX(${index * 100}%)`;
      }
    });
  },

  resetPrevStateSlider: function () {
    allItems.forEach((s) => {
      if (s.classList.contains('display-none')) {
        s.style.transform = '';
      }
    });
  },

  activeCategoryStyle: function () {
    allCategorys.forEach((c) => {
      c.classList.contains(`${this.activeCategory}`)
        ? c.classList.add('category-item__On-Click')
        : c.classList.remove('category-item__On-Click');
    });
  },

  activeInputValueState: function () {
    selectElement.value = this.activeValueInput;
  },
};
// object end

const sliderFuncPack = () => {
  filterStateValue.filterState();
  filterStateValue.activeCategoryStyle();
  filterStateValue.activeSlidesState();
  filterStateValue.activeSlidePosition();
  filterStateValue.activeCategoryStyle();
  filterStateValue.resetPrevStateSlider();
  filterStateValue.activeInputValueState();
};

sliderFuncPack();

const inPutSelect = function () {
  selectElement.addEventListener('change', (e) => {
    selectedOption = e.target.value;
    if (selectedOption === 'all') {
      filterStateValue.activeCategory = '';
      filterStateValue.activeValueInput = '';
      filterStateValue.activeValueInput = selectedOption;

      allCategorys.forEach((c) => {
        c.classList.remove('category-item__On-Click');
      });
    }
    if (
      selectedOption !== 'all' &&
      selectedOption !== filterStateValue.activeValueInput
    ) {
      filterStateValue.activeValueInput = selectedOption;
    }
    sliderFuncPack();
    creatDotsForActiveSlides(filterStateValue.activeSlides);
    activateCurrentDot(0);
    moveSlideByDrag(filterStateValue.activeSlides);
  });
};

inPutSelect();

const clickedCategory = () => {
  allCategorys.forEach((c) => {
    c.addEventListener('click', () => {
      catArr.map((catKey) => {
        if (c.classList.contains(`${catKey}`)) {
          c.classList.add('category-item__On-Click');
          catKey === filterStateValue.activeCategory
            ? filterStateValue.activeCategory
            : (filterStateValue.activeCategory = catKey);
        }
      });
      sliderFuncPack();
      creatDotsForActiveSlides(filterStateValue.activeSlides);
      activateCurrentDot(0);
      moveSlideByDrag(filterStateValue.activeSlides);
    });
  });
};

clickedCategory();

// *****************************************
//  KONIEC FILTRA
// *****************************************

// *****************************************
//  SLIDER
// *****************************************

const creatDotsForActiveSlides = function () {
  dotContainer.innerHTML = ' ';
  filterStateValue.activeSlides.forEach(function (_, index) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
};

creatDotsForActiveSlides();

const activateCurrentDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach((dot) => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide ="${slide}"]`)
    .classList.add('dots__dot--active');
};

activateCurrentDot(0);

const moveToSlide = function (slide) {
  filterStateValue.activeSlides.forEach((s, index) => {
    s.style.transform = `translateX(${(index - slide) * 100}%)`;
  });
};

moveToSlide(0);

const nextSlide = function () {
  if (currentSlide === filterStateValue.activeSlides.length - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};

const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = filterStateValue.activeSlides.length - 1;
  } else {
    currentSlide--;
  }
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', previousSlide);

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
  filterStateValue.activeSlides.forEach((slide, index) => {
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
    filterStateValue.activeSlides.forEach((s) => {
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
  filterStateValue.activeSlides.forEach((s) => {
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
