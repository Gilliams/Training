class Carrousel {
  /**
   * @param  {HTMLElement} element
   * @param  {Object} [option.slidesToScroll=1] Nombre d'éléments à faire défiler
   * @param  {Object} [option.slidesVisible=1] Nombre d'éléments visible dans un slide
   * @param  {boolean} [option.loop=false] Doit on boucler en fin de carrousel
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign(
      {},
      {
        slidesToScroll: 1,
        slidesVisible: 1,
        loop: false,
      },
      options
    );

    let children = [].slice.call(element.children);
    this.isMobile = true;
    this.currentItem = 0;
    this.moveCallbacks = [];

    // Modification du DOM
    this.root = this.createDivWithClass("carrousel");
    this.container = this.createDivWithClass("carrousel__container");
    this.root.setAttribute("tabindex", "0");
    this.root.appendChild(this.container);
    this.element.appendChild(this.root);

    // Manipulation du DOM
    this.items = children.map((child) => {
      let item = this.createDivWithClass("carrousel__item");
      item.appendChild(child);
      this.container.appendChild(item);
      return item;
    });
    this.setStyle();
    this.createNavigation();

    // Evenements
    this.moveCallbacks.forEach((cb) => cb(0));
    this.onWindowResize();
    window.addEventListener("resize", this.onWindowResize.bind(this));
    this.root.addEventListener("keyup", (e) => {
      if (e.key === "ArrowRight" || e.key === "Right") {
        this.next();
      } else if (e.key === "ArrowLeft" || e.key === "Left") {
        this.prev();
      }
    });
  }
  /**
   * Applique les bonnes dimensions aux éléments du carrousel
   */

  setStyle() {
    let ratio = this.items.length / this.slidesVisible;
    this.container.style.width = ratio * 100 + "%";
    this.items.forEach(
      (item) => (item.style.width = 100 / this.slidesVisible / ratio + "%")
    );
  }

  createNavigation() {
    let nextButton = this.createDivWithClass("carrousel__next");
    let prevButton = this.createDivWithClass("carrousel__prev");

    this.root.appendChild(nextButton);
    this.root.appendChild(prevButton);

    nextButton.addEventListener("click", this.next.bind(this));
    prevButton.addEventListener("click", this.prev.bind(this));

    this.onMove((index) => {
      if (this.options.loop === true) {
        return;
      }
      if (index === 0) {
        prevButton.classList.add("carrousel__prev--hiden");
      } else {
        prevButton.classList.remove("carrousel__prev--hiden");
      }
      if (this.items[this.currentItem + this.slidesVisible] === undefined) {
        nextButton.classList.add("carrousel__next--hiden");
      } else {
        nextButton.classList.remove("carrousel__next--hiden");
      }
    });
  }

  next() {
    this.goToItem(this.currentItem + this.slidesToScroll);
  }

  prev() {
    this.goToItem(this.currentItem - this.slidesToScroll);
  }

  /**
   * Déplace le carrousel vers l'élément ciblé
   * @param  {number} index
   */
  goToItem(index) {
    if (index < 0) {
      if (this.options.loop) {
        index = this.items.length - this.options.slidesVisible;
      } else {
        return;
      }
    } else if (
      index >= this.items.length ||
      (this.items[this.currentItem + this.options.slidesVisible] ===
        undefined &&
        index > this.currentItem)
    ) {
      if (this.options.loop) {
        index = 0;
      } else {
        return;
      }
    }

    let translateX = (index * -100) / this.items.length;
    this.container.style.transform = "translate3d(" + translateX + "%, 0,0)";
    this.currentItem = index;
    this.moveCallbacks.forEach((cb) => cb(index));
  }

  onMove(cb) {
    this.moveCallbacks.push(cb);
  }

  onWindowResize() {
    let mobile = window.innerWidth < 800;
    if (mobile !== this.isMobile) {
      this.isMobile = mobile;
      this.setStyle();
      this.moveCallbacks.forEach((callback) => callback(this.currentItem));
    }
  }

  /**
   * @param  {String} className
   * @returns {HTMLElement}
   */
  createDivWithClass(className) {
    let div = document.createElement("div");
    div.setAttribute("class", className);
    return div;
  }

  get slidesToScroll() {
    return this.isMobile ? 1 : this.options.slidesToScroll;
  }
  get slidesVisible() {
    return this.isMobile ? 1 : this.options.slidesVisible;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new Carrousel(document.querySelector("#carrousel1"), {
    slidesVisible: 3,
    loop: false,
  });
  new Carrousel(document.querySelector("#carrousel2"), {
    slidesVisible: 3,
    slidesToScroll: 2,
    loop: true,
  });
  new Carrousel(document.querySelector("#carrousel3"), {
    slidesVisible: 4,
    loop: true,
  });
});
