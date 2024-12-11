// Selektujemo HTML elemente
const searchInput = document.getElementById('search');
const dropdownMenu = document.getElementById('dropdown-menu');
const searchButton = document.getElementById('searchButton');
// Promenljive za čuvanje izabrane države
let selectedCountry = ''; // promenljiva za čuvanje izabrane države

// Kada korisnik unese tekst u input polje
searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();

  // Ako je unos kraći od 2 slova, sakrij meni
  if (query.length < 2) {
    dropdownMenu.classList.remove('visible');
    return;
  }

  try {
    // Poziv API-ja
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${query}`
    );
    const data = await response.json();

    // Očistimo meni pre nego što dodamo nove rezultate
    dropdownMenu.innerHTML = '';

    if (data.results && data.results.length > 0) {
      // Popunjavanje padajućeg menija
      data.results.forEach(location => {
        const item = document.createElement('div');
        item.classList.add('dropdown-item');
        item.textContent = `${location.country}`;

        item.addEventListener('click', () => {
          selectedCountry = location.country; // Čuvanje izabrane države
          searchInput.value = location.country; // Prikazivanje izabrane države u inputu
          dropdownMenu.classList.remove('visible'); // Sakrivanje padajućeg menija
        });

        // Dodajemo grad u meni
        dropdownMenu.appendChild(item);
      });

      // Prikazujemo padajući meni
      dropdownMenu.classList.add('visible');
    } else {
      dropdownMenu.classList.remove('visible');
    }
  } catch (error) {
    console.error('Greška prilikom poziva API-ja:', error);
  }
});

// Pomjerite listener izvan `forEach`
searchButton.addEventListener('click', function (e) {
  e.preventDefault();
  sendToAnotherApi(selectedCountry);
});

// Funkcija za slanje podataka u drugi API
async function sendToAnotherApi(country) {
  if (country) {
    try {
      const response = await fetch(
        `http://universities.hipolabs.com/search?country=${country}`
      );
      const data = await response.json();
      // Ovdje obradite podatke koje ste dobili iz drugog API-ja
      console.log(data);
    } catch (error) {
      console.error('Greška prilikom poziva drugog API-ja:', error);
    }
  } else {
    console.warn('Država nije izabrana.');
  }
}

// Zatvaramo padajući meni kada kliknemo izvan njega
document.addEventListener('click', e => {
  if (!e.target.closest('.search-container')) {
    dropdownMenu.classList.remove('visible');
  }
});
