import EasyBoard from './board';

export default function LoadDifficulty(){
        return <div style={{height: "50px", textAlign: "center"}}>
            <button onClick={() => displayBoard("easy") }>Easy</button>
            <button onClick={() => displayBoard("medium")}>Medium</button>
            <button onClick={() => displayBoard("hard")}>Hard</button>
            </div>;       
};

function displayBoard(difficulty){
    if (difficulty === "easy"){
        alert("Easy!");
        return <EasyBoard />;
    }
}
