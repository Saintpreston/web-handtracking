import { Events } from "./utils/constants";

/**
 * @typedef Landmark
 * @type {object}
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */


class LandmarkStore {

  constructor() {
    this._landmarks = [];
  }

  /**
   * @param {Landmark[]} landmarks
   */
  set landmarks(landmarks) {
    this._landmarks = landmarks;
    window.dispatchEvent(new Event(Events.LandmarksUpdate));
  }

  get landmarks(){
    return this._landmarks
  }



}

export const landmarkStore = new LandmarkStore();


