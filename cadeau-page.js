'use strict';

const gift = GIFTS[GIFT_ID];
if (!gift) { window.location.replace('/'); }

document.title = `${gift.name} — 50 ans d'Agnès`;

function navigateTo(url) {
    document.body.classList.add('exit');
    setTimeout(() => { window.location.href = url; }, 280);
}

/* Retour */
document.getElementById('btn-back').addEventListener('click', e => {
    e.preventDefault();
    navigateTo('/?skip=1');
});

/* Contenu */
document.getElementById('detail-num').textContent      = gift.num;
document.getElementById('detail-title').textContent    = gift.name;
document.getElementById('detail-subtitle').textContent = gift.subtitle;
document.getElementById('detail-story').innerHTML      = gift.story.map(p => `<p>${p}</p>`).join('');
document.getElementById('detail-includes-list').innerHTML =
    gift.includes.map(item => `<li>${item}</li>`).join('');

/* Image */
const imgCol = document.getElementById('img-col');
const img    = new Image();
img.alt      = gift.name;
img.src      = `/${gift.img}`;
imgCol.appendChild(img);

/* Choix final */
const btnChoose = document.getElementById('btn-choose');
btnChoose.addEventListener('click', () => {
    btnChoose.disabled    = true;
    btnChoose.textContent = '…';

    fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gift: gift.name })
    }).catch(() => {});

    setTimeout(() => navigateTo(`/confirmation?id=${GIFT_ID}`), 250);
});
