// @ts-check

const { IN, OUT } = require('./iostate');
const { ALU } = require('./ALU');

const alu = new ALU();

const aluDebugger = () => {
    console.log(`ALU. result=${alu.result()}; zero=${alu.zero()}`);
};

alu.result.listen(aluDebugger);
alu.zero.listen(aluDebugger);

alu.a(0b101);
alu.b(0b011);

alu.alu_control(0);
alu.alu_control(1);
alu.alu_control(0b101);
