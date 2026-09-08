const grounds = [
  { id: 1, name: "Стадион Краснодар", lat: 45.030473, lng: 38.975586, district: "Центральный", sport: "football" },
  { id: 2, name: "Площадка для баскетбола в парке Кубанского", lat: 45.031235, lng: 38.981625, district: "Западный", sport: "basketball" },
  { id: 3, name: "Футбольное поле в парке Чистяковская роща", lat: 45.036473, lng: 38.974828, district: "Центральный", sport: "football" },
  { id: 4, name: "Площадка для скейтбординга на улице Красной", lat: 45.025473, lng: 38.974512, district: "Западный", sport: "skateplaza" },
  { id: 5, name: "Тренажерный зал в парке Горького", lat: 45.040473, lng: 38.967586, district: "Южный", sport: "fitness" },
  { id: 6, name: "Площадка для баскетбола в парке Победы", lat: 45.05289, lng: 38.981084, district: "Южный", sport: "basketball" },
  { id: 7, name: "Футбольное поле в парке 30-летия Победы", lat: 45.040213, lng: 38.957347, district: "Карсунский", sport: "football" },
  { id: 8, name: "Скейтплощадка в парке Чистяковская роща", lat: 45.046223, lng: 38.976228, district: "Центральный", sport: "skateplaza" },
  { id: 9, name: "Тренажерный зал в парке Таганай", lat: 45.036792, lng: 38.965337, district: "Западный", sport: "fitness" },
  { id: 10, name: "Баскетбольная площадка в районе ТЦ Галерея", lat: 45.044712, lng: 38.970684, district: "Южный", sport: "basketball" },
  { id: 11, name: "Футбольное поле на улице Ленина", lat: 45.029098, lng: 38.987098, district: "Западный", sport: "football" },
  { id: 12, name: "Баскетбольная площадка в парке Победы", lat: 45.049234, lng: 38.951234, district: "Карсунский", sport: "basketball" },
  { id: 13, name: "Скейтплощадка в районе ТЦ Краснодар", lat: 45.034789, lng: 38.972384, district: "Центральный", sport: "skateplaza" },
  { id: 14, name: "Футбольное поле в районе рынка Южный", lat: 45.042186, lng: 38.956948, district: "Южный", sport: "football" },
  { id: 15, name: "Тренажерный зал на улице Бульварной", lat: 45.026982, lng: 38.983255, district: "Карсунский", sport: "fitness" },
  { id: 16, name: "Баскетбольная площадка в парке Чистяковская роща", lat: 45.034567, lng: 38.963945, district: "Центральный", sport: "basketball" },
  { id: 17, name: "Площадка для скейтбординга в парке Краснодарский", lat: 45.046349, lng: 38.979512, district: "Западный", sport: "skateplaza" },
  { id: 18, name: "Футбольное поле в районе микрорайона Речной", lat: 45.030181, lng: 38.960013, district: "Южный", sport: "football" },
  { id: 19, name: "Скейтплощадка на улице Виноградной", lat: 45.034812, lng: 38.993055, district: "Карсунский", sport: "skateplaza" },
  { id: 20, name: "Тренажерный зал в парке Школы №23", lat: 45.024455, lng: 38.94822, district: "Западный", sport: "fitness" }
];

const sportMeta = {
  all: { label: "Все" },
  football: { label: "Футбол" },
  basketball: { label: "Баскетбол" },
  skateplaza: { label: "Скейт" },
  fitness: { label: "Воркаут" }
};

const state = {
  district: "all",
  query: "",
  selectedId: grounds[0]?.id ?? null,
  sport: "all"
};

let map;
let markersLayer;
let markerById = new Map();

const dom = {};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalize(value) {
  return String(value ?? "").trim().toLocaleLowerCase("ru-RU");
}

function getFilteredGrounds() {
  const query = normalize(state.query);

  return grounds.filter((ground) => {
    const sportMatches = state.sport === "all" || ground.sport === state.sport;
    const districtMatches = state.district === "all" || ground.district === state.district;
    const text = `${ground.name} ${ground.district} ${sportMeta[ground.sport]?.label}`;
    const textMatches = !query || normalize(text).includes(query);

    return sportMatches && districtMatches && textMatches;
  });
}

