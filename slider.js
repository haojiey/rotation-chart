export class JJZSlider {
  constructor({
    container,
    images = [],
    style = { width: null, height: null },
    cycle = 3000,
  } = {}) {
    this.container = container;
    this.data = images;
    this.container.innerHTML = this.render(this.data);
    this.items = Array.from(
      container.querySelectorAll(".slider__item, .slider__item--selected")
    );
    this.cycle = cycle;
    this.slideTo(0);
    this.setStyle();
    this.start()

    if (style.width) {
      this.container.style.width = style.width + "px";
    }
    if (style.height) {
      this.container.style.height = style.height + "px";
    }
  }

  setStyle() {
    var style = document.createElement("style");
    style.type = "text/css";
    try {
      style.appendChild(document.createTextNode(getStyle()));
    } catch (ex) {
      style.styleSheet.cssText = getStyle(); //针对IE
    }
    var head = document.getElementsByTagName("head")[0];

    head.appendChild(style);
  }

  registerPlugins(...plugins) {
    plugins.forEach((plugin) => {
      const pluginContainer = document.createElement("div");
      pluginContainer.className = "slider__plugin";
      pluginContainer.innerHTML = plugin.render(this.data);
      this.container.appendChild(pluginContainer);
      plugin.initialize(this);
    });
  }

  render(images) {
    const content = images.map((image) =>
      `
      <li class="slider__item">
        <img src="${image}"/>
      </li> 
    `.trim()
    );

    return `<ul>${content.join("")}</ul>`;
  }

  start() {
    this.stop();
    this._timer = setInterval(() => this.slideNext(), this.cycle);
  }

  stop() {
    clearInterval(this._timer);
  }
  /*
   * 通过选择器`.slider__item--selected`获得被选中的元素
   */
  getSelectedItem() {
    const selected = this.container.querySelector(".slider__item--selected");
    return selected;
  }

  /*
    返回选中的元素在items数组中的位置。
  */
  getSelectedItemIndex() {
    return this.items.indexOf(this.getSelectedItem());
  }

  slideTo(idx) {
    const selected = this.getSelectedItem();
    if (selected) {
      // 将之前选择的图片标记为普通状态
      selected.className = "slider__item";
    }
    const item = this.items[idx];
    if (item) {
      // 将当前选中的图片标记为选中状态
      item.className = "slider__item--selected";
    }

    const detail = { index: idx };
    const event = new CustomEvent("slide", { bubbles: true, detail });
    this.container.dispatchEvent(event);
  }

  /*
    将下一张图片标记为选中状态
  */
  slideNext() {
    const currentIdx = this.getSelectedItemIndex();
    const nextIdx = (currentIdx + 1) % this.items.length;
    this.slideTo(nextIdx);
  }

  /*
    将上一张图片标记为选中状态
  */
  slidePrevious() {
    const currentIdx = this.getSelectedItemIndex();
    const previousIdx =
      (this.items.length + currentIdx - 1) % this.items.length;
    this.slideTo(previousIdx);
  }
}
export const pluginController = {
  render(images) {
    //随着图片数量的增加，小圆点元素也需要增加
    return `
          <div class="slider__control">
            ${images
              .map(
                (image, i) => `
                <span class="slider__control-buttons${
                  i === 0 ? "--selected" : ""
                }"></span>
            `
              )
              .join("")}
          </div>    
        `.trim();
  },
  initialize(slider) {
    const controller = slider.container.querySelector(".slider__control");

    if (controller) {
      const buttons = controller.querySelectorAll(
        ".slider__control-buttons, .slider__control-buttons--selected"
      );
      controller.addEventListener("mouseover", (evt) => {
        const idx = Array.from(buttons).indexOf(evt.target);
        if (idx >= 0) {
          slider.slideTo(idx);
          slider.stop();
        }
      });

      controller.addEventListener("mouseout", (evt) => {
        slider.start();
      });

      slider.container.addEventListener("slide", (evt) => {
        const idx = evt.detail.index;
        const selected = controller.querySelector(
          ".slider__control-buttons--selected"
        );
        if (selected) selected.className = "slider__control-buttons";
        buttons[idx].className = "slider__control-buttons--selected";
      });
    }
  },
};
export const pluginPrevious = {
  render() {
    return `<a class="slider__previous"></a>`;
  },

  initialize(slider) {
    const previous = slider.container.querySelector(".slider__previous");
    if (previous) {
      previous.addEventListener("click", (evt) => {
        slider.stop();
        slider.slidePrevious();
        slider.start();
        evt.preventDefault();
      });
    }
  },
};

export const pluginNext = {
  render() {
    return `<a class="slider__next"></a>`;
  },

  initialize(slider) {
    const previous = slider.container.querySelector(".slider__next");
    if (previous) {
      previous.addEventListener("click", (evt) => {
        slider.stop();
        slider.slideNext();
        slider.start();
        evt.preventDefault();
      });
    }
  },
};

function getStyle() {
  return ".slider{position: relative; width: 790px; height: 340px;} .slider ul li{width: 100%; height:100%} .slider ul li img{width: 100%; height: 100%;} .slider ul{list-style-type: none; position: relative; width: 100%; height: 100%; padding: 0; margin: 0;} .slider__item, .slider__item--selected{position: absolute; transition: opacity 1s; opacity: 0; text-align: center;} .slider__item--selected{transition: opacity 1s; opacity: 1;} .slider__next, .slider__previous{display: inline-block; position: absolute; top: 50%; margin-top: -25px; width: 30px; height: 50px; text-align: center; font-size: 24px; line-height: 50px; overflow: hidden; border: none; color: white; background: rgba(0, 0, 0, 0.2); cursor: pointer; opacity: 0; transition: opacity .5s;} .slider__previous{left: 0;} .slider__next{right: 0;} .slider:hover .slider__previous{opacity: 1;} .slider:hover .slider__next{opacity: 1;} .slider__previous:after{content: '<';} .slider__next:after{content: '>';} .slider__control{position: relative; background-color: rgba(255, 255, 255, 0.5); padding: 5px; display: table; border-radius: 12px; bottom: 30px; margin: auto;} .slider__control-buttons, .slider__control-buttons--selected{display: inline-block; width: 15px; height: 15px; border-radius: 50%; margin: 0 5px; background-color: white; cursor: pointer;} .slider__control-buttons--selected{background-color: red;}";
}
