import detect from '../detect';

export default {
  inputScrollView: {
    inserted(el) {
      if (!detect.isAndroid()) {
        return;
      }

      const winHeight = document.documentElement.clientHeight;
      const div = document.createElement('div');
      const base = el.getAttribute('base')
        ? parseFloat(el.getAttribute('base'))
        : 0.3;

      div.className = 'input-scroll-enter';
      div.style.height = winHeight * base + 'px';

      el.addEventListener('click', e => {
        document.body.appendChild(div);
        el.scrollIntoView();
        e.stopPropagation();
      });

      document.body.addEventListener('click', e => {
        if (e.target !== div) {
          document.body.removeChild(div);
        }
      });
    }
  }
};
