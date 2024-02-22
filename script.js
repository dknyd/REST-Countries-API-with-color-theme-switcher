// VARIABLES
const modeButton = document.querySelector('.mode');
const lightCSS = document.querySelector('link[href="style_light.css"]');
const darkCSS = document.querySelector('link[href="style_dark.css"]');
const containerFrontPage = document.querySelector('.container__front__page');
const dropdown = document.getElementById('regions');
const containerDetailPage = document.querySelector('.container__detail__page');
const inputField = document.querySelector('.input__country');
const inputContainer = document.querySelector('.container__input');
const buttonBack = document.querySelector('.button__back');
const containerMid = document.querySelector('.container__mid');


// MODE CHANGE
modeButton.addEventListener('click', function () {
    if (modeButton.classList.contains('dark')) {
        // Light mode
        darkCSS.disabled = true;
        lightCSS.disabled = false;
        modeButton.innerHTML = `<span>&#9788;</span> Light Mode`;
        modeButton.classList.remove('dark');
        modeButton.classList.add('light');
    } else {
        // Dark mode
        darkCSS.disabled = false;
        lightCSS.disabled = true;
        modeButton.innerHTML = "<span>&#9789;</span> Dark Mode";
        modeButton.classList.remove('light');
        modeButton.classList.add('dark');
    }
});

document.addEventListener('DOMContentLoaded', function(){
    darkCSS.disabled = true;
    lightCSS.disabled = false;
    modeButton.classList.remove('dark');
        modeButton.classList.add('light');
    console.log('content loaded!')
})

//CREATE COUNTRY FRONTPAGE FUNCTION
function createCountryFrontPage(flag, name, population, region, capital){
    let html =  `
    <div class="container__preview ${region}" id="${name}">
                <img class="preview__flag" src="${flag}" alt="flagOf${name}">
                <div class="preview__name">${name}</div>
                <div class="preview__population">Population: <span class="data data__population">${population.toLocaleString('de-DE')}</span> </div>
                <div class="preview__region">Region: <span class="data data__region">${region}</span></div>
                <div class="preview__capital">Capital: <span class="data data__capital">${capital}</span></div>
            </div>
    `
    containerFrontPage.insertAdjacentHTML('beforeend', html);
}

//GET ALL COUNTRIES'
async function getCountriesData() {
    const res = await fetch(`https://restcountries.com/v3.1/all`);
    const data = await res.json();
    data.forEach(country => {
        createCountryFrontPage(country.flags.svg, country.name.common, country.population, country.region, country.capital);
    })
 }
 getCountriesData();

//FILTER FOR REGION
function filterRegion (region){
    const containerPreviews = document.querySelectorAll('.container__preview');
    containerPreviews.forEach (country =>{
        console.log(country.classList[1])
        if (country.classList[1] === region){
            country.classList.remove('hidden');
        } 
        if (!(country.classList[1] === region)) {
            country.classList.add('hidden');
        }
        if (region === "All"){
            country.classList.remove('hidden')
        }
    })
}

//ADD FILTER FUNCTION TO DROPDOWN MENU
dropdown.addEventListener('change', function() {
    filterRegion(dropdown.value);
})

//FILTER FOR COUNTRY FUNCTION 
const button = document.querySelector('button');

function filterCountry(countryName) {
    const containerPreviews = document.querySelectorAll('.container__preview');
    containerPreviews.forEach(country => {
        // console.log(country.id)
        if ((country.id).toLowerCase().includes(countryName)){
            country.classList.remove('hidden');
        } 
        if (!(country.id.toLowerCase().includes(countryName))) {
            country.classList.add('hidden');
        }
    })
}

// ADDING FILTER FUNCTION TO INPUT FIELD  
        inputField.addEventListener('input', function() {
            console.log("Typed letter: ", inputField.value);
            filterCountry(inputField.value.toLowerCase())
        });

// CREATING DETAIL PAGE
function createDetailPage (flag, commonName, nativeName, population, region, capital, domain, currency, languages){
    containerFrontPage.classList.add('hidden');
    inputContainer.classList.add('hidden');
    dropdown.classList.add('hidden');
    containerDetailPage.classList.remove('hidden');
    buttonBack.classList.remove('hidden');
    const html =`
    <div class="container__detail">
        <img class="detail__flag" src="${flag}" alt="flagOf${commonName}">
        <div class="details__top">
            <div class="common__name">${commonName}</div>
            <div class="details__name">Native Name:<span class="name__data"> ${nativeName}</span></div>
            <div class="details__population">Population:<span class="population__data"> ${population.toLocaleString('de-DE')}</span></div>
            <div class="details__region">Region:<span class="region__data"> ${region}</span></div>
            <div class="details__capital">Capital:<span class="capital__data"> ${capital}</span></div>
        </div>
        <div class="details__bottom">
            <div class="details__domain">Top Level Domain:<span class="domain__data"> ${domain}</span></div>
            <div class="details__currency">Currency:<span class="currency__data"> ${currency}</span></div>
            <div class="details__language">Languages: <span class="language__data">${languages}</span></div>
        </div>
        <div class="details__bordering">
        <div class="text__bordering">Border Countries:</div>
            <div class="data__bordering">
            </div>
        </div>
    </div>`

    containerDetailPage.insertAdjacentHTML('beforeend', html);
}

//BORDERING COUNTRY CREATION FUNCTION
function createBorderingCountries(numberOfBordering, borderingCountry){
    try{
        const bordersContainer = document.querySelector('.data__bordering');
        for (let i = 0; i < numberOfBordering; i++) {
            const borderCountry = `
                    <div class="bordering bordering__${i}">${borderingCountry[i]}</div>
            `;
            bordersContainer.insertAdjacentHTML('beforebegin', borderCountry)
        }
    } catch(err){
        console.log(err)
    }
}

// GETTING DETAILED DATA
async function getDetailedData(country){
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    const [data] = await res.json();
    console.log(data);
    const currencies = Object.values(data.currencies).map(currency => currency.name);
    const languages = Object.values(data.languages);
    const nativeName = Object.values(data.name.nativeName).map(obj => obj.common);
    createDetailPage(data.flags.svg, data.name.common, nativeName[0], data.population, data.region, data.capital, data.tld[0], currencies, languages)
    createBorderingCountries(data.borders.length, data.borders);
}

//ADDING EVENT LISTENER TO COUNTRY PREVIEWS
function addFunction(){
    const containerPreviews = document.querySelectorAll('.container__preview');
    containerPreviews.forEach (country => country.addEventListener('click', function() {
        console.log('I have been clicked!' + this.id);
        getDetailedData(this.id)
    }))
}

    //For some reason, if I only use DOMContentload without setTimeOut , it can not find any elements in containerPreviews, so I added this absolutely not elegant SetTimeOut solution
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        addFunction();
    }, 2000);
    
})

// BACK BUTTON FUNCTIONALITY
buttonBack.addEventListener('click', function() {
    containerDetailPage.removeChild(containerDetailPage.children[1]);  
    containerDetailPage.classList.add('hidden');
    containerFrontPage.classList.remove('hidden');
    inputContainer.classList.remove('hidden');
    dropdown.classList.remove('hidden');
})