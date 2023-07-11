export interface Step {
  carryString: string;
  sumString: string;
}

export interface Steps {
  [step: string]: Step;
}
