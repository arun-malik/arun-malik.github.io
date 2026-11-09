(function () {
    'use strict';

    const dialog = document.getElementById('certificateDialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    const title = document.getElementById('certificateTitle');
    const frame = document.getElementById('certificateFrame');
    const open = document.getElementById('certificateOpen');

    document.querySelectorAll('a[data-certificate]').forEach(function (link) {
        link.addEventListener('click', function (event) {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

            event.preventDefault();
            title.textContent = link.dataset.certificate;
            frame.title = link.dataset.certificate + ' certificate PDF preview';
            open.href = link.href;
            frame.src = link.href;
            dialog.showModal();
        });
    });

    dialog.addEventListener('close', function () {
        frame.removeAttribute('src');
        open.removeAttribute('href');
    });
}());
