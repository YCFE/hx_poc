
export function downloadImage(opts, callback) {
  console.info(opts);

  const data = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAALCAYAAABGbhwYAAAABGdBTUEAALGPC/xhBQAAAWNJREFUGBk9kL9Lw0Acxd8llyZtBVvBHyCKOlioOHRRF1cXN6GLiC4u/gEOokPF0UVwEh10szjr6H/goouotUspDk2t2jZp0uR8jdKDu/ve3ec93vcE7pSJVuMCwBqU8qFY9YboTWHwfAs0tyRaXycwrA14LqAEZpJaxJRaYcQjZubhqZhA0Xagada4KWAphcJ8giYKh08OHCFQdSkwTEjKPN5bGTpNE55KaBG4mJKoeApVh6DfgRb5hwrPPwFsX+HszcXlu4edjInvgIH/M0tQkEtLrE8YiOuATZdyM0BME3hsBH85ucoEH3ODOo5fXHQpWhmRuFpKok7BHl1vKj5e2ZgUDBxjAPYBi/vyMMFyB/cfXexmLezPxVFqhvyJ61p7YciMb05KpAyBh88Ap6UOusyn6wKrYwa2ZwcIFu0jmMmDfhg2BgL9wThw2ucCBaUhW8/zL0cjmz7BQlIRqhry6etfw06FpLjKvFEAAAAASUVORK5CYII=';
  callback && callback({
    data,
  });
}
