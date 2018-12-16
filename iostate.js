// @ts-check

const LimitIO = {
    InOnly: 1, // 01
    OutOnly: 2, // 10
    Any: 3, // 11
};

const CreateIO = (init, listener, limit) => {
    let state = init;
    let listeners = [];

    const func = (...source) => {
        if (source.length === 0) {
            return state;
        } else {
            const raw = source[0];

            if (raw.__in || raw.__out) {
                if (raw.__in && ! func.__out) {
                    throw new Error('Установить связь можно только с выходом');
                } else if (raw.__out && ! func.__in) {
                    throw new Error('Установить связь можно только со входом');
                }

                raw.listen(func);
            } else {
                if (raw !== state) {
                    state = raw;

                    listeners.forEach((listener) => listener(state));
                }
            }
        }
    }

    func.__in = Boolean(limit & LimitIO.InOnly);
    func.__out = Boolean(limit & LimitIO.OutOnly);

    func.listen = (listener) => listeners.push(listener);

    if (listener) {
        listeners.push(listener);
    }

    return func;
}

const IN = (listener, init) => CreateIO(init, listener, LimitIO.InOnly);
const OUT = (init, listener) => CreateIO(init, listener, LimitIO.OutOnly);
const IO = (init, listener) => CreateIO(init, listener, LimitIO.Any);

module.exports = {
    IN,
    OUT,
    IO,
};
