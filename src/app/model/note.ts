import { Position } from './position';

export interface Note {
    key?: string,
    title: string,
    description?: string,
    date: string,
    img?: string,
    position?: Position
}
