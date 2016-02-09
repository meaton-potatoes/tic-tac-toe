var winCombo1 = ["square1", "square2", "square3", "horizonal top"]; //horizonal top
var winCombo2 = ["square4", "square5", "square6", "horizontal middle"]; //horizontal middle
var winCombo3 = ["square7", "square8", "square9", "horizontal bottom"]; //horizontal bottom
var winCombo4 = ["square1", "square4", "square7", "vertical left"]; //vertical left
var winCombo5 = ["square2", "square5", "square8", "vertical middle"]; //vertical middle
var winCombo6 = ["square3", "square6", "square9", "vertical right"]; //vertical right
var winCombo7 = ["square1", "square5", "square9", "diagonal left-to-right"]; //diagonal left-to-right
var winCombo8 = ["square3", "square5", "square7", "diagonal right-to-left"]; //diagonal right-to-left
var allSquaresOnBoard = ["square1", "square2", "square3", "square4", "square5", "square6", "square7", "square8", "square9"];
var allWinCombos = [winCombo7, winCombo8, winCombo1, winCombo2, winCombo3, winCombo4, winCombo5, winCombo6];
var allPlayerMoves = [];
var allComputerMoves = [];

var playerSymbol;
var computerSymbol;

$("#symbol-choice h1").on("click", function(){
	if ($(this).attr("id") === "symbol-x") {
		playerSymbol = "X";
		computerSymbol = "O";
	} else if ($(this).attr("id") === "symbol-o") {
		playerSymbol = "O";
		computerSymbol = "X";
	}
	
	$("#symbol-choice").css("display", "none");
	$("#order-choice").css("display", "block");
});

$("#order-choice h1").on("click", function(){
	if ($(this).attr("id") === "player-goes-first") {
		$("#order-choice").css("display", "none");
		$("#game-board").css("display", "block");
		return;
	} else if ($(this).attr("id") === "computer-goes-first") {
		$("#order-choice").css("display", "none");
		$("#game-board").css("display", "block");
		computerGoesFirst();
		return;
	}
});

function computerGoesFirst() {
	var firstMoveArray = ["square1", "square3", "square5", "square7", "square9"];
	var randomNum = Math.floor(Math.random() * 4) + 1;
	var firstMove = firstMoveArray[randomNum];
	console.log(randomNum);
	allComputerMoves.push(firstMove);
	if ($("#" + firstMove).html() === "used-square") {
		computerGoesFirst();
	} else {
		$("#" + firstMove).html(computerSymbol);
		$("#" + firstMove).addClass("used-square");
	}
}

$("#game-board td").on("click", function(){
	if ($(this).hasClass("used-square")) {
		alert("Illegal move!");
		return
	} else {
		$(this).html(playerSymbol);
		$(this).addClass("used-square");
		allPlayerMoves.push($(this).attr("id"));
		if (checkForWinner()) {
			checkForWinner();
			return;
		}
		computerMoveAgain();
	}
});

function computerMoveAgain() {
	//create possible winCombos that don't include combos that have already been blocked by computer
	var newAllWinCombos = [];
	allWinCombos.forEach(function(combo){
		if (allComputerMoves.indexOf(combo[0]) === -1 && allComputerMoves.indexOf(combo[1]) === -1 && allComputerMoves.indexOf(combo[2]) === -1 ) {
			newAllWinCombos.push(combo);
		}
	});
	
	//check for potential player winCombos
	var firstPriority = [];
	var secondPriority = [];
	var thirdPriority = [];
	//loop through winComboArray
	for (var v = 0; v < allWinCombos.length; v++) {
		//check for immediate computer wins
		if ($("#" + allWinCombos[v][0]).html() === computerSymbol) {
			if ($("#" + allWinCombos[v][1]).html() === computerSymbol) {
				if (!($("#" + allWinCombos[v][2]).hasClass("used-square"))) {
					firstPriority.push(allWinCombos[v][2]);
				}
			}
		} 
		if ($("#" + allWinCombos[v][1]).html() === computerSymbol) {
			if ($("#" + allWinCombos[v][2]).html() === computerSymbol) {
				if (!($("#" + allWinCombos[v][0]).hasClass("used-square"))) {
					firstPriority.push(allWinCombos[v][0]);
				}
			}
		}
		if ($("#" + allWinCombos[v][0]).html() === computerSymbol) {
			if ($("#" + allWinCombos[v][2]).html() === computerSymbol) {
				if (!($("#" + allWinCombos[v][1]).hasClass("used-square"))) {
					firstPriority.push(allWinCombos[v][1]);
				}
			}
		}
		
		//check for immediate player wins
		if ($("#" + allWinCombos[v][0]).html() === playerSymbol) {
			if ($("#" + allWinCombos[v][1]).html() === playerSymbol) {
				if (!($("#" + allWinCombos[v][2]).hasClass("used-square"))) {
					secondPriority.push(allWinCombos[v][2]);
				}
			} else {
				if (!($("#" + allWinCombos[v][1]).hasClass("used-square"))) {
					thirdPriority.push(allWinCombos[v][1]);
				}
			}
		}
		if ($("#" + allWinCombos[v][1]).html() === playerSymbol) {
			if ($("#" + allWinCombos[v][2]).html() === playerSymbol) {
				if (!($("#" + allWinCombos[v][0]).hasClass("used-square"))) {
					secondPriority.push(allWinCombos[v][0]);
				}
			} else {
				if (!($("#" + allWinCombos[v][2]).hasClass("used-square"))) {
					thirdPriority.push(allWinCombos[v][2]);
				}
			}
		}
		if ($("#" + allWinCombos[v][2]).html() === playerSymbol) {
			if ($("#" + allWinCombos[v][0]).html() === playerSymbol) {
				if (!($("#" + allWinCombos[v][1]).hasClass("used-square"))) {
					secondPriority.push(allWinCombos[v][1]);
				}
			} else {
				if (!($("#" + allWinCombos[v][2])).hasClass("used-square")) {
					thirdPriority.push(allWinCombos[v][1]);
				}
			}
		}
	}
	
	console.log("1st, before frequency check: [" + firstPriority + "]");
	console.log("2nd, before frequency check: [" + secondPriority + "]");
	console.log("3rd, before frequency check: [" + thirdPriority + "]");
	firstPriority = checkForFrequency(firstPriority);
	secondPriority = checkForFrequency(secondPriority);
	thirdPriority = checkForFrequency(thirdPriority);
	console.log("1st, after frequency check: [" + firstPriority + "]");
	console.log("2nd, after frequency check: [" + secondPriority + "]");
	console.log("3rd, after frequency check: [" + thirdPriority + "]");
	
	if (firstPriority.length > 0) {
		console.log("First Priority move!")
		for (var b = 0; b < firstPriority.length; b++) {
			if (!($("#"+ firstPriority[b]).hasClass("used-square"))) {
				$("#" + firstPriority[b]).html(computerSymbol);
				$("#" + firstPriority[b]).addClass("used-square");
				checkForWinner();
				return;
			}
		}
	} else if (secondPriority.length > 0) {
		console.log("Second Priority move!");
		for (var b = 0; b < secondPriority.length; b++) {
			if (!($("#"+ secondPriority[b]).hasClass("used-square"))) {
				$("#" + secondPriority[b]).html(computerSymbol);
				$("#" + secondPriority[b]).addClass("used-square");
				checkForWinner();
				return;
			}
		}
	} else if (thirdPriority.length > 0) {
		console.log("Third Priority move!");
		for (var b = 0; b < thirdPriority.length; b++) {
			if (!($("#"+ thirdPriority[b]).hasClass("used-square"))) {
				$("#" + thirdPriority[b]).html(computerSymbol);
				$("#" + thirdPriority[b]).addClass("used-square");
				checkForWinner();
				return;
			}
		}
	} else {
		console.log("Mediocre Move!")
		var mediocreMoveArray = ["square5", "square2", "square4", "square6", "square8", "square1", "square3", "square7", "square9"];
		for (var e = 0; e < mediocreMoveArray.length; e++) {
			if (!($("#" + mediocreMoveArray[e]).hasClass("used-square"))) {
				allComputerMoves.push(mediocreMoveArray[e]);
				$("#" + mediocreMoveArray[e]).html(computerSymbol);
				$("#" + mediocreMoveArray[e]).addClass("used-square");
				checkForWinner();
				return;
			}
		}
	}
}


function checkForWinner() {
	allWinCombos.forEach(function(combo){
		if (($("#" + combo[0]).html() === computerSymbol) && ($("#" + combo[1]).html() === computerSymbol) && ($("#" + combo[2]).html() === computerSymbol)) {
			alert("Computer wins! Play again?");
			clearBoard();
			return true;
		} else if (($("#" + combo[0]).html() === playerSymbol) && ($("#" + combo[1]).html() === playerSymbol) && ($("#" + combo[2]).html() === playerSymbol)) {
			alert("Player wins! Play again?");
			clearBoard();
			return true;
		}
	});
	if (($("#square1").hasClass("used-square")) && ($("#square2").hasClass("used-square")) && ($("#square3").hasClass("used-square")) && ($("#square4").hasClass("used-square")) && ($("#square5").hasClass("used-square")) && ($("#square6").hasClass("used-square")) && ($("#square7").hasClass("used-square")) && ($("#square8").hasClass("used-square")) && ($("#square9").hasClass("used-square"))) {
		alert("It's a tie! Play again?");
		clearBoard();
		return true;
	}
}

function checkForFrequency(priorityArray) {
	var arrayOfPositionsThatHaveFrequencyGreaterThanOne = [];
	for (var r = 0; r < priorityArray.length; r++) {
		var tempArray = priorityArray.slice(0, r) + priorityArray.slice(r+1);
		if (tempArray.indexOf(priorityArray[r]) > -1) {
			arrayOfPositionsThatHaveFrequencyGreaterThanOne.push(priorityArray[r]);
		} 
	}
	if (arrayOfPositionsThatHaveFrequencyGreaterThanOne.length > 0) {
		return arrayOfPositionsThatHaveFrequencyGreaterThanOne;
	} else {
		return priorityArray;
	}
}


function clearBoard(){
	$("#symbol-choice").css("display", "initial");
	$("#game-board").css("display", "none");
	for (var i = 0; i < allSquaresOnBoard.length; i++) {
		$("#" + allSquaresOnBoard[i]).html("");
		$("#" + allSquaresOnBoard[i]).removeClass("used-square");
	}
	return;
}