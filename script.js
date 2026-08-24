const R = 8.314462618; // J mol−1 K−1
const temperatureSteps = [50, 40, 30, 20, 10, 0, -10, -20, -30, -40, -50, -60, -70, -80];

const toKelvin = (celsius) => celsius + 273.15;
const number = (value, decimals = 2) => Number(value).toLocaleString('ja-JP', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

function deltaGFromEe(eePercent, temperatureC) {
  const ee = eePercent / 100;
  return R * toKelvin(temperatureC) * Math.log((1 + ee) / (1 - ee));
}

function eeFromDeltaG(deltaGJ, temperatureC) {
  return Math.tanh(deltaGJ / (2 * R * toKelvin(temperatureC))) * 100;
}

function ratioFromEe(eePercent) {
  const ratio = (1 + eePercent / 100) / (1 - eePercent / 100);
  return ratio >= 10000 ? '＞10,000 : 1' : `${number(ratio, ratio < 10 ? 2 : 1)} : 1`;
}

function showError(element, message, unit) {
  element.innerHTML = `<span>${message}</span><strong>—</strong><small>${unit}</small>`;
}

document.querySelector('#ee-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const temperature = Number(document.querySelector('#reference-temperature').value);
  const ee = Number(document.querySelector('#reference-ee').value);
  const result = document.querySelector('#ee-result');
  if (!Number.isFinite(temperature) || !Number.isFinite(ee) || ee < 0 || ee >= 100 || toKelvin(temperature) <= 0) {
    showError(result, '入力を確認してください', '');
    return;
  }
  const deltaG = deltaGFromEe(ee, temperature);
  result.innerHTML = `<span>ΔΔG</span><strong>${number(deltaG / 1000, 3)}</strong><small>kJ mol<sup>−1</sup></small>`;
  document.querySelector('#delta-g').value = (deltaG / 1000).toFixed(3);
  renderTemperatureTable(deltaG);
});

document.querySelector('#g-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const deltaG = Number(document.querySelector('#delta-g').value);
  const temperature = Number(document.querySelector('#target-temperature').value);
  const result = document.querySelector('#g-result');
  if (!Number.isFinite(deltaG) || deltaG < 0 || !Number.isFinite(temperature) || toKelvin(temperature) <= 0) {
    showError(result, '入力を確認してください', '%');
    return;
  }
  result.innerHTML = `<span>予測 ee</span><strong>${number(eeFromDeltaG(deltaG * 1000, temperature), 2)}</strong><small>%</small>`;
});

function renderTemperatureTable(deltaG) {
  const rows = temperatureSteps.map((temperature) => {
    const ee = eeFromDeltaG(deltaG, temperature);
    return `<tr><td>${temperature}</td><td>${number(toKelvin(temperature), 2)}</td><td>${number(ee, 2)}</td><td>${ratioFromEe(ee)}</td></tr>`;
  }).join('');
  document.querySelector('#temperature-table').innerHTML = rows;
  document.querySelector('#table-description').textContent = `ΔΔG = ${number(deltaG / 1000, 3)} kJ mol⁻¹ として計算`;
}

document.querySelector('#ee-form').requestSubmit();
document.querySelector('#g-form').requestSubmit();
