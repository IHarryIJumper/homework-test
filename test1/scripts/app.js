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
};


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
	console.log(event);
}

insertConsumption();
insertMaterials();