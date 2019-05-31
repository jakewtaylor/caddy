window.CADDY_INSTANCE_COUNT = window.CADDY_INSTANCE_COUNT || 0;

export class Caddy {
    /**
     * Constructs the class.
     *
     * @param {object} [options]
     */
    constructor (options) {
        // Build up the options
        this.options = this.buildOptions(options);

        // Determine the key
        const { key } = this.options;
        this.key = key ? key : `caddy${++window.CADDY_INSTANCE_COUNT}`;

        // Boot the store
        const { driver } = this.options;
        const store = driver.getItem(this.key);
        this.store = store ? JSON.parse(store) : {};

        // Initiate our subscribers as an empty array
        this.subscribers = [];

        // Initiate our listeners as an empty object
        this.listeners = {};
    }

    /**
     * Builds the options object.
     *
     * @param {object} options - The user provided options.
     *
     * @returns {object}
     */
    buildOptions (options) {
        return {
            key: null,
            driver: window.localStorage,
            ...options,
        };
    }

    /**
     * Takes the current store object and persists it using the configured driver.
     */
    persistStore () {
        const { driver } = this.options;

        this.prevStore = JSON.parse(driver.getItem(this.key));
        driver.setItem(this.key, JSON.stringify(this.store));

        this.notifySubscribers();
        this.notifyListeners();
    }

    /**
     * Calls every subscriber.
     */
    notifySubscribers () {
        this.subscribers.forEach((subscriber) => {
            subscriber(this.store);
        });
    }

    /**
     * Calls every appropriate listener.
     */
    notifyListeners () {
        // Get the keys of both the previous and current stores.
        const prevKeys = Object.keys(this.prevStore || {});
        const currentKeys = Object.keys(this.store);

        // Go through every current key
        currentKeys.forEach(key => {
            // Determine if the key is new or different
            const isNew = !prevKeys.includes(key);
            const isDifferent = this.prevStore[key] !== this.store[key];

            // If so, loop through every associated listener and call
            // it with the latest value.
            if (isNew || isDifferent) {
                const listeners = this.listeners[key] || [];

                listeners.forEach((listener) => {
                    listener(this.store[key]);
                });
            }
        });
    }

    /**
     * Sets an item in the store.
     *
     * @param {string} key - The key to store the value against.
     * @param {*} val - The value to store.
     *
     * @returns {Caddy}
     */
    set (key, val) {
        this.store[key] = val;
        this.persistStore();

        return this;
    }

    /**
     * Gets an item from the store.
     *
     * @param {string} key - The key to retrieve.
     *
     * @returns {*}
     */
    get (key) {
        return this.store[key];
    }

    /**
     * Determines if the store has a given key.
     *
     * @param {string} key - The key to check.
     *
     * @returns {boolean}
     */
    has (key) {
        return Object.prototype.hasOwnProperty.call(this.store, key);
    }

    /**
     * Empties the entire store.
     *
     * @returns {Caddy}
     */
    flush () {
        this.store = {};
        this.persistStore();

        return this;
    }

    /**
     * Pushes an item into an array stored at the given key.
     *
     * @param {string} key - The key where the array is stored.
     * @param {*} val - The value to push into the array.
     *
     * @returns {Caddy}
     *
     * @throws Will throw an error if the value at the given key is not an array.
     */
    push (key, val) {
        // If there is nothing at the given key, we can just create a new array
        if (!this.has(key)) {
            return this.set(key, [val]);
        }

        // If the existing value isn't an array, we need to throw an error
        if (!Array.isArray(this.get(key))) {
            throw new Error('Failed trying to push to non-array.');
        }

        // Push the item into the array and save
        this.store[key].push(val);
        this.persistStore();

        return this;
    }

    /**
     * Registers a callback that will be called with the entire store
     * whenever any sort of change is made.
     *
     * @param {function} subscriber - The callback to register as a subscriber.
     *
     * @returns {Caddy}
     */
    subscribe (subscriber) {
        this.subscribers.push(subscriber);

        return this;
    }

    /**
     * Registers a listener for a given key that will be called whenever
     * the value *changes*. If the new value is === the old value, the
     * listener will not be called.
     *
     * @param {string} key - The key to listen to.
     * @param {function} listener - The listener function to call.
     *
     * @returns {Caddy}
     */
    listen (key, listener) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }

        this.listeners[key].push(listener);

        return this;
    }
}

