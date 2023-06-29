/// different shapes UI
/// add values manually



inputVals = [5, 230, 31, 543, 234, 12, 30];

blocksStartX = 550;
blocksStartY = 10;

receivers = [
	"Number", 
	"Angle", 
	"Color", 
	"Stroke", 
	"Distance", 
	"Radius"
];

receiversX = 550;
receiversY = 70;

dataValues = ballPossess;

async function makeSlots() {
	async function addReceivers() {
		var ry = receiversY;
		for (var r in receivers) {
			dv = document.createElement("div");
			dv.setAttribute('class', 'dropzone')
			dv.setAttribute('id', 'receiver-' + r);
			dv.textContent = receivers[r];
			numInput = document.createElement("input");
			numInput.setAttribute("type", "number");
			numInput.setAttribute("class", "number-input");
			numInput.setAttribute("value", blockVals[r]);
			numInput.setAttribute("id", "receiver-input-" + r);
			console.log(r);
			dv.appendChild(numInput);
			document.body.insertBefore(dv, document.getElementById("receivers"));
			moveTarget(receiversX, ry, dv);
			ry += dv.getBoundingClientRect().height + 10;
			connections.push(-1);
			// dataValues.push(-1);
			// console.log(r);
		}
		return true;
	}
	async function addInputListener () {
		const numInputElements = document.querySelectorAll(".number-input");
		// console.log(numInputElements);
		numInputElements.forEach( (nie) => {
			nie.addEventListener("change", (event) => {
				// console.log(event.target.value);
				var nid = event.target.getAttribute("id");
				var inputId = parseInt(nid.slice(nid.length - 1, nid.length));
				inputVals[inputId] = parseInt(event.target.value);
				blockVals[inputId] = parseInt(event.target.value);
				ballPossess[inputId] = parseInt(event.target.value);
				// console.log("bp " + ballPossess);
				// console.log("iv " + inputVals);
				// disconnectBlock(document.getElementById("block-" + inputId));
				// console.log(event.target);
				// const result = document.querySelector(".result");
				// result.textContent = `You like ${event.target.value}`;
			});
		});
		return true;
	}
	await addReceivers();
	await addInputListener();
	
	
}


function makeBlocks() {
	blocksX = blocksStartX;
	blocksY = blocksStartY;

	for (var b in blocks) {
		dv = document.createElement("div");
		dv.setAttribute('class', 'drag-drop');
		dv.textContent = blocks[b];
		dv.setAttribute('id', 'block-'+ b);
		dv.setAttribute('start-x', blocksX);
		dv.setAttribute('start-y', blocksY);
		console.log(blocksX, blocksY);
		document.body.prepend(dv);
		moveTarget(blocksX, 10, document.getElementById('block-'+ b));
		blocksX = dv.getBoundingClientRect().right + 10;
		//TODO: connect block to data field
	}
}

makeBlocks();

makeSlots();

function sendBlockHome (t) {
	// console.log(t);
  var x = t.getAttribute("start-x");
  var y = t.getAttribute("start-y");
  t.classList.remove('can-drop');
  moveTarget(x, y, t);
}

///****** TODO: assuming less than 10 blocks here ******//
function getBlockIndex (block) {
	var bid = block.getAttribute('id');
	var blockIndex = parseInt(bid.slice(bid.length - 1, bid.length));
	return blockIndex;
}

function attachBlocks (parent, block) {
	//remember parent to block connections
	// console.log(parent, block);
	disconnectBlock(block, false);
	var dgrc = parent.getBoundingClientRect();
	moveTarget(dgrc.left+70, dgrc.top + 5, block);
	var blockIndex = getBlockIndex(block);
	var parentIndex = getBlockIndex(parent);
	if (connections[parentIndex] != -1) {
		sendBlockHome(document.getElementById("block-" + connections[parentIndex]));
	}
	connections[parentIndex] = blockIndex;
	ballPossess[parentIndex] = blockVals[blockIndex];
	console.log(connections);
	// console.log(ballPossess);
	// console.log("bp " + ballPossess);
	// if connections
	//change 
}

function disconnectBlock(block, moveBool=true) {
	// console.log(block);
	parentIndex = connections.indexOf(getBlockIndex(block));
	// console.log(connections);
	// console.log("parentIndex" + parentIndex);
	if (parentIndex != -1) {
		connections[parentIndex] = -1;
		dataValues[parentIndex] = originalBallPossess[parentIndex];
		ballPossess[parentIndex] = inputVals[parentIndex];
		// console.log("ballP " + ballPossess);
	}

	if (moveBool) {sendBlockHome(block)};
}

attachBlocks(document.getElementById("receiver-0"), document.getElementById("block-0"));