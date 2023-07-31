pragma solidity ^0.8.0;

contract MagicNumSolver {

    // When call a function. Contract always load init/constructor first. (run once)
    // assembly code in constructor even empty will be run first. (Also cost gas to load this)
    // it will normally 27 op code before reach RETURN
    // To solve this MagicNum. The constructor must always return 42 some how regardless of function call.
    // Or simply figure out how to return 42 in init instead of body part
    // https://github.com/androlo/solidity-workshop/blob/master/tutorials/2016-03-09-advanced-solidity-I.md#simple-contract-assembly
    
    //fallback does not allow returns value
    // constructor init return actually return a whole program or bytecode to run.
    // So we can mstore entire program to memory and other contract or tester will run this program.
    constructor() {
        assembly {
            // hex 0x2a = 42 
            // MSTORE(0x00, 0x2a) // store 42 to memory 0x00
            // RETURN(0x00, 0x20) // return 32 bytes from memory 0x00
            // use yellowpaper to get bytecode of function mstore and return
            // or just get it from remix when deploy contract
            // 602a 6000 52 6020 6000 f3
            // 60: PUSH 2a
            // 60: PUSH 00
            // 52: MSTORE
            // 60: PUSH 20
            // 60: PUSH 00
            // f3: RETURN
            
            // mstore(0x00, 0x602a60005260206000f3)

            // after push in stack then mstore into memory. The memory position actually at 0x10 + 6 in Remix
            // 0x00: 0x00000000000000000000000000000000	????????????????
            // 0x10: 0x000000000000602a60005260206000f3 ??????????R? ???
            // return 10 bytes from in memory start from position 0x16

            // return(0x16, 0x0a)

            // to spice things up we can move up mstore location down. does not make much of a different.
            
            mstore(0x40, 0x602a60005260206000f3) // this actually override free memory pointer 0x50
            return(0x56, 0x0a)

            // the answer on ethernaut is
            // 0x602a60005260206000f3
        }
    }
}
contract MagicNum {

  address public solver;

  constructor() public {}

  function setSolver(address _solver) public {
    solver = _solver;
  }

  /*
    ____________/\\\_______/\\\\\\\\\_____        
     __________/\\\\\_____/\\\///////\\\___       
      ________/\\\/\\\____\///______\//\\\__      
       ______/\\\/\/\\\______________/\\\/___     
        ____/\\\/__\/\\\___________/\\\//_____    
         __/\\\\\\\\\\\\\\\\_____/\\\//________   
          _\///////////\\\//____/\\\/___________  
           ___________\/\\\_____/\\\\\\\\\\\\\\\_ 
            ___________\///_____\///////////////__
  */
}