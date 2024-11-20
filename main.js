import './style.css'

const gridLayout = document.querySelector('.grid-layout');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const typeFilter = document.getElementById('type-filter');
const minWeightFilter = document.getElementById('min-weight-filter');
const minHeightFilter = document.getElementById('min-height-filter');
const clearButton = document.getElementById('clear-button');
const initialNumberForLoadingPokemons = 100;
const minValueForSearch = 1;
const maxValueForSearch = 1000;
const totalListForSearchPokemons = 10000;

let initialPokemonList = [];
let fullPokemonList = [];

async function getPokemonData(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);

        if (!response.ok) throw new Error('Pokémon no encontrado');

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(`Error al obtener los datos del Pokémon ${pokemonId}`, error);
        showAlert(`Pokémon no encontrado ${pokemonId}. Por favor, intenta con otro nombre o ID.`, 'error');
        return null;
    }
}

function generateRandomNumbers(count, min, max) {
    const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
    const randomNumbers = numbers.sort(() => 0.5 - Math.random()).slice(0, count);
    return randomNumbers.sort((a, b) => a - b);
}

async function loadInitialPokemons() {
    const randomIds = generateRandomNumbers(initialNumberForLoadingPokemons, minValueForSearch,maxValueForSearch);
    const promises = randomIds.map(id => getPokemonData(id));
    initialPokemonList = (await Promise.all(promises)).filter(pokemon => pokemon);
    displayInitialPokemons(initialPokemonList);
}

async function getAllPokemonList() {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalListForSearchPokemons}`);
        if (!response.ok) throw new Error('No se pudo obtener la lista de Pokémon');
        const data = await response.json();

        fullPokemonList = await Promise.all(
            data.results.map(pokemon => getPokemonDataByUrl(pokemon.url))
        );
        console.log('Listado completo cargado:', fullPokemonList.length);

    } catch (error) {
        console.error('Error al obtener la lista de Pokémon:', error);
        showAlert("Error al obtener la lista de Pokémon. Inténtalo más tarde.", "warning");
    }
}

async function getPokemonDataByUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Pokémon no encontrado');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los datos del Pokémon:', error);
        return null;
    }
}

function createPokemonCard(pokemon) {
    const card = document.createElement('article');
    card.classList.add('card');
    const pokemonName = pokemon.name.toUpperCase();
    const pokemonId = `#${pokemon.id}`;
    const pokemonImage = pokemon.sprites.front_default;
    const pokemonTypes = pokemon.types.map(type => type.type.name).join(', ');
    const pokemonAbilities = pokemon.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('');
    const pokemonStats = pokemon.stats.map(stat => {
        const statName = stat.stat.name.replace(/\b[a-z]/gi, match => match.toUpperCase());
        const statValue = stat.base_stat;
        return `<div class="stat"><span><b>${statName}</b></span><span>${statValue}</span></div>`;
    }).join('');
    const PokemonTypeFirst = pokemon.types[0].type.name;
    const PokemonTypeColors = {
        fire: '#EE8130',
        grass: '#7AC74C',
        eletric: '#F7D02C',
        water: '#6390F0',
        ground: '#E2BF65',
        rock: '#B6A136',
        fairy: '#D685AD',
        poison: '#A33EA1',
        bug: '#A6B91A',
        dragon: '#6F35FC',
        psychic: '#F95587',
        flying: '#A98FF3',
        fighting: '#C22E28',
        normal: '#A8A77A',
        ice: '#96D9D6',
        ghost: '#735797',
        dark: '#705746',
        steel: '#B7B7CE',
    };
    const AddColors = PokemonTypeColors[PokemonTypeFirst];
    
    card.innerHTML = `
    <div class="pokemon-card">
        <img class="pokemon-image" src="${pokemonImage}" alt="${pokemonName}"> 
        <h2 class="pokemon-name">${pokemonName}</h2>
        <div class="pokemon-info">
            <p><b>${pokemonId}</b></p>
            <div>
                <span class="pokemon-type">Type: ${pokemonTypes}</span>
            </div>
        </div>
        <p><b>Weight:</b> ${pokemon.weight} kg</p>
        <p><b>Height:</b> ${pokemon.height} cm</p>
        <h3>Abilities</h3>
        <ul class="pokemon-abilities">
            ${pokemonAbilities}
        </ul>
        <h3>Stats</h3>
        <div class="pokemon-stats">
            ${pokemonStats}
        </div>
    </div>
    `;

    card.style.background = AddColors;
    gridLayout.appendChild(card);
}

function searchPokemon() {
    const searchValue = searchInput.value.trim().toLowerCase();

    if (searchValue) {
        const filteredPokemons = initialPokemonList.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchValue)
        );
        clearGrid();
        filteredPokemons.forEach(createPokemonCard);
    } else {
        displayInitialPokemons();
    }
}

function clearGrid() {
    gridLayout.innerHTML = '';
}

function displayInitialPokemons(pokemonList) {
    clearGrid();
    pokemonList.forEach(createPokemonCard);
}

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchPokemon();
    }
});

function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    const alertMessage = document.createElement('p');
    const closeButton = document.createElement('button');
    const alertDiv = document.createElement('div');

    alertDiv.classList.add('alert', `alert-${type}`);
    alertMessage.textContent = message;
    alertDiv.appendChild(alertMessage);

    alertContainer.appendChild(alertDiv);

    closeButton.textContent = 'Aceptar';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => {
        alertContainer.removeChild(alertDiv);
    });

    alertDiv.appendChild(closeButton);
    setTimeout(() => {
        alertContainer.removeChild(alertDiv);
    }, 3000);

    
}

function filterPokemon() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const selectedType = typeFilter.value;
    const minWeight = parseFloat(minWeightFilter.value); 
    const minHeight = minHeightFilter.value; 

    const filteredPokemons = fullPokemonList.filter(pokemon => {
        const matchesName = pokemon.name.toLowerCase().includes(searchValue);
        const matchesType = selectedType ? pokemon.types.some(type => type.type.name === selectedType) : true;
        const matchesWeight = minWeight ? pokemon.weight >= minWeight : true;
        const matchesHeight = minHeight ? pokemon.height >= minHeight : true;

        return matchesName && matchesType && matchesWeight && matchesHeight;
    });

    displayInitialPokemons(filteredPokemons);
}

function clearInputs(){
    searchInput.value = '';
    typeFilter.value = '';
    minWeightFilter.value = '';
    minHeightFilter.value = '';
    displayPokemons(initialPokemonList);
}

searchButton.addEventListener('click', filterPokemon);
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        filterPokemon();
    }
});
clearButton.addEventListener('click', clearInputs);
document.addEventListener('DOMContentLoaded', async () => {
    await loadInitialPokemons(); // Cargar los primeros 100 Pokémon
    getAllPokemonList(); // Cargar el listado completo de forma asíncrona
});