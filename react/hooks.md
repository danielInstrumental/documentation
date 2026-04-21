## useState

**Purpose:** Store and update state (data that affects UI)

```js
const [count, setCount] = useState(0);
```

* `count` → current value
* `setCount` → updates the value and triggers re-render

---

### Number Example

```js
const [count, setCount] = useState(0);
```

```js
<button onClick={() => setCount(count + 1)}>
  {count}
</button>
```

---

### Variable Example

```js
const initialValue = 10;
const [count, setCount] = useState(initialValue);
```

---

### Object Example

```js
const [user, setUser] = useState({
  name: "Daniel",
  age: 30
});
```

Update object (important):

```js
setUser({
  ...user,
  age: 31
});
```

---

## useEffect

**Purpose:** Run side effects after render (e.g. API calls, timers, DOM actions)

### Run once (on mount)

```js
useEffect(() => {
  console.log("Mounted");
}, []);
```

---

### Run when dependency changes

```js
useEffect(() => {
  console.log("Count changed");
}, [count]);
```

---

### With cleanup (on unmount)

```js
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Running...");
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

---

## Mental Model

* **useState** → store data
* **useEffect** → react to changes
