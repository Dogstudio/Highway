/**
 * @file Highway default renderer that handle DOM stuffs.
 * @author Anthony Du Pont <bulldog@dogstudio.co>
 */

export default class Renderer {

  /**
   * @arg {object} properties — Set of properties (slug, page, view,...)
   * @constructor
   */
  constructor(properties) {
    // We get the view.
    this.wrap = document.querySelector('[data-router-wrapper]');

    // We save properties of the renderer
    this.properties = properties;

    // We get our transition we will use later to show/hide our view.
    this.Transition = properties.transition ? new properties.transition(this.wrap) : null;

    // Set transition Name
    this.Transition.name = properties.slug;
  }

  /**
   * Renderer initialization.
   */
  setup() {
    // These both methods have to be called at least once on first load.
    this.onEnter && this.onEnter();
    this.onEnterCompleted && this.onEnterCompleted();
  }

  /**
   * Add view in DOM and set visibility to hidden
   */
  add() {
    // We setup the DOM for our [data-router-view]
    this.wrap.insertAdjacentHTML('beforeend', this.properties.view.outerHTML);
    this.wrap.lastElementChild.style.visibility = 'hidden';
  }

  /**
   * Remove old view in DOM and set visibility to visible on new view
   */
  remove() {
    // We remove the old view. This happens when the user fires removeOldView() in the in transition
    this.wrap.firstElementChild.remove();
    this.wrap.lastElementChild.style.visibility = 'visible';
  }

  /**
   * Update document informations
   */
  update() {
    // Now we update all the informations in the DOM we need!
    // We update the title
    document.title = this.properties.page.title;
  }

  /**
   * Add the view in DOM and play an `in` transition if one is defined.
   *
   * @param {(object|boolean)} contextual - If the transition is changing on the fly
   * @return {object} Promise
   */
  show(contextual) {
    return new Promise(async resolve => {
      // Update DOM.
      this.update();

      // The `onEnter` method if set is called everytime the view is appended
      // to the DOM. This let you do some crazy stuffs at this right moment.
      this.onEnter && this.onEnter();

      // The transition is set in your custom renderer with a getter called
      // `transition` that should return the transition object you want to
      // apply to you view. We call the `in` step of this one right now!
      this.Transition && await this.Transition.show(contextual);

      // the developer can decide when to resolve the in transition, prompting the remove()
      this.remove();

      // The `onEnterCompleted` method if set in your custom renderer is called
      // everytime a transition is over if set. Otherwise it's called right after
      // the `onEnter` method.
      this.onEnterCompleted && this.onEnterCompleted();

      // We resolve the Promise.
      resolve();
    });
  }

  /**
   * Play an `out` transition if one is defined and remove the view from DOM.
   *
   * @param {(object|boolean)} contextual - If the transition is changing on the fly
   * @return {object} Promise
   */
  hide(contextual) {
    return new Promise(async resolve => {
      // The `onLeave` method if set in your custom renderer is called everytime
      // before a view will be removed from the DOM. This let you do some stuffs
      // right before the view isn't available anymore.
      this.onLeave && this.onLeave();

      // We call the `out` step of your transition right now!
      this.Transition && await this.Transition.hide(contextual);

      // The `onLeaveCompleted` method if set in your custom renderer is called
      // everytime a view is completely removed from the DOM.
      this.onLeaveCompleted && this.onLeaveCompleted();

      // Resolve Promise
      resolve();
    });
  }
}
