let pouzitiPtaci = [];
let aktualniPtak = null;
let skore = 0;
let cisloOtazky = 0;
const celkemOtazek = 10;
let aktivniAudio = null;

// Proměnné pro režim „Poznávej“ (procházení katalogu)
let indexPoznavej = 0;

// Odkazy na prvky na stránce
const uvodniObrazovka = document.getElementById("uvodni-obrazovka");
const herniObrazovka = document.getElementById("herni-obrazovka");
const konecnaObrazovka = document.getElementById("konecna-obrazovka");
const poznavejObrazovka = document.getElementById("poznavej-obrazovka"); // Nová obrazovka pro poznávání
const zdrojeModal = document.getElementById("zdroje-modal");

const btnStart = document.getElementById("btn-start");
const btnPoznavejMenu = document.getElementById("btn-poznavej-menu"); // Tlačítko v menu
const btnPrehrat = document.getElementById("btn-prehrat");
const odpovediBox = document.getElementById("odpovedi-box");
const vysledekOtazky = document.getElementById("vysledek-otazky");
const zpravaVysledek = document.getElementById("zprava-vysledek");
const ptakFoto = document.getElementById("ptak-foto");
const ptakNazev = document.getElementById("ptak-nazev");
const btnDalsi = document.getElementById("btn-dalsi");

// Prvky pro režim Poznávej
const poznavejFoto = document.getElementById("poznavej-foto");
const poznavejNazev = document.getElementById("poznavej-nazev");
const poznavejInfoZdroje = document.getElementById("poznavej-info-zdroje");
const btnPoznavejAudio = document.getElementById("btn-poznavej-audio");
const btnPoznavejPredchozi = document.getElementById("btn-poznavej-predchozi");
const btnPoznavejDalsi = document.getElementById("btn-poznavej-dalsi");
const btnPoznavejZpet = document.getElementById("btn-poznavej-zpet");

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
    if (poznavejObrazovka) poznavejObrazovka.classList.add("hidden");
    zdrojeModal.classList.add("hidden");
}

// Spuštění testu (kvízu)
btnStart.addEventListener("click", () => {
    skore = 0;
    cisloOtazky = 0;
    pouzitiPtaci = [];
    schovejVse();
    herniObrazovka.classList.remove("hidden");
    dalsiOtazka();
});

// Spuštění režimu „Poznávej“
if (btnPoznavejMenu) {
    btnPoznavejMenu.addEventListener("click", () => {
        zastavAudio();
        indexPoznavej = 0;
        schovejVse();
        poznavejObrazovka.classList.remove("hidden");
        aktualizujPoznavejKarta();
    });
}

if (btnPoznavejZpet) {
    btnPoznavejZpet.addEventListener("click", () => {
        zastavAudio();
        schovejVse();
        uvodniObrazovka.classList.remove("hidden");
    });
}

btnZpetMenu.addEventListener("click", () => {
    zastavAudio();
    schovejVse();
    uvodniObrazovka.classList.remove("hidden");
});

btnZnovu.addEventListener("click", () => {
    btnStart.click();
});

btnOtevritZdroje.addEventListener("click", () => {
    zastavAudio();
    naplnZdroje();
    schovejVse();
    zdrojeModal.classList.remove("hidden");
});

btnZavritZdroje.addEventListener("click", () => {
    schovejVse();
    uvodniObrazovka.classList.remove("hidden");
});

// Pomocná funkce pro bezpečné zastavení audia
function zastavAudio() {
    if (aktivniAudio) {
        aktivniAudio.pause();
        aktivniAudio.currentTime = 0;
        aktivniAudio = null;
    }
}

// --- LOGIKA PRO REŽIM „POZNÁVEJ“ ---
function aktualizujPoznavejKarta() {
    zastavAudio();
    let ptak = ptaciData[indexPoznavej];

    poznavejFoto.src = ptak.foto;
    poznavejNazev.textContent = `${indexPoznavej + 1}. ${ptak.nazev}`;
    poznavejInfoZdroje.textContent = `Foto: ${ptak.autorFoto} (${ptak.licenceFoto})`;
}

if (btnPoznavejDalsi) {
    btnPoznavejDalsi.addEventListener("click", () => {
        indexPoznavej = (indexPoznavej + 1) % ptaciData.length;
        aktualizujPoznavejKarta();
    });
}

if (btnPoznavejPredchozi) {
    btnPoznavejPredchozi.addEventListener("click", () => {
        indexPoznavej = (indexPoznavej - 1 + ptaciData.length) % ptaciData.length;
        aktualizujPoznavejKarta();
    });
}

if (btnPoznavejAudio) {
    btnPoznavejAudio.addEventListener("click", () => {
        zastavAudio();
        let ptak = ptaciData[indexPoznavej];
        aktivniAudio = new Audio(ptak.audio);
        aktivniAudio.addEventListener('loadedmetadata', () => {
            aktivniAudio.currentTime = 0.5;
        });
        aktivniAudio.play().catch(error => {
            alert("Zvukový soubor se nepodařilo přehrát.");
        });
    });
}

// --- LOGIKA PRO HLAVNÍ KVÍZ (TEST) ---
function dalsiOtazka() {
    zastavAudio();

    cisloOtazky++;

    if (cisloOtazky > celkemOtazek || pouzitiPtaci.length >= ptaciData.length) {
        ukonciKviz();
        return;
    }

    vysledekOtazky.classList.add("hidden");
    odpovediBox.classList.remove("hidden");
    btnPrehrat.disabled = false;

    spanCisloOtazky.textContent = `Pták ${cisloOtazky} / ${celkemOtazek}`;
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
    zastavAudio();

    aktivniAudio = new Audio(aktualniPtak.audio);
    
    aktivniAudio.addEventListener('loadedmetadata', () => {
        aktivniAudio.currentTime = 0.5;
    });

    aktivniAudio.play().catch(error => {
        alert("Zvukový soubor se nepodařilo přehrát.");
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
        zpravaVysledek.innerHTML = "✓ Správně!";
        zpravaVysledek.className = "zprava ok";
    } else {
        tlacitko.classList.add("spatne");
        zpravaVysledek.innerHTML = `✗ To není on. Správná odpověď je <strong>${aktualniPtak.nazev}</strong>.`;
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
    zastavAudio();
    schovejVse();
    konecnaObrazovka.classList.remove("hidden");

    let titul = "";
    let popis = "";

    if (skore <= 3) {
        titul = "Začínající ornitolog";
        popis = "S ptačí říší se teprve seznamuješ. Zkus si projít režim „Poznávej“ a zkus to znovu!";
    } else if (skore <= 6) {
        titul = "Pozorný posluchač";
        popis = "Máš dobrý sluch a základní přehled o našich běžných druzích ptáků.";
    } else if (skore <= 8) {
        titul = "Ptačí znalec";
        popis = "Skvělý výsledek. Ptačí hlasy ti nejsou cizí a v terénu se hned tak neztratíš.";
    } else {
        titul = "Mistr ptačích hlasů";
        popis = "Absolutní špička. Sluchovou zkoušku jsi zvládl/a s naprostým přehledem.";
    }

    konecneSkoreText.innerHTML = `
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-bottom: 5px;">${skore} / ${celkemOtazek}</div>
        <div style="font-size: 1.2rem; font-weight: 600; color: var(--text-main); margin: 10px 0;">${titul} 🦉</div>
        <div style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.4;">${popis}</div>
    `;
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
                             Autor foto: ${ptak.autorFoto}<br>
                             Licence: ${ptak.licenceFoto}`;
        seznamZdroju.appendChild(polozka);
    });
}