function getSelectedGround(visibleGrounds) {
  return visibleGrounds.find((ground) => ground.id === state.selectedId) ?? visibleGrounds[0] ?? null;
}

function syncSelectedGround(visibleGrounds) {
  const selected = getSelectedGround(visibleGrounds);
  state.selectedId = selected?.id ?? null;
  return selected;
}

function createMarkerIcon(ground, isSelected) {
  const sport = escapeHtml(ground.sport);

  return L.divIcon({
    className: "sport-marker",
    html: `<span class="marker-dot ${sport}${isSelected ? " is-selected" : ""}"></span>`,
    iconSize: isSelected ? [24, 24] : [18, 18],
    iconAnchor: isSelected ? [12, 12] : [9, 9],
    popupAnchor: [0, -12]
  });
}

function getRouteUrl(ground) {
  return `https://yandex.ru/maps/?rtext=~${ground.lat},${ground.lng}&rtt=auto`;
}

function renderSportTabs() {
  dom.sportTabs.innerHTML = Object.entries(sportMeta).map(([sport, meta]) => `
    <button class="sport-tab${state.sport === sport ? " is-active" : ""}" type="button" data-sport="${escapeHtml(sport)}" role="tab" aria-selected="${state.sport === sport}">
      <span class="sport-dot ${escapeHtml(sport)}"></span>
      ${escapeHtml(meta.label)}
    </button>
  `).join("");

  dom.sportTabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.sport = button.dataset.sport;
      render({ fitBounds: true });
    });
  });
}

function renderDistrictSelect() {
  const districts = [...new Set(grounds.map((ground) => ground.district))].sort((a, b) => a.localeCompare(b, "ru"));
  dom.districtSelect.innerHTML = [
    `<option value="all">Все районы</option>`,
    ...districts.map((district) => `<option value="${escapeHtml(district)}">${escapeHtml(district)}</option>`)
  ].join("");
  dom.districtSelect.value = state.district;
}

function popupHtml(ground) {
  const sportLabel = sportMeta[ground.sport]?.label ?? "Другое";

  return `
    <p class="popup-title">${escapeHtml(ground.name)}</p>
    <p class="popup-meta">${escapeHtml(sportLabel)} · ${escapeHtml(ground.district)}</p>
  `;
}

function renderMarkers(visibleGrounds) {
  markersLayer.clearLayers();
  markerById = new Map();

  visibleGrounds.forEach((ground) => {
    const marker = L.marker([ground.lat, ground.lng], {
      icon: createMarkerIcon(ground, ground.id === state.selectedId),
      title: ground.name
    });

    marker.bindPopup(popupHtml(ground), {
      closeButton: false,
      className: "ground-popup",
      maxWidth: 280
    });

    marker.on("click", () => {
      state.selectedId = ground.id;
      render({ panToSelected: true });
    });

    marker.addTo(markersLayer);
    markerById.set(ground.id, marker);
  });
}

function renderStats(visibleGrounds) {
  dom.shownCount.textContent = visibleGrounds.length;
  dom.districtCount.textContent = new Set(visibleGrounds.map((ground) => ground.district)).size;
  dom.sportCount.textContent = new Set(visibleGrounds.map((ground) => ground.sport)).size;
  dom.listHint.textContent = `${visibleGrounds.length} из ${grounds.length}`;
}

function renderList(visibleGrounds) {
  if (!visibleGrounds.length) {
    dom.locationList.innerHTML = `<div class="empty-state">Ничего не найдено.</div>`;
    return;
  }

  dom.locationList.innerHTML = visibleGrounds.map((ground) => {
    const sportLabel = sportMeta[ground.sport]?.label ?? "Другое";
    const selectedClass = ground.id === state.selectedId ? " is-selected" : "";

    return `
      <button class="location-row${selectedClass}" type="button" data-id="${ground.id}">
        <span class="row-icon"><span class="sport-dot ${escapeHtml(ground.sport)}"></span></span>
        <span>
          <strong>${escapeHtml(ground.name)}</strong>
          <span>${escapeHtml(ground.district)}</span>
          <small>${escapeHtml(sportLabel)}</small>
        </span>
      </button>
    `;
  }).join("");

  dom.locationList.querySelectorAll(".location-row").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedId = Number(button.dataset.id);
      render({ panToSelected: true });
    });
  });
}

function renderDetails(ground) {
  if (!ground) {
    dom.detailPanel.innerHTML = `
      <h2>Площадка не выбрана</h2>
      <p class="detail-meta">Измените фильтры или поиск.</p>
    `;
    return;
  }

  const sportLabel = sportMeta[ground.sport]?.label ?? "Другое";
  const coords = `${ground.lat.toFixed(6)}, ${ground.lng.toFixed(6)}`;

  dom.detailPanel.innerHTML = `
    <h2>${escapeHtml(ground.name)}</h2>
    <p class="detail-meta">${escapeHtml(sportLabel)} · ${escapeHtml(ground.district)} · ${coords}</p>
    <div class="detail-actions">
      <a class="primary-action" href="${getRouteUrl(ground)}" target="_blank" rel="noreferrer">
        <i data-lucide="navigation" aria-hidden="true"></i>
        Маршрут
      </a>
      <button type="button" id="copyCoordsButton">
        <i data-lucide="copy" aria-hidden="true"></i>
        Координаты
      </button>
    </div>
  `;

  dom.detailPanel.querySelector("#copyCoordsButton")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(coords);
      dom.detailPanel.querySelector("#copyCoordsButton").lastChild.textContent = " Скопировано";
    } catch {
      window.prompt("Координаты площадки", coords);
    }
  });
}

function fitVisibleGrounds(visibleGrounds) {
  if (!visibleGrounds.length) return;

  const bounds = L.latLngBounds(visibleGrounds.map((ground) => [ground.lat, ground.lng]));
  map.fitBounds(bounds.pad(0.16), {
    animate: true,
    maxZoom: 14
  });
}

function openSelectedMarker(selectedGround, panToSelected) {
  if (!selectedGround) return;

  const marker = markerById.get(selectedGround.id);
  if (!marker) return;

  if (panToSelected) {
    map.panTo([selectedGround.lat, selectedGround.lng], { animate: true });
  }

  marker.openPopup();
}

function render(options = {}) {
  const visibleGrounds = getFilteredGrounds();
  const selectedGround = syncSelectedGround(visibleGrounds);

  renderSportTabs();
  renderMarkers(visibleGrounds);
  renderStats(visibleGrounds);
  renderList(visibleGrounds);
  renderDetails(selectedGround);

  if (options.fitBounds) {
    fitVisibleGrounds(visibleGrounds);
  }

  openSelectedMarker(selectedGround, options.panToSelected);
  window.lucide?.createIcons();
}

function bindControls() {
  dom.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    render({ fitBounds: true });
  });

  dom.districtSelect.addEventListener("change", (event) => {
    state.district = event.target.value;
    render({ fitBounds: true });
  });

  dom.resetButton.addEventListener("click", () => {
    state.query = "";
    state.district = "all";
    state.sport = "all";
    state.selectedId = grounds[0]?.id ?? null;
    dom.searchInput.value = "";
    dom.districtSelect.value = "all";
    render({ fitBounds: true, panToSelected: true });
  });
}

function initMap() {
  map = L.map("map", {
    zoomControl: false,
    scrollWheelZoom: true
  }).setView([45.036, 38.973], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  L.control.zoom({ position: "bottomright" }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
}

document.addEventListener("DOMContentLoaded", () => {
  Object.assign(dom, {
    detailPanel: document.querySelector("#detailPanel"),
    districtCount: document.querySelector("#districtCount"),
    districtSelect: document.querySelector("#districtSelect"),
    listHint: document.querySelector("#listHint"),
    locationList: document.querySelector("#locationList"),
    resetButton: document.querySelector("#resetButton"),
    searchInput: document.querySelector("#searchInput"),
    shownCount: document.querySelector("#shownCount"),
    sportCount: document.querySelector("#sportCount"),
    sportTabs: document.querySelector("#sportTabs")
  });

  renderDistrictSelect();
  bindControls();
  initMap();
  render({ fitBounds: true });
});
