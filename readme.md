# Caddy

A simple to use wrapper around JavaScript's LocalStorage/SessionStorage.

Install from npm:

```Bash
npm install --save caddyjs

# or yarn

yarn add caddyjs
```

---

## Usage

Get started by creating an instance of the Caddy class:

```JavaScript
import { Caddy } from 'caddyjs';

const caddy = new Caddy();
```
> The constructor takes an optional configuration object, see [here](#constructor).

Then you can set values:
```JavaScript
caddy.set('key', 'value');
```

Get values:
```JavaScript
caddy.get('key'); // 'value'
```

And more! Read the documentation below.

Caddy works by serializing an object into storage, so any value that can be JSON-ified with `JSON.stringify` can be stored with Caddy.

---

## Documentation

### Constructor

The constructor takes an optional configuration object.

```JavaScript
const caddy = new Caddy({
    key: 'my_custom_key',
});
```

The options allowed are:

| Key | Description | Default |
| - | - | - |
| `key` | The unique key that is used when storing items. | `caddy`_`X`_ where X is a number from 1 upwards<sup>[1](#notes)</sup>. |
| `driver` | The storage driver to use. Must have the same interface as sessionStorage/localStorage. | `window.localStorage` |

In most cases, the default options will be fine and you can just initiate caddy without any options:

```JavaScript
const caddy = new Caddy();
```

### `set`

Adds an item into the storage.

```JavaScript
caddy.set('my_key', 'some sort of value');
```

`set` returns `this`, so you can chain multiple calls:

```JavaScript
caddy.set('key_a', 1)
     .set('key_b', 2)
```

### `get`

Gets an item from storage. Will return `undefined` if there is nothing stored against the given key.

```JavaScript
caddy.get('my_key') // 'some sort of value'
caddy.get('key_we_havent_set') // undefined
```

### `has`

Determines if a key exists in the store.

```JavaScript
caddy.has('key_a') // true
caddy.has('key_b') // true
caddy.has('key_c') // false
```

### `push`

A convenience method that pushes the given value into an array stored at the given key. If there is nothing stored for the key, an array will be created with the value. If the value stored at the key is not an array, an error will be thrown.

```JavaScript
caddy.set('my_array', [1, 2, 3]);
caddy.push('my_array', 4);
caddy.get('my_array') // [1, 2, 3, 4]
```

```JavaScript
caddy.has('new_key'); // false
caddy.push('new_key', 3);
caddy.get('new_key'); // [3]
```

```JavaScript
caddy.set('key', 'string');
caddy.push('key', 2); // Error!
```

`push` also returns `this`, so it can be chained if you wish:

```JavaScript
caddy.push('array', 1).push('array', 2);
```

### `flush`

Empties the entire store.

```JavaScript
caddy.set('example', 123);
caddy.has('example'); // true
caddy.flush();
caddy.has('example'); // false
```

### `subscribe`

`subscribe` allows you to perform some logic whenever the store is updated. You supply a callback function that will be passed the entire store object.

```JavaScript
// Do something with the entire store
caddy.subscribe((store) => {
    console.log(store);
});

// The store is just an object, so you can destructure to get just the properties you're interested in:
caddy.subscribe(({ my_key }) => {
    console.log(my_key);
});
```

You can subscribe to a store as many times as you wish.

**See also:** [`listen`](#listen)


### `listen`

`listen` allows you to listen to **changes** to an item. It's similar to subscribe, but only for a specific key, and is only called when the value is different to what it was before<sup>[2](#notes)</sup>.

```JavaScript
caddy.listen('my_key', (value) => {
    console.log(value);
});
```

You can listen to a value as many times as you wish.

**See also:** [`subscribe`](#subscribe)


## Notes

1. Caddy keeps track of how many instances have been created, and increments the key every time to avoid collisions.
2. The way Caddy compares values is by using the strict equality operator (`===`). Because of the way Caddy works, `listen` will not work properly if your value is an array or object, as Caddy will always see the value as different than last time. A workaround is to use [`subscribe`](#subscribe) and determine whether the value has changed yourself.
