let pouzitiPtaci = [];
let aktualniPtak = null;
let skore = 0;
let cisloOtazky = 0;
const celkemOtazek = 10;

const uvodniObrazovka = document.getElementById("uvodni-obrazovka");
const herniObrazovka = document.getElementById("herni-obrazovka");
const konecnaObrazovka = document.getElementById("konecna-obrazovka");
const zdrojeModal = document.getElementById("zdroje-modal");

const btnStart = document.getElementById("btn-start");
const btnPrehrat = document.getElementById("btn-prehrat");
const odpovediBox = document.getElementById("odpovedi-box");
const vysledekOtazky = document.getElementById("vysledek-otazky");
const zpravaVysledek = document.getElementById("zprava-vysledek");
const ptakFoto = document.getElementById("ptak-foto");
const ptakNazev = document.getElementById("ptak-nazev");
const btnDalsi = document.getElementById("btn-dalsi");

const spanCisloOtazky = document.getElementById("cislo-otazky");
const spanAktualniSkore = document.getElementById("aktualni-skore");
const konecneSkoreText = document.getElementById("konecne-skore-text");

const btnZnovu = document.getElementById("btn-znovu");
const btnZpetMenu = document.getElementById("btn-zpet-menu");
const btnOtevritZdroje = document.getElementById("btn-otevrit-zdroje");
const btnZavritZdroje = document.getElementById("btn-zavrit-zdroje");
const seznamZdroju = document.getElementById("seznam-zdroju");

function schovejVse() {
    uvodniObrazovka.classList.add("hidden");
    herniObrazovka.classList.add("hidden");
    konecnaObrazovka.classList.add("hidden");
    zdrojeModal.classList.add("hidden");
}

btnStart.addEventListener("click", () => {
    skore = 0;
    cisloOtazky = 0;
    pouzitiPtaci = [];
    schovejVse();
    herniObrazovka.classList.remove("hidden");
    dalsiOtazka();
});

btnZpetMenu.addEventListener("click", () => {
    schovejVse();
    uvodniObrazovka.classList.remove("hidden");
});

btnZnovu.addEventListener("click", () => {
    btnStart.click();
});

btnOtevritZdroje.addEventListener("click", () => {
    naplnZdroje();
    schovejVse();
    zdrojeModal.classList.remove("hidden");
});

btnZavritZdroje.addEventListener("click", () => {
    schovejVse();
    uvodniObrazovka.classList.remove("hidden");
});

function dalsiOtazka() {
    cisloOtazky++;

    if (cisloOtazky > celkemOtazek || pouzitiPtaci.length >= ptaciData.length) {
        ukonciKviz();
        return;
    }

    vysledekOtazky.classList.add("hidden");
    odpovediBox.classList.remove("hidden");
    btnPrehrat.disabled = false;

    spanCisloOtazky.textContent = `Otázka: ${cisloOtazky} / ${celkemOtazek}`;
    spanAktualniSkore.textContent = `Skóre: ${skore}`;

    let dostupniPtaci = ptaciData.filter(p => !pouzitiPtaci.includes(p.id));
    let nahodneCislo = Math.floor(Math.random() * dostupniPtaci.length);
    aktualniPtak = dostupniPtaci[nahodneCislo];

    pouzitiPtaci.push(aktualniPtak.id);

    let ostatniPtaci = ptaciData.filter(p => p.id !== aktualniPtak.id);
    promichejPole(ostatniPtaci);
    let vybraneMoznosti = [aktualniPtak, ostatniPtaci[0], ostatniPtaci[1], ostatniPtaci[2]];
    
    promichejPole(vybraneMoznosti);

    odpovediBox.innerHTML = "";
    vybraneMoznosti.forEach(ptak => {
        let tlacitko = document.createElement("button");
        tlacitko.textContent = ptak.nazev;
        tlacitko.classList.add("btn-odpoved");
        tlacitko.addEventListener("click", () => vyhodnotOdpoved(ptak.id, tlacitko));
        odpovediBox.appendChild(tlacitko);
    });
}

btnPrehrat.addEventListener("click", () => {
    let audio = new Audio(aktualniPtak.audio);
    audio.play().catch(error => {
        alert("Zvukový soubor se nepodařilo přehrát. Zkontrolujte složku 'audio' a název souboru.");
    });
});

function vyhodnotOdpoved(zvoleneId, tlacitko) {
    let všechnaTlacitka = odpovediBox.querySelectorAll("button");
    všechnaTlacitka.forEach(btn => btn.disabled = true);
    btnPrehrat.disabled = true;

    let jeSpravne = (zvoleneId === aktualniPtak.id);

    if (jeSpravne) {
        skore++;
        tlacitko.classList.add("spravne");
        zpravaVysledek.textContent = "Správně! Výborně!";
        zpravaVysledek.className = "zprava ok";
    } else {
        tlacitko.classList.add("spatne");
        zpravaVysledek.textContent = "Bohužel, to je špatně.";
        zpravaVysledek.className = "zprava chyba";
        
        všechnaTlacitka.forEach(btn => {
            if (btn.textContent === aktualniPtak.nazev) {
                btn.classList.add("spravne");
            }
        });
    }

    spanAktualniSkore.textContent = `Skóre: ${skore}`;

    ptakFoto.src = aktualniPtak.foto;
    ptakNazev.textContent = aktualniPtak.nazev;

    setTimeout(() => {
        vysledekOtazky.classList.remove("hidden");
    }, 400);
}

btnDalsi.addEventListener("click", () => {
    dalsiOtazka();
});

function ukonciKviz() {
    schovejVse();
    konecnaObrazovka.classList.remove("hidden");
    konecneSkoreText.textContent = `Získali jste ${skore} bodů z ${celkemOtazek} možných!`;
}

function promichejPole(pole) {
    for (let i = pole.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [pole[i], pole[j]] = [pole[j], pole[i]];
    }
}

function naplnZdroje() {
    seznamZdroju.innerHTML = "";
    ptaciData.forEach(ptak => {
        let polozka = document.createElement("div");
        polozka.classList.add("zdroj-polozka");
        polozka.innerHTML = `<strong>${ptak.nazev}</strong><br>
                             Autor foto: ${ptak.autorFoto} (${ptak.licenceFoto})`;
        seznamZdroju.appendChild(polozka);
    });
}
