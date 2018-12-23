// @ts-check

const { IN, OUT } = require('./iostate');

function ALU () {
    const logic = () => {
        switch (this.alu_control()) {
            default:
            case 0b000: this.result(this.a() + this.b()); break;
            case 0b001: this.result(this.a() - this.b()); break;
            case 0b010: this.result(~ this.a()); break;
            case 0b011: this.result(this.a() << this.b()); break;
            case 0b100: this.result(this.a() >> this.b()); break;
            case 0b101: this.result(this.a() & this.b()); break;
            case 0b110: this.result(this.a() | this.b()); break;
            case 0b111: this.result(this.a() < this.b() ? 1 : 0); break;
        }

        this.zero(this.result() === 0 ? 1 : 0);
    }

    this.a = IN(logic, 0);
    this.b = IN(logic, 0);
    this.alu_control = IN(logic, 0);

    this.result = OUT(0);
    this.zero = OUT(0);
}

module.exports = {
    ALU,
};