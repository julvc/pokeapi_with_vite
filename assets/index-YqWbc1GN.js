(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();const y=document.querySelector(".grid-layout"),c=document.getElementById("search-input"),F=document.getElementById("search-button"),g=document.getElementById("type-filter"),k=document.getElementById("min-weight-filter"),b=document.getElementById("min-height-filter"),$=document.getElementById("clear-button"),B=100,I=1,N=1e3,D=1e4;let l=[],p=[];async function T(e){try{const t=await fetch(`https://pokeapi.co/api/v2/pokemon/${e}`);if(!t.ok)throw new Error("Pokémon no encontrado");return await t.json()}catch(t){return console.error(`Error al obtener los datos del Pokémon ${e}`,t),P(`Pokémon no encontrado ${e}. Por favor, intenta con otro nombre o ID.`,"error"),null}}function O(e,t,r){return Array.from({length:r-t+1},(o,a)=>a+t).sort(()=>.5-Math.random()).slice(0,e).sort((o,a)=>o-a)}async function S(){const t=O(B,I,N).map(r=>T(r));l=(await Promise.all(t)).filter(r=>r),h(l)}async function j(){try{const e=await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${D}`);if(!e.ok)throw new Error("No se pudo obtener la lista de Pokémon");const t=await e.json();p=await Promise.all(t.results.map(r=>H(r.url))),console.log("Listado completo cargado:",p.length)}catch(e){console.error("Error al obtener la lista de Pokémon:",e),P("Error al obtener la lista de Pokémon. Inténtalo más tarde.","warning")}}async function H(e){try{const t=await fetch(e);if(!t.ok)throw new Error("Pokémon no encontrado");return await t.json()}catch(t){return console.error("Error al obtener los datos del Pokémon:",t),null}}function E(e){const t=document.createElement("article");t.classList.add("card");const r=e.name.toUpperCase(),s=`#${e.id}`,n=e.sprites.front_default,o=e.types.map(i=>i.type.name).join(", "),a=e.abilities.map(i=>`<li>${i.ability.name}</li>`).join(""),d=e.stats.map(i=>{const w=i.stat.name.replace(/\b[a-z]/gi,A=>A.toUpperCase()),C=i.base_stat;return`<div class="stat"><span><b>${w}</b></span><span>${C}</span></div>`}).join(""),m=e.types[0].type.name,u={fire:"#EE8130",grass:"#7AC74C",eletric:"#F7D02C",water:"#6390F0",ground:"#E2BF65",rock:"#B6A136",fairy:"#D685AD",poison:"#A33EA1",bug:"#A6B91A",dragon:"#6F35FC",psychic:"#F95587",flying:"#A98FF3",fighting:"#C22E28",normal:"#A8A77A",ice:"#96D9D6",ghost:"#735797",dark:"#705746",steel:"#B7B7CE"}[m];t.innerHTML=`
    <div class="pokemon-card">
        <img class="pokemon-image" src="${n}" alt="${r}"> 
        <h2 class="pokemon-name">${r}</h2>
        <div class="pokemon-info">
            <p><b>${s}</b></p>
            <div>
                <span class="pokemon-type">Type: ${o}</span>
            </div>
        </div>
        <p><b>Weight:</b> ${e.weight} kg</p>
        <p><b>Height:</b> ${e.height} cm</p>
        <h3>Abilities</h3>
        <ul class="pokemon-abilities">
            ${a}
        </ul>
        <h3>Stats</h3>
        <div class="pokemon-stats">
            ${d}
        </div>
    </div>
    `,t.style.background=u,y.appendChild(t)}function M(){const e=c.value.trim().toLowerCase();if(e){const t=l.filter(r=>r.name.toLowerCase().includes(e));v(),t.forEach(E)}else h()}function v(){y.innerHTML=""}function h(e){v(),e.forEach(E)}c.addEventListener("keyup",e=>{e.key==="Enter"&&M()});function P(e,t){const r=document.getElementById("alert-container"),s=document.createElement("p"),n=document.createElement("button"),o=document.createElement("div");o.classList.add("alert",`alert-${t}`),s.textContent=e,o.appendChild(s),r.appendChild(o),n.textContent="Aceptar",n.classList.add("close-button"),n.addEventListener("click",()=>{r.removeChild(o)}),o.appendChild(n),setTimeout(()=>{r.removeChild(o)},3e3)}function L(){const e=c.value.trim().toLowerCase(),t=g.value,r=parseFloat(k.value),s=b.value,n=p.filter(o=>{const a=o.name.toLowerCase().includes(e),d=t?o.types.some(u=>u.type.name===t):!0,m=r?o.weight>=r:!0,f=s?o.height>=s:!0;return a&&d&&m&&f});h(n)}function V(){c.value="",g.value="",k.value="",b.value="",displayPokemons(l)}F.addEventListener("click",L);c.addEventListener("keyup",e=>{e.key==="Enter"&&L()});$.addEventListener("click",V);document.addEventListener("DOMContentLoaded",async()=>{await S(),j()});