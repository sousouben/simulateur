/* ---------- Data model: template lists ---------- */
const startupItems = [
  { key: "frais_etab", label: "Frais d’établissement", value: 0 },
  {
    key: "ouverture_compteurs",
    label: "Frais ouverture compteurs",
    value: 0,
  },
  { key: "logiciels_form", label: "Logiciels, formations", value: 0 },
  { key: "depot_marque", label: "Dépôt marque / brevet", value: 0 },
  {
    key: "droits_entree",
    label: "Droits d’entrée (franchise, etc.)",
    value: 0,
  },
  {
    key: "achat_fonds",
    label: "Achat fonds de commerce / parts",
    value: 0,
  },
  { key: "droit_bail", label: "Droit au bail", value: 0 },
  { key: "caution", label: "Caution / dépôt de garantie", value: 0 },
  { key: "frais_dossier", label: "Frais de dossier", value: 0 },
  { key: "frais_notaires", label: "Frais notaire / avocat", value: 0 },
  { key: "enseigne", label: "Enseigne & communication", value: 0 },
  { key: "achat_immo", label: "Achat immobilier", value: 0 },
  { key: "travaux", label: "Travaux et aménagements", value: 0 },
  { key: "materiel", label: "Matériel (outillage, machines)", value: 0 },
  { key: "materiel_bureau", label: "Matériel de bureau", value: 0 },
  { key: "stock_matiere", label: "Stock matières & produits", value: 0 },
];

const financingItems = [
  { key: "apport_perso", label: "Apport personnel / familial", value: 0 },
  {
    key: "apport_en_nature",
    label: "Apports en nature (valeur)",
    value: 0,
  },
  { key: "pret1", label: "Prêt n°1 (banque)", value: 0 },
  { key: "pret2", label: "Prêt n°2 (banque)", value: 0 },
  { key: "subv1", label: "Subvention n°1", value: 0 },
  { key: "subv2", label: "Subvention n°2", value: 0 },
  { key: "autre_fin", label: "Autre financement", value: 0 },
];

const fixedCharges = [
  { key: "assurances", label: "Assurances", value: 0 },
  { key: "telephone", label: "Téléphone / internet", value: 0 },
  { key: "abonnements", label: "Autres abonnements", value: 0 },
  { key: "carburant", label: "Carburant / transports", value: 0 },
  {
    key: "frais_depl",
    label: "Frais déplacement / hébergement",
    value: 0,
  },
  { key: "eau_elec", label: "Eau / électricité / gaz", value: 0 },
  { key: "mutuelle", label: "Mutuelle", value: 0 },
  { key: "fourn_div", label: "Fournitures diverses", value: 0 },
  { key: "entretien", label: "Entretien matériel / vêtements", value: 0 },
  { key: "nettoyage", label: "Nettoyage locaux", value: 0 },
  { key: "pub", label: "Budget publicité / com", value: 0 },
  { key: "loyer", label: "Loyer & charges locatives", value: 0 },
  { key: "expert", label: "Expert comptable / avocats", value: 0 },
  { key: "frais_banc", label: "Frais bancaires & TPE", value: 0 },
  { key: "taxes", label: "Taxes (CFE, autres)", value: 0 },
];

/* ---------- DOM injection helpers ---------- */
function makeNumberInput(id, value = 0, placeholder = "0") {
  const inp = document.createElement("input");
  inp.type = "number";
  inp.min = 0;
  inp.value = value;
  inp.id = id;
  inp.placeholder = placeholder;
  inp.addEventListener("input", onInputChange);
  return inp;
}

/* populate startup list */
const startupEl = document.getElementById("startup-list");
startupItems.forEach((item) => {
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `<div style="min-width:200px"><label class="small">${item.label}</label></div>`;
  const inp = makeNumberInput(item.key, item.value);
  row.appendChild(inp);
  startupEl.appendChild(row);
});

/* populate financing list */
const finEl = document.getElementById("financing-list");
financingItems.forEach((item) => {
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `<div style="min-width:200px"><label class="small">${item.label}</label></div>`;
  const inp = makeNumberInput(item.key, item.value);
  row.appendChild(inp);
  finEl.appendChild(row);
});

/* populate fixed charges */
const fixedEl = document.getElementById("fixed-list");
fixedCharges.forEach((item) => {
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `<div style="min-width:200px"><label class="small">${item.label}</label></div>`;
  const inp = makeNumberInput(item.key, item.value);
  row.appendChild(inp);
  fixedEl.appendChild(row);
});

/* populate months tables for goods & services */
function makeMonthRow(prefix, monthIndex) {
  const row = document.createElement("div");
  row.className = "row";
  const label = document.createElement("div");
  label.innerHTML = `<label class="small">Mois ${monthIndex}</label>`;
  const days = makeNumberInput(
    `${prefix}_d_${monthIndex}`,
    20,
    "jours travaillés"
  );
  const avg = makeNumberInput(
    `${prefix}_a_${monthIndex}`,
    0,
    "CA moyen / jour €"
  );
  row.appendChild(label);
  row.appendChild(days);
  row.appendChild(avg);
  return row;
}
const goodsEl = document.getElementById("months-goods");
const servEl = document.getElementById("months-services");
for (let m = 1; m <= 12; m++) {
  goodsEl.appendChild(makeMonthRow("g", m));
  servEl.appendChild(makeMonthRow("s", m));
}

/* ---------- Calculation logic ---------- */
function readNumber(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  const v = parseFloat(el.value);
  return isNaN(v) ? 0 : v;
}

function sumKeys(list) {
  return list.reduce((acc, item) => acc + readNumber(item.key), 0);
}

function sumFixed() {
  return fixedCharges.reduce((acc, item) => acc + readNumber(item.key), 0);
}

function annualSalesFor(prefix) {
  // prefix 'g' or 's'
  let total = 0;
  for (let m = 1; m <= 12; m++) {
    const days = readNumber(`${prefix}_d_${m}`);
    const avg = readNumber(`${prefix}_a_${m}`);
    total += days * avg;
  }
  return total;
}

function computeAll() {
  // totals
  const total_start = sumKeys(startupItems);
  const total_fin = sumKeys(financingItems) + readNumber("treasury_start"); // include treasury input as available cash
  const gap = total_start - total_fin;

  // sales
  const sales_g = annualSalesFor("g");
  const sales_s = annualSalesFor("s");
  const sales_y1 = sales_g + sales_s;

  const growth12 = readNumber("growth12") / 100;
  const growth23 = readNumber("growth23") / 100;
  const sales_y2 = sales_y1 * (1 + growth12);
  const sales_y3 = sales_y2 * (1 + growth23);

  // variable costs
  const cogs_pct = readNumber("cogs") / 100;
  const var_costs = sales_g * cogs_pct; // only merchandise concern goods

  // amortissement
  const amort_year = total_start / Math.max(1, readNumber("amort"));

  // fixed + salaries
  const fixed_year = sumFixed();
  const salaires = readNumber("salaires");
  const rem_dir = readNumber("rem_dir");
  const fixed_plus_sal = fixed_year + salaires + rem_dir;

  // net profit approx = sales - var_costs - fixed_plus_sal - amort_year
  const net_profit = sales_y1 - var_costs - fixed_plus_sal - amort_year;

  // BFR estimate:
  const ar_days = readNumber("ar_days");
  const ap_days = readNumber("ap_days");
  const stock_init = readNumber("stock_init");

  // BFR = (AR_days - AP_days)/365 * sales + stock initial (if positive)
  const bfr = ((ar_days - ap_days) / 365) * sales_y1 + stock_init;
  // available cash (apport + treasury start + other financings)
  const cash_available = sumKeys(financingItems) + readNumber("treasury_start");

  // cash need = total_start + BFR (we assume need to fund both)
  const cash_need = total_start + Math.max(0, bfr);

  // treasury adequacy
  const treasury_ok = cash_available >= cash_need ? true : false;

  // rentability simple rule
  const rentable = net_profit > 0;

  return {
    total_start,
    total_fin,
    gap,
    sales_y1,
    sales_y2,
    sales_y3,
    var_costs,
    amort_year,
    fixed_plus_sal,
    net_profit,
    bfr,
    cash_need,
    cash_available,
    treasury_ok,
    rentable,
  };
}

/* ---------- UI update ---------- */
function format(n) {
  const sign = n < 0 ? "-" : "";
  const v = Math.abs(n);
  return (
    sign +
    v.toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) +
    " €"
  );
}

function render() {
  const r = computeAll();
  document.getElementById("total_start").textContent = format(r.total_start);
  document.getElementById("total_fin").textContent = format(r.total_fin);
  document.getElementById("gap_fin").textContent = format(r.gap);
  document.getElementById("sales_y1").textContent = format(r.sales_y1);
  document.getElementById("sales_y2").textContent = format(r.sales_y2);
  document.getElementById("sales_y3").textContent = format(r.sales_y3);
  document.getElementById("var_costs").textContent = format(r.var_costs);
  document.getElementById("amort_year").textContent = format(r.amort_year);
  document.getElementById("fixed_plus_sal").textContent = format(
    r.fixed_plus_sal
  );
  document.getElementById("net_profit").textContent = format(r.net_profit);
  document.getElementById("bfr").textContent = format(r.bfr);
  document.getElementById("cash_need").textContent = format(r.cash_need);
  document.getElementById("cash_available").textContent = format(
    r.cash_available
  );

  const rentBadge = document.getElementById("rentability_badge");
  rentBadge.textContent = r.rentable
    ? "Rentable (prévision)"
    : "Non rentable (prévision)";
  rentBadge.className = "badge " + (r.rentable ? "ok" : "ko");

  const treasBadge = document.getElementById("treasury_badge");
  treasBadge.textContent = r.treasury_ok
    ? "Trésorerie adéquate"
    : "Trésorerie insuffisante";
  treasBadge.className = "badge " + (r.treasury_ok ? "ok" : "ko");

  return r;
}

/* ---------- Events & export ---------- */
function onInputChange() {
  // auto live update if desired
  // do not flood: we simply re-render
  render();
}

document.getElementById("calcBtn").addEventListener("click", (e) => {
  e.preventDefault();
  render();
  alert("Calcul effectué — consultez le panneau de droite pour les résultats.");
});

document.getElementById("exportJson").addEventListener("click", () => {
  const state = gatherAllInputs();
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "plan_financier.json";
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("exportCsv").addEventListener("click", () => {
  const state = gatherAllInputs();
  // simple CSV flatten: key;value
  let csv = "clé;valeur\\n";
  Object.keys(state.inputs).forEach((k) => {
    csv += `${k};"${String(state.inputs[k])}"\\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "plan_financier.csv";
  a.click();
  URL.revokeObjectURL(url);
});

function gatherAllInputs() {
  const inputs = {};
  // general fields
  [
    "name",
    "project",
    "statut",
    "typeVente",
    "phone",
    "email",
    "ville",
    "amort",
    "treasury_start",
    "growth12",
    "growth23",
    "cogs",
    "ar_days",
    "ap_days",
    "stock_init",
    "salaires",
    "rem_dir",
  ].forEach((k) => {
    inputs[k] = document.getElementById(k)
      ? document.getElementById(k).value
      : "";
  });
  // startup
  startupItems.forEach((i) => (inputs[i.key] = readNumber(i.key)));
  financingItems.forEach((i) => (inputs[i.key] = readNumber(i.key)));
  fixedCharges.forEach((i) => (inputs[i.key] = readNumber(i.key)));
  for (let m = 1; m <= 12; m++) {
    inputs[`g_d_${m}`] = readNumber(`g_d_${m}`);
    inputs[`g_a_${m}`] = readNumber(`g_a_${m}`);
    inputs[`s_d_${m}`] = readNumber(`s_d_${m}`);
    inputs[`s_a_${m}`] = readNumber(`s_a_${m}`);
  }

  const results = computeAll();
  return { inputs, results };
}

/* init render */
render();
