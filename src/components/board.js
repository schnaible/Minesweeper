import { Fragment, useState } from "react";


function Cell(props) {
    if(props.cell.isOccupied){
        return(
            <td onClick={() => props.handleClick(props.rowIdx, props.colIdx)}
            onContextMenu={() => props.handleRightClick(props.rowIdx, props.colIdx)}
            width="50px" height="50px"
            style={{backgroundColor: props.cell.color, textAlign:"center", border:"none"}}>
            {props.cell.bombsNear}
            </td>       
        );
    }

    return (
        <td onClick={() => props.handleClick(props.rowIdx, props.colIdx)}
            onContextMenu={() => props.handleRightClick(props.rowIdx, props.colIdx)}
            width="50px" height="50px"
            style={{backgroundColor: props.cell.color, border:"none"}}>
        </td>
        //Right Click: oncontextmenu
    );
}

function Row(props) {
    return (
        <tr>{ props.row.map( (cell, idx) => <Cell key={uniqueKey()}
                                                  cell={cell}
                                                  rowIdx={props.rowIdx}
                                                  colIdx={idx}
                                                  handleClick={props.handleClick}
                                                  handleRightClick={props.handleRightClick}
        />)
        }
        </tr>
    )
}

let key = 1;
function uniqueKey() {
    return key++;
}

let boardDifficulty = "";
let numRows = 0, numColumns = 0, numBombs = 0;
let numCellsOccupied = 0;
//Have numCellsOccupied, compare to numRows*numColumns-numBobms to check for winning game state

function createInitialState() {
    if(boardDifficulty === "none") return;
    else if (boardDifficulty === "easy"){
        //alert("easy difficulty");
        numRows = 6;
        numColumns = 6;
        numBombs = 5;
    }
    else if (boardDifficulty === "medium"){
        //alert("medium difficulty");
        numRows = 9;
        numColumns = 9;
        numBombs = 15;
    }
    else if (boardDifficulty === "hard"){
        //alert("hard difficulty");
        numRows = 12;
        numColumns = 12;
        numBombs = 25;
    }

    let board = Array(numRows).fill(Array(numColumns).fill({color: "#a6a6a6", hasBomb: false, bombClicked: false, bombsNear: 0})); //white
    
    board = board.map((row, rowIdx) => row.map( (col, colIdx) => {
        return {...board[rowIdx][colIdx], row: rowIdx, column: colIdx }
    }));

    //   SET BOMBS RANDOMLY 
    if (boardDifficulty !== ""){
        let mineCount = 0;
        while (mineCount < numBombs){
            let randomRow = Math.floor(Math.random() * numRows);
            let randomCol = Math.floor(Math.random() * numColumns);
            if(!board[randomRow][randomCol].hasBomb) {
                board[randomRow][randomCol] = {
                    ...board[randomRow][randomCol],
                    hasBomb: true};
                mineCount++;
            }
        }
    }

    //Find out how many bombs are near each cell.
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numColumns; col++) {
            if (board[row][col].hasBomb === true){
                if (row === 0){
                    if (col === 0){
                        board[row+1][col].bombsNear++;
                        board[row][col+1].bombsNear++;
                        board[row+1][col+1].bombsNear++;
                    }
                    else if(col === numColumns-1){
                        board[row][col-1].bombsNear++;
                        board[row+1][col].bombsNear++;
                        board[row+1][col-1].bombsNear++;
                    }
                    else{
                        board[row+1][col].bombsNear++;
                        board[row+1][col+1].bombsNear++;
                        board[row+1][col-1].bombsNear++;
                        board[row][col+1].bombsNear++;
                        board[row][col-1].bombsNear++;
                    }
                }
                else if (row === numRows-1){
                    if(col === 0){
                        board[row][col+1].bombsNear++;
                        board[row-1][col+1].bombsNear++;
                        board[row-1][col].bombsNear++;
                    }
                    else if (col === numColumns-1){
                        board[row-1][col].bombsNear++;
                        board[row][col-1].bombsNear++;
                        board[row-1][col-1].bombsNear++;
                    }
                    else{
                        board[row-1][col+1].bombsNear++;
                        board[row][col+1].bombsNear++;
                        board[row][col-1].bombsNear++;
                        board[row-1][col].bombsNear++;
                        board[row-1][col-1].bombsNear++;
                    }
                }
                else{
                    if(row+1 < numRows){
                        board[row+1][col].bombsNear++;
                        if(col+1<numColumns){
                            board[row+1][col+1].bombsNear++  
                        } 
                        if(col-1>=0) board[row+1][col-1].bombsNear++;
                    }
                    if(row-1 >= 0){
                        board[row-1][col].bombsNear++;
                        if(col+1<numColumns){
                            board[row-1][col+1].bombsNear++;
                        } 
                        if(col-1>=0){
                            board[row-1][col-1].bombsNear++;
                        } 
                    }
                    if(col+1<numColumns) board[row][col+1].bombsNear++;
                    if(col-1>=0) board[row][col-1].bombsNear++;
                }
            } 
        }    
    }

    return {
        board
    };
}

function TopMessage(props) {
    if(boardDifficulty === ""){
        return(
            //https://stackoverflow.com/questions/9972280/onclick-on-option-tag-not-working-on-ie-and-chrome
            //Originally used a drop down menu, however it seems as if Safari, IE, Chrome, and Edge do not support onClick with the <option> tag.
            <div style={{height: "50px", textAlign: "center"}}>
                <h3><u>Select a Difficulty</u></h3>
                <button onClick={() => {boardDifficulty = "easy"; props.reset()}}>Easy</button>
                <button onClick={() => {boardDifficulty = "medium"; props.reset()}}>Medium</button>
                <button onClick={() => {boardDifficulty = "hard"; props.reset()}}>Hard</button>   
            </div>);
    }

    if( !props.bombClicked && !props.haveAWinner) { // Change the message to whatever is needed, perhaps the timer?
        return <div style={{height: "50px", textAlign: "center"}}>
            <button onClick={() => props.displayBombs()}>Show Bombs</button>
            </div>;
    }
        return <div style={{height: "50px", textAlign: "center"}}>
                <button onClick={() => props.reset()}>Reset?</button>
                <button onClick={() => window.location.reload()}>Change Difficulty</button>
            </div>
};


export default function Board(props) {

    const [boardState, setBoardState ] = useState(createInitialState);

    const reset = () => {
        //alert("reset!");
        numCellsOccupied = 0;
        setBoardState(createInitialState());
    };

    //Display bombs only display after pressing the button AND pressing the next cell.
    //SOURCE: https://www.javascripttutorial.net/javascript-multidimensional-array/
    const displayBombs = () => {
        let board = boardState.board;

        board.forEach((row) => {
            row.forEach((area) => {
                if(area.hasBomb === true && area.color === "red" && !board.haveAWinner){ //May just need to check if it's red
                    console.log(area);
                    area.color = "#a6a6a6"; //white
                }
                else if(area.hasBomb === true){
                    console.log(area);
                    area.color = "red";
                }
            });
        });
    
        setBoardState({
            ...boardState
        });
    };

    
    function revealNearby(row, col){
        let board = boardState.board;
        
        if(board[row][col].hasBomb || board[row][col].isOccupied ){
            return;
        } 
        else if (board[row][col].bombsNear > 0){
            console.log(`existing cell before change of color contains ${JSON.stringify(board[row][col])}`);
            board[row][col] = {
                ...board[row][col],
                color: "#6c6b6b",//black
                isOccupied: true
            };
            numCellsOccupied +=1;
            console.log(`existing cell after change of color contains ${JSON.stringify(board[row][col])}`);
        
            setBoardState({
                ...boardState,
                //board: newBoard,
            });
            return;
        }
        else if (board[row][col].bombsNear === 0){
            console.log(`existing cell before change of color contains ${JSON.stringify(board[row][col])}`);
            board[row][col] = {
                ...board[row][col],
                color: "#6c6b6b", //black
                isOccupied: true
            };
            numCellsOccupied +=1;
            console.log(`existing cell after change of color contains ${JSON.stringify(board[row][col])}`);
        
            setBoardState({
                ...boardState,
                //board: newBoard,
            });
                if (row === 0){
                    if (col === 0){
                        revealNearby(row+1,col);
                        revealNearby(row,col+1);
                        revealNearby(row+1,col+1);
                    }
                    else if(col === numColumns-1){
                        revealNearby(row,col-1);
                        revealNearby(row+1,col);
                        revealNearby(row+1,col-1);
                    }
                    else{
                        revealNearby(row+1,col);
                        revealNearby(row+1,col+1);
                        revealNearby(row+1,col-1);
                        revealNearby(row,col+1);
                        revealNearby(row,col-1);
                    }
                }
                else if (row === numRows-1){
                    if(col === 0){
                        revealNearby(row,col+1);
                        revealNearby(row-1,col+1);
                        revealNearby(row-1,col);
                    }
                    else if (col === numColumns-1){
                        revealNearby(row-1,col);
                        revealNearby(row,col-1);
                        revealNearby(row-1,col-1);
                    }
                    else{
                        revealNearby(row-1,col+1);
                        revealNearby(row,col+1);
                        revealNearby(row,col-1);
                        revealNearby(row-1,col);
                        revealNearby(row-1,col-1);
                    }
                }
                else
                {
                    if(row+1 < numRows){
                        revealNearby(row+1,col);
                        if(col+1<numColumns){
                            revealNearby(row+1,col+1);
                        } 
                        if(col-1>=0)   revealNearby(row+1,col-1);
                    }
                    if(row-1 >= 0){
                          revealNearby(row-1,col);
                        if(col+1<numColumns){
                              revealNearby(row-1,col+1);
                        } 
                        if(col-1>=0){
                              revealNearby(row-1,col-1);
                        } 
                    }
                    if(col+1<numColumns)  revealNearby(row,col+1);
                    if(col-1>=0)   revealNearby(row,col-1);
                }
            } 

}


function handleClick(rowIdx, colIdx) {
    console.log(`handleClick called with rowIdx = ${rowIdx}, colIdx = ${colIdx}, ${JSON.stringify(boardState)}`);
    if( boardState.bombClicked === true || boardState.haveAWinner === true) //MAybe need to add something here to show we lost?
        return;

    let board = boardState.board;
    let affectedRow = board[rowIdx].slice();

    if (board[rowIdx][colIdx].isOccupied === true || board[rowIdx][colIdx].color === "blue")
        return;

    if (board[rowIdx][colIdx].hasBomb === true){
        alert("Kaboom!!! \n Game Over");
        displayBombs();
        board[rowIdx][colIdx].color = `#9A1A27`;
        // board.bombClicked = true;
        // board[rowIdx][colIdx].bombClicked = true;

        let newBoard = board.slice();
        newBoard[rowIdx] = affectedRow;
    
        setBoardState({
            ...boardState,
            board: newBoard,
            bombClicked: true
        });
        return;
    }
    else if(board[rowIdx][colIdx].bombsNear === 0){

        revealNearby(rowIdx,colIdx);


    if( numCellsOccupied === ((numRows*numColumns)-numBombs) ) { // Change this to handle clicking a bomb
        alert("Congratulations You Win!")
        setBoardState(boardState => ({
            ...boardState,
            haveAWinner: true,
            //winnerColor: 'red' //No need for color
        }));
    }
   
    }  
    else {  //Else: cell.bombsNear > 0;
        console.log(`existing cell before change of color contains ${JSON.stringify(board[rowIdx][colIdx])}`);
        board[rowIdx][colIdx] = {
            ...board[rowIdx][colIdx],
            color: "#6c6b6b",//black
            isOccupied: true
        };
        numCellsOccupied +=1;
        console.log(`existing cell after change of color contains ${JSON.stringify(board[rowIdx][colIdx])}`);
    
    
        let newBoard = board.slice();
        newBoard[rowIdx] = affectedRow;
    
        setBoardState({
            ...boardState,
            //board: newBoard,
        });
    
        if( numCellsOccupied === ((numRows*numColumns)-numBombs) ) { // Change this to handle clicking a bomb
            alert("Congratulations You Win!")
            setBoardState(boardState => ({
                ...boardState,
                haveAWinner: true,
                //winnerColor: 'red' //No need for color
            }));
        }
    }
}

function handleRightClick(rowIdx, colIdx){
    let board = boardState.board;
    let affectedRow = board[rowIdx].slice();

    {
        if(board[rowIdx][colIdx].color === "#6c6b6b" || boardState.haveAWinner === true) //black
            return;
        else if(board[rowIdx][colIdx].color === "blue"){
            console.log(`existing cell before change of color contains ${JSON.stringify(board[rowIdx][colIdx])}`);
                board[rowIdx][colIdx] = {
                ...board[rowIdx][colIdx],
                color: "#a6a6a6" //white
            };
        }
        else{
            console.log(`existing cell before change of color contains ${JSON.stringify(board[rowIdx][colIdx])}`);
            board[rowIdx][colIdx] = {
                ...board[rowIdx][colIdx],
                color: "blue"
            };
        }

        console.log(`existing cell after change of color contains ${JSON.stringify(board[rowIdx][colIdx])}`);
    
        let newBoard = board.slice();
        newBoard[rowIdx] = affectedRow;
    
        setBoardState({
            ...boardState,
        });
    }
}

    return (
        <Fragment>
            <TopMessage reset={reset}
                        bombClicked={boardState.bombClicked} 
                        haveAWinner={boardState.haveAWinner}
                        displayBombs={displayBombs}/>
            <table border={1} align="center">
                <tbody>
                {
                    boardState.board.map((row, rowIdx) => (<Row key={uniqueKey()}
                                                                row={row}
                                                                rowIdx={rowIdx}
                                                                handleClick={handleClick} 
                                                                handleRightClick={handleRightClick}                   />))
                }
                </tbody>
            </table>
        </Fragment>
    );
}