'use strict';//obligar a estar declarando 

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel); //alias de query selector $
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel)); // arreglos de varios query selector $$
const API_KEY = '2eb8bf3e51af4b259ba323e12a2d8e8a';
const API_URL = `https://newsapi.org/v2/everything?domains=wsj.com&apiKey=${API_KEY}`;


const buildCard = ({ title, text, tags }) => {
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
const filtro = $('#filtro');
const chips = $('#chips');
const formNewsletter = $('#formNewsletter');
const email = $('#email');
const interes = $('#interes');
const feedback = $('#feedback'); 
const listaNoticias = $('#listaNoticias');
const btnCargar = $('#btnCargar');

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
        if (card.dataset.seed === 'true') return;
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
    // se hizo click en un boton ?  owo
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const card = btn.closest('.card');
    if (!card) return;

    const action = btn.dataset.action;
    if (action === 'like') doLike(card);
    if (action === 'remove') doRemove(card);
});

const doLike = (card) => {
    const badge = card.querySelector('.badge');
    const currentLikes = Number(badge.textContent) || 0;
    badge.textContent = currentLikes + 1;
    setEstado('like + 1');
};

const doRemove = (card) => {
    const badge = card.querySelector('.badge');
    const currentLikes = Number(badge.textContent) || 0;
    currentLikes > 0
        ? badge.textContent = currentLikes - 1
        : badge.textContent = 0;
    setEstado('Like - 1');
};

const matchText = (card, q) => {
    const title = card.querySelector('.card-title')?.textContent ?? '';
    const text = card.querySelector('.card-text')?.textContent ?? ''; 
    const haystack = (title + ' ' + text ).toLowerCase();
    return haystack.includes(q);
};

filtro.addEventListener('input', () => {
    // const q = filtro.value.trim().toLowerCase();
    // const cards = $$('#listaArticulos .card');

    // cards.forEach(( card ) => {
    //     const ok = q === '' ? true : matchText(card , q);
    //     card.hidden = !ok;
    // })
    filterState.q = filtro.value.trim().toLowerCase();
    applyFilters();
});

chips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;

    const tag = (chip.dataset.tag ||'').toLowerCase();
    filterState.tag = (filterState.tag === tag) ? '' : tag;
    applyFilters();
    // const cards = $$('#listaArticulos .card');

    // cards.forEach((card) => {
    //     // const tags = (card.dataset.tags || '').toLowerCase();
    //     // card.hidden = !tags.includes(tag);
    //     const ok = q === '' ? true : matchTag(card , q);
    //     card.hidden = !ok;
    // });
});

const filterState = {
    q: '',
    tag: '',
};

const matchTag = (card, tag) =>{
    if (!tag) return true;
    const tags = (card.dataset.tags || '').toLowerCase();
    return tags.includes(tag.toLowerCase());
};

const applyFilters = () => {
    const cards = $$('#listaArticulos .card');
    cards.forEach((card) => {
        const okText = filterState.q ? matchText(card, filterState.q) : true;
        const okTag = matchTag(card, filterState.tag);
        card.hidden = !(okText && okTag);
    });

    const parts = [];
    if (filterState.q) parts.push(`texto: "${filterState.q}"`);
    if (filterState.tag) parts.push(`tag: "${filterState.tag}"`);
    setEstado(parts.length > 0 ? 'Filtrando por ' + parts.join(', ') : 'filtros: ninguno');
};

// validar el email del formulario de newsletter con una expresion regular simple
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    // es un conjunto de caracteres sin espacios la \s representa espacios.
   

formNewsletter.addEventListener('submit', (e)=>{
    e.preventDefault();
    const valueEmail = email.value.trim();
    const valueInteres = interes.value.trim();

    email.classList.remove('is-invalid');
    interes.classList.remove('is-invalid');
    feedback.textContent = '';

    let ok = true;

    if (!isValidEmail(valueEmail)) {
        email.classList.add('is-invalid');
        feedback.textContent = 'ponga un correo valido';
        ok = false;
    }

    if (valueInteres === ''){
        interes.classList.add('is-invalid')
        feedback.textContent = 'ponga un correo invalido'
        ok = false;
    }

    if (!ok){
        feedback.textContent ='Revisa los campos';
        setEstado ('Fomulario con errores');
        return;
    }

    feedback.textContent = 'Gracias por suscribirte';
    setEstado('Formulario enviado');
    formNewsletter.reset();
});

// carga asincrona de noticias falsas
const renderNoticias = (items) => {
    listaNoticias.innerHTML = '';// reinicia todo 
    

    if (!items || items.length === 0 ) {
        const li= document.createElement('li');
        li.textContent = 'No se encontraron noticias papu';
        listaNoticias.append(li);
        return;
    }
    items.forEach((t) => {
        const li= document.createElement('li');
        li.textContent = t;
        listaNoticias.append(li)
    });
};

// const fakeFetchNoticias = () => {
//     return new Promise((resolve, reject) => {
//         const shouldFail = Math.random() < 0.20; // 20% de probabilidad de fallo
//         setTimeout(() => {
//             if (shouldFail) {
//                 reject(new Error ('fallo papuuuu'));
//                 return;
//             }
//             resolve([
//                 'los negros ya tienen derecho a votar siiiiii',
//                 'Claudia sheinbaum es mama de carlos villagran',
//                 'Se avista aluxhe en ixtenco caminando por la ciudad '

//             ]);
            
//         },1500);
//     });
// }; //Simulacion de noticias falsas con un temporizador para crear la ilusion de que se estan cargando las noticias

// btnCargar.addEventListener('click', async() => {
//     btnCargar.disabled = true;
//     setEstado('Cargando noticias...');
//     try {
//         // esprear a que se resuelva la promesa 
//         const items = await fakeFetchNoticias();
//         renderNoticias (items);
//         setEstado('Noticias cargadas');
//     } catch (error) {
//         renderNoticias (['Error: ' + error.message]);
//         setEstado('Error al cargar noticias');
//     } finally {
//         btnCargar.disabled = false;
//     }

// }); //evento que escucha a las noticias falsas 

const fetchNoticias = async () => {
    try {
        const response = await fetch(API_URL)
        if(!response.ok){
            throw new Error("No se encontraron noticias");
        }
        const data = await response.json();
        return data.articles.map(article => article.title);
    }
    catch (error){
        throw error;
    }

}

btnCargar.addEventListener('click', async() => {
    btnCargar.disabled = true;
    setEstado('Cargando noticias...');
    try {
        // esprear a que se resuelva la promesa 
        const items = await fetchNoticias();
        renderNoticias (items);
        setEstado('Noticias cargadas');
    } catch (error) {
        renderNoticias (['Error: ' + error.message]);
        setEstado('Error al cargar noticias');
    } finally {
        btnCargar.disabled = false;
    }

}); //evento que escucha a las noticias reales que se consumen en la api