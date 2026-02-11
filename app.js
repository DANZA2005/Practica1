'use strict';//obligar a estar declarando 

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel); //alias de query selector $
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel)); // arreglos de varios query selector $$


const buildCard = ({title, text,tags}) => {
    const article = document.createElement('article');
    article.className = 'card'
    article.dataset.seed = tags;
    article.innerHTML = `
        <h3 class="card-title"></h3>
            <p class="card-text"></p>
            <div class="card-actions">
              <button class="btn small" type="button" data-action="like">👍 Like</button>
              <button class="btn small ghost" type="button" data-action="remove">Eliminar</button>
              <span class="badge" aria-label="likes">0</span>
            </div>
    `;
    article.querySelector('.card-title').textContent = title; // esto tambien se puede expresar como ${title} esto dentro de la etiqueta aunque la desventaja es la posible inyeccion de SQL
    article.querySelector('.card-text').textContent = text;
    return article;
}


const estadoUI = $('#estadoUI');
const setEstado = (msg) => { estadoUI.textContent = msg; };
setEstado('Hot');

// Referencias a elementos del DOM 
const btnCambiarMensaje = $('#btnCambiarMensaje');
const tituloPrincipal = $('#tituloPrincipal');
const subtitulo = $('#subtitulo');
const listaArticulos = $('#listaArticulos');
const btnAgregarCard = $('#btnAgregarCard');
const listaArticulos2 = $('#listaArticulos');
const btnLimpiar = $('#btnLimpiar');
const listaArticulos3 = $('#listaArticulos');

// Manejar eventos
btnCambiarMensaje.addEventListener('click', () => {
    const alt = tituloPrincipal.dataset.alt === '1';

    tituloPrincipal.textContent = alt
        ? '¡Biencorrido a la app!'
        : 'Hola Chat';

    subtitulo.textContent = alt
        ? '¡Verifica tus fuentes!'
        : 'Si profeeee';

    tituloPrincipal.dataset.alt = alt ? '0' : '1'
    setEstado('Texto Cambiado');
});

listaArticulos.addEventListener('mouseover', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;
    card.classList.add('is-highlight');
});

listaArticulos.addEventListener('mouseout', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;
    card.classList.remove('is-highlight');
});

//agregar elementos al DOM

btnAgregarCard.addEventListener('click', () => {
    const new_articule = buildCard({
        title: 'Nuevo articulo',
        text: 'Este es la nueva tarjeta ',
        tags: 'Nuevo arituculo'
    });
    listaArticulos2.append(new_articule);
    setEstado('Nueva trajeta papu');
});

//Eliminar elementos agregados del DOM
btnLimpiar.addEventListener('click', () => {
    const cards = $$('#listaArticulos .card');
    let removed = 0;
    cards.forEach(card => {
        if (card.dataset.seed == 'true') return; 
        card.remove();
        removed++; 
    });
    setEstado('los articulos borrados fueron ' + removed);
});

// const likeButtons = $$('#listaArticulos button[data-action= "like"]');
// likeButtons.forEach( btn => {
//     btn.addEventListener('click', () => {
//         const card = btn.closest('.card');
//         hacerLike(card);
//     });
// }); //esto no funciona porque los botones se crean dinamicamente y no existen al momento de agregar el evento, por lo tanto se debe usar delegacion de eventos

listaArticulos3.addEventListener('click', (e) => {
    // se hizo click en un  btn de like ?
    const btn = e.target.closest('button[data-action= "like"]');
    if (!btn) return;
    const card = btn.closest('.card');
    if (!card) return;
    hacerLike(card);
});

const hacerLike = (card) => {
    const badge = card.querySelector('.badge');
        const currentLikes = Number(badge.textContent) || 0;
        badge.textContent = currentLikes + 1;
        setEstado('like + 1');
};

