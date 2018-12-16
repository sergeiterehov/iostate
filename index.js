// @ts-check

const { IN, OUT } = require('./iostate');

function Generator(delay) {
    setInterval(() => this.clk(! this.clk()), delay);

    this.clk = OUT(false);
}

function Divider(basis) {
    this.clk = IN(() => {
        if (! this.clk()) {
            return;
        }

        counter += 1;

        if (counter === basis) {
            counter = 0;
            result += 1;
        }

        this.result(result);
    });
    this.result = OUT(0);

    let counter = 0;
    let result = 0;
}

const generator = new Generator(200);
const divider = new Divider(5);

divider.clk(generator.clk);

divider.result.listen((value) => console.log('Divider result:', value));
generator.clk.listen((value) => console.log('Generator clk:', value));
