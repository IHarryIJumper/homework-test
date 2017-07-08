"use strict";

var paintData = {
		expenditure: 0.4, // расход литров на метр квадратный
		materials: {
			1: 5, // id товара : объем в упаковке (id=1: 5 литров)
			2: 10,
			67: 15,
			34: 40
		},
		prices: {
			1: { // id товара
				3: 120, // id поставщика: цена за упаковку
				5: 123.45,
				49: 135
			},
			2: {
				3: 240,
				5: 240.80,
				49: 230
			},
			67: {
				3: 340,
				5: 360,
				49: 300.05
			},
			34: {
				3: 1200,
				5: 1050.99,
				49: 1150
			}
		}
	},
	sortedMaterialsKeys = [],
	sellersArray = [],
	optimalPrice = null,
	optimalMaterials = [],
	optimalSeller = 'Нет',
	squareInput = document.getElementById("square-input"),
	calculateButton = document.getElementById("square-calc");


function insertConsumption() {
	document.getElementById("consumption-rate").innerText = paintData.expenditure + ' литр'
}

function insertMaterials() {
	var materialsListContainer = document.getElementById("materials-list"),
		materialsIdArray = Object.keys(paintData.materials);

	/*<li class="list-element">
		<div class="element-id bold">
			5
		</div>
		<div class="material-value">
			10
		</div>
	</li>*/

	materialsIdArray.map(function (materialId, idIndex) {
		var materialElement = document.createElement("li"),
			elementIdContainer = document.createElement("div"),
			materialValueContainer = document.createElement("div");

		materialElement.classList = 'list-element';

		elementIdContainer.innerText = materialId;
		elementIdContainer.classList = 'element-id bold';

		materialValueContainer.innerText = paintData.materials[materialId];
		materialValueContainer.classList = 'material-value';


		materialElement.appendChild(elementIdContainer);
		materialElement.appendChild(materialValueContainer);

		materialsListContainer.appendChild(materialElement)
	});
}

function squareValidation(event) {
	if (event.keyCode === 13) {
		console.log('Calculations!');
		calculations();
	} else {

		console.log(event.target.value);
		var number = parseFloat(event.target.value);

		if (number < 0) {
			event.target.value = 0;
		}
	}
	console.log(event);
}

function calculations(event) {
	var squareValue = parseFloat(squareInput.value),
		priceElement = document.getElementById("price-rate"),
		materialsElement = document.getElementById("materials-rate"),
		sellerElement = document.getElementById("seller-rate");

	if (squareValue > 0) {
		getOptimalPrice(squareValue);
		priceElement.innerText = optimalPrice;
		materialsElement.innerText = optimalMaterials.join(', ');
		sellerElement.innerText = optimalSeller;
	} else {
		priceElement.innerText = 0;
		materialsElement.innerText = 'Нет';
		sellerElement.innerText = 'Нет';
	}
}

function addListeners() {
	squareInput.addEventListener("change", squareValidation);
	calculateButton.addEventListener("click", calculations);
}

function swap(json) {
	var swapped = {};
	for (var key in json) {
		swapped[json[key]] = key;
	}
	return swapped;
}

function sortMaterials() {
	var swappedMaterialsJson = swap(paintData.materials),
		sortedMaterialsValues = Object.keys(swappedMaterialsJson).sort(function (a, b) {
			return a - b;
		});

	sortedMaterialsValues.map(function (value, valueIndex) {
		sortedMaterialsKeys.push(swappedMaterialsJson[value]);
	});

	console.log(sortedMaterialsKeys);
}

function getSellers() {
	sellersArray = Object.keys(paintData.prices[sortedMaterialsKeys[0]]);

	console.log(sellersArray);
}

function getBestPrice(materialsSet) {
	console.log(materialsSet);
	var bestPrice = null,
		currentPrice = 0,
		bestSeller = 0;
	for (var seller in sellersArray) {
		for (var material in materialsSet) {
			currentPrice += paintData.prices[materialsSet[material]][sellersArray[seller]];
		}
		if (bestPrice > currentPrice || bestPrice === null) {
			bestPrice = currentPrice;
			bestSeller = sellersArray[seller];
		}

		currentPrice = 0;
	}

	if (optimalPrice > bestPrice || optimalPrice === null) {
		optimalPrice = bestPrice;
		optimalMaterials = materialsSet;
		optimalSeller = bestSeller;
	}
}

function getMaterialConfiguration(initialMaterial, materialIndex, liquidVolume) {
	var materialArray = [initialMaterial],
		currentVolume = paintData.materials[initialMaterial],
		configurationArray = [],
		minConfigValue = materialIndex,
		currentConfigValue = materialIndex + 1,
		maxConfigValue = sortedMaterialsKeys.length;

	if (configurationArray.length === 0) {
		while (currentVolume < liquidVolume) {
			currentVolume += paintData.materials[initialMaterial];
			configurationArray.push(minConfigValue);
			materialArray.push(initialMaterial);
		}
	}

	getBestPrice(materialArray);

	if (configurationArray.length !== 0) {
		while (currentConfigValue < maxConfigValue) {

			for (var configIndex in configurationArray) {
				if (configurationArray[configIndex] < currentConfigValue) {
					materialArray = [initialMaterial];
					currentVolume = paintData.materials[initialMaterial];

					configurationArray[configIndex] = currentConfigValue;

					var lastValue,
						configIteration = 0;
					while (currentVolume < liquidVolume) {
						lastValue = configurationArray[configIteration];
						currentVolume += paintData.materials[sortedMaterialsKeys[configurationArray[configIteration]]];
						materialArray.push(sortedMaterialsKeys[currentConfigValue]);
						configIteration++;
					}

					getBestPrice(materialArray);
					if (lastValue === currentConfigValue) {
						currentConfigValue++;
						break;
					}
				}
			}
		}
	}
}

function getOptimalPrice(squareValue) {
	var liquidVolume = squareValue * paintData.expenditure;

	for (var material in sortedMaterialsKeys) {
		getMaterialConfiguration(sortedMaterialsKeys[material], sortedMaterialsKeys.indexOf(material), liquidVolume);
	}
}

addListeners();
insertConsumption();
insertMaterials();
sortMaterials();
getSellers();