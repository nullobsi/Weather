type Opts<T> = {
    [P in keyof T]: {
        name: P,
        opts: T[P],
    }
}[keyof T];

type Union<T> = T[keyof T];

export type {Opts, Union}
