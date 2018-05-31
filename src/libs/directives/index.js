import detect from '../detect';

const createEmptyDiv = (el) => {
  const winHeight = document.documentElement.clientHeight;
  const div = document.createElement('div');
  const base = el.getAttribute('base')
    ? parseFloat(el.getAttribute('base'))
    : 0.3;

  div.className = 'input-scroll-enter';
  div.style.display = 'none';
  div.style.height = winHeight * base + 'px';

  return div;
}

const getEmptyDiv = (el) => {
  let selector = document.querySelector('.input-scroll-enter');

  if(!selector) {
    let div = createEmptyDiv(el);
    document.body.appendChild(div);
    selector = div;
  }

  return selector;
}

export default {
  inputScrollView: {
    inserted(el) {
      if (!detect.isAndroid()) {
        return;
      }

      const div = getEmptyDiv(el);

      el.addEventListener('click', e => {
        div.style.display = 'block';
        el.scrollIntoView();
        e.stopPropagation();
      });

      document.body.addEventListener('click', e => {
        if (e !== el) {
          setTimeout(() => {
            div.style.display = 'none';
          }, 150);
        }
      });
    }
  }
};
