class Drag {
  constructor(ele, fn) {
    this.ele = ele;
    this.fn = fn;
    this.init();
  }

  init() {
    const { ele } = this;
    this.setPC(ele);
    this.setMobile(ele);
  }

  setPC(element) {
    // pc端 闭包有助于访问mousedown时的变量
    const ele = element;
    ele.onmousedown = (e) => {
      const disx = e.pageX - ele.offsetLeft;
      const disy = e.pageY - ele.offsetTop;

      document.onmousemove = (ev) => {
        ev.preventDefault();// 解决拖动过快突然事件断掉的怪异bug
        ele.style.left = `${ev.pageX - disx}px`;
        ele.style.top = `${ev.pageY - disy}px`;
      };

      document.onmouseup = () => {
        if (typeof this.fn === 'function') {
          const obj = {
            x: ele.style.left.replace(/px/g, '') * 1,
            y: ele.style.top.replace(/px/g, '') * 1,
          };
          this.fn(obj);
        }
        document.onmouseup = null;// 解除事件绑定
        document.onmousemove = null;
      };
    };
  }

  setMobile(element) {
    // 移动端 闭包有助于访问touchstart时的变量
    const ele = element;
    ele.ontouchstart = (e) => {
      e.preventDefault();// 禁止同时触发click事件
      const disx = e.touches[0].clientX - ele.offsetLeft;
      const disy = e.touches[0].clientY - ele.offsetTop;

      const moveFn = (ev) => {
        e.preventDefault();// 禁止在拖动时移动端窗口滚动问题
        ele.style.left = `${ev.touches[0].clientX - disx}px`;
        ele.style.top = `${ev.touches[0].clientY - disy}px`;
      };

      document.addEventListener('touchmove', moveFn, { passive: false });// 解决chrome56+的报错问题

      document.ontouchend = () => {
        if (typeof this.fn === 'function') {
          const obj = {
            x: ele.style.left.replace(/px/g, '') * 1,
            y: ele.style.top.replace(/px/g, '') * 1,
          };
          this.fn(obj);
        }
        document.ontouchend = null;// 解除事件绑定
        document.removeEventListener('touchmove', moveFn);
      };
    };
  }
}

export default Drag;
