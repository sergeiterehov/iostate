// @ts-check

/**
 * Функция слушателя сигнала.
 *
 * @typedef { (state: any) => void } FuncListnerIO
 */

/**
 * Типы ограничений на свойства сигнала.
 *
 * @enum {number}
 */
const LimitIO = {
    InOnly: 1, // 01
    OutOnly: 2, // 10
    Any: 3, // 11
};

/**
 * Создает объект сигнала iostate.
 *
 * @param {any} [init] Начальное состояние сигнала.
 * @param {FuncListnerIO} [listener] Слушатель сигнала по умолчанию.
 * @param {LimitIO} limit Наложение ограничений на свойства сигнала.
 */
const CreateIO = (init, listener, limit) => {
    let state = init;
    const listeners = [];

    const func = (...source) => {
        if (source.length === 0) {
            return state;
        }

        const raw = source[0];

        if (raw.__in || raw.__out) {
            if (raw.__in && ! func.__out) {
                throw new Error('Установить связь можно только с выходом');
            } else if (raw.__out && ! func.__in) {
                throw new Error('Установить связь можно только со входом');
            }

            raw.listen(func);
        } else if (raw !== state) {
            state = raw;

            listeners.forEach((listener) => listener(state));
        }
    }

    func.__in = Boolean(limit & LimitIO.InOnly);
    func.__out = Boolean(limit & LimitIO.OutOnly);

    /**
     * Добавляет слушателя сигнала.
     *
     * @type { (listener: FuncListnerIO) => void }
     */
    func.listen = (listener) => {
        listeners.push(listener);
    }

    if (listener) {
        listeners.push(listener);
    }

    return func;
}

/**
 * Создает сигнал, доступный только в режиме выхода.
 *
 * @param {FuncListnerIO} [listener] Слушатель сигнала по умолчанию.
 * @param {any} [init] Начальное значение сигнала.
 */
const IN = (listener, init) => CreateIO(init, listener, LimitIO.InOnly);
/**
 * Создает сигнал, доступный только в режиме выхода.
 *
 * @param {any} [init] Начальное значение сигнала.
 * @param {FuncListnerIO} [listener] Слушатель сигнала по умолчанию.
 */
const OUT = (init, listener) => CreateIO(init, listener, LimitIO.OutOnly);
/**
 * Создает сигнал, доступный в двунаправленном режиме.
 *
 * @param {any} [init] Начальное значение сигнала.
 * @param {FuncListnerIO} [listener] Слушатель сигнала по умолчанию.
 */
const IO = (init, listener) => CreateIO(init, listener, LimitIO.Any);

module.exports = {
    IN,
    OUT,
    IO,
};
