blocks = [
	"average speed", 
	"max speed", 
	"time of possession", 
	"running time", 
	"rest time"
];
blockVals = [5, 230, 31, 543, 234, 12, 30];

blocksStartX = 550;
blocksStartY = 10;

receivers = [
	"number", 
	"angle", 
	"color", 
	"stroke", 
	"distance", 
	"radius"
];

receiversX = 550;
receiversY = 50;

connections = [];
dataValues = ballPossess;

function makeSlots() {
	var ry = receiversY;
	for (var r in receivers) {
		dv = document.createElement("div");
		dv.setAttribute('class', 'dropzone')
		dv.setAttribute('id', 'receiver-' + r);
		dv.textContent = receivers[r];
		document.body.insertBefore(dv, document.getElementById("receivers"));
		moveTarget(receiversX, ry, dv);
		ry += dv.getBoundingClientRect().height + 10;
		connections.push(-1);
		// dataValues.push(-1);
	}
}

makeSlots()

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
		document.body.prepend(dv);
		moveTarget(blocksX, 10, document.getElementById('block-'+ b));
		blocksX = dv.getBoundingClientRect().right + 10;
		//TODO: connect block to data field
	}
}
makeBlocks();

function sendBlockHome (t) {
	// console.log(t);
  var x = t.getAttribute("start-x");
  var y = t.getAttribute("start-y");
  t.classList.remove('can-drop');
  moveTarget(x, y, t);
}

function getBlockIndex (block) {
	var bid = block.getAttribute('id');
	var blockIndex = parseInt(bid.slice(bid.length - 1, bid.length));
	return blockIndex;
}

function attachBlocks (parent, block) {
	//remember parent to block connections
	var dgrc = parent.getBoundingClientRect();
	moveTarget(dgrc.left+90, dgrc.top + 5, block);
	var blockIndex = getBlockIndex(block);
	var parentIndex = getBlockIndex(parent);
	if (connections[parentIndex] != -1) {
		sendBlockHome(document.getElementById("block-" + connections[parentIndex]));
	}
	connections[parentIndex] = blockIndex;
	ballPossess[parentIndex] = blockVals[blockIndex];
	// if connections
	//change 
}

function disconnectBlock(block) {
	// console.log(block);
	parentIndex = connections.indexOf(getBlockIndex(block));
	console.log(connections);
	console.log(parentIndex);
	if (parentIndex != -1) {
		connections[parentIndex] = -1;
		dataValues[parentIndex] = originalBallPossess[parentIndex];
		ballPossess[parentIndex] = originalBallPossess[parentIndex];
	}
	sendBlockHome(block);
}