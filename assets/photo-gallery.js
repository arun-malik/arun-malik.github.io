(function () {
    'use strict';

    const groups = document.querySelectorAll('.talk-photos');
    if (!groups.length || typeof HTMLDialogElement !== 'function') return;

    const style = document.createElement('style');
    style.textContent = [
        '.photo-gallery { padding: 0; border: 0; background: transparent; max-width: 100vw; max-height: 100vh; width: 100vw; height: 100vh; }',
        '.photo-gallery::backdrop { background: rgba(0, 0, 0, 0.88); }',
        '.photo-gallery[open] { display: flex; flex-direction: column; align-items: center; justify-content: center; }',
        '.photo-gallery figure { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; max-width: 92vw; }',
        '.photo-gallery img { max-width: 92vw; max-height: 82vh; object-fit: contain; border-radius: 6px; box-shadow: 0 8px 40px rgba(0,0,0,0.5); }',
        '.photo-gallery figcaption { color: #e5e7eb; font-size: 0.875rem; text-align: center; }',
        '.photo-gallery .pg-count { color: #9ca3af; margin-left: 0.5rem; }',
        '.photo-gallery button { position: fixed; background: rgba(255,255,255,0.12); color: #fff; border: 0; border-radius: 999px; width: 48px; height: 48px; font-size: 1.5rem; line-height: 1; cursor: pointer; }',
        '.photo-gallery button:hover, .photo-gallery button:focus-visible { background: rgba(255,255,255,0.28); outline: none; }',
        '.photo-gallery .pg-prev { left: 1rem; top: 50%; transform: translateY(-50%); }',
        '.photo-gallery .pg-next { right: 1rem; top: 50%; transform: translateY(-50%); }',
        '.photo-gallery .pg-close { right: 1rem; top: 1rem; font-size: 1.25rem; }',
        '.photo-gallery[data-single] .pg-prev, .photo-gallery[data-single] .pg-next { display: none; }',
        'body:has(.photo-gallery[open]) { overflow: hidden; }'
    ].join('\n');
    document.head.appendChild(style);

    const dialog = document.createElement('dialog');
    dialog.className = 'photo-gallery';
    dialog.setAttribute('aria-label', 'Photo viewer');
    dialog.innerHTML =
        '<button type="button" class="pg-close" aria-label="Close">&#10005;</button>' +
        '<button type="button" class="pg-prev" aria-label="Previous photo">&#8249;</button>' +
        '<figure><img alt=""><figcaption><span class="pg-caption"></span><span class="pg-count"></span></figcaption></figure>' +
        '<button type="button" class="pg-next" aria-label="Next photo">&#8250;</button>';
    document.body.appendChild(dialog);

    const img = dialog.querySelector('img');
    const caption = dialog.querySelector('.pg-caption');
    const count = dialog.querySelector('.pg-count');
    let items = [];
    let index = 0;

    function show(i) {
        index = (i + items.length) % items.length;
        const link = items[index];
        const thumb = link.querySelector('img');
        img.src = link.href;
        img.alt = thumb ? thumb.alt : '';
        caption.textContent = img.alt;
        count.textContent = items.length > 1 ? (index + 1) + ' / ' + items.length : '';
    }

    groups.forEach(function (group) {
        const links = Array.from(group.querySelectorAll('a[href]'));
        links.forEach(function (link, i) {
            link.addEventListener('click', function (event) {
                if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                items = links;
                dialog.toggleAttribute('data-single', links.length < 2);
                show(i);
                dialog.showModal();
            });
        });
    });

    dialog.querySelector('.pg-prev').addEventListener('click', function () { show(index - 1); });
    dialog.querySelector('.pg-next').addEventListener('click', function () { show(index + 1); });
    dialog.querySelector('.pg-close').addEventListener('click', function () { dialog.close(); });

    dialog.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
        else if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
    });

    dialog.addEventListener('click', function (event) {
        if (event.target === dialog) dialog.close();
    });

    let startX = null;
    dialog.addEventListener('touchstart', function (event) { startX = event.touches[0].clientX; }, { passive: true });
    dialog.addEventListener('touchend', function (event) {
        if (startX === null) return;
        const dx = event.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
        startX = null;
    });

    dialog.addEventListener('close', function () { img.removeAttribute('src'); });
}());
