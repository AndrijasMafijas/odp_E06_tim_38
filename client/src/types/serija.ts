import { type Trivija } from "./film";

export interface Epizoda {
  id: number;
  naziv: string;
  opis: string;
  trivija: Trivija;
}

export interface Serija {
  id: number;
  naziv: string;
  opis: string;
  epizode: Epizoda[];
}