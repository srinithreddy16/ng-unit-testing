# ng-unit-testing

Angular 21 learning project for **unit testing** with **Vitest**. It covers component tests, custom pipe tests, matchers, setup/teardown hooks, and spies.

## Tech stack

| Area | Used in this repo |
| --- | --- |
| Framework | Angular 21 (standalone components) |
| Language | TypeScript |
| Unit tests | Vitest + Angular `TestBed` |
| Coverage | `@vitest/coverage-v8` |
| UI | Angular Material |
| Rendering | Angular SSR (`@angular/ssr`, Express) |

## Getting started

```bash
npm install
ng serve
```

Open [http://localhost:4200/](http://localhost:4200/).

```bash
ng test          # run unit tests
ng build         # production build
```

## What this project contains

```
src/app/
  app.ts / app.html / app.spec.ts
  components/unit-testing-demo/     # component methods + tests
  pipes/ordinal-pipe.ts             # custom ordinal pipe
  pipes/ordinal-pipe.spec.ts        # pipe tests
```

### `UnitTestingDemo` component

| Method | What it does |
| --- | --- |
| `add(a, b)` | Adds two numbers (positive and negative) |
| `sumOfDigits(num)` | Sums each digit of a number |
| `addNewCar(newCar)` | Pushes a car name onto `cars` |
| `fetchData()` | Builds sample data and calls `processData()` |
| `processData(data)` | Logs data and returns `data.length` |

### `OrdinalPipe`

Turns a number into an ordinal string: `21` → `21st`, `22` → `22nd`, `23` → `23rd`, `24` → `24th`.

```html
{{ 21 | ordinal }}
```

---

## Unit testing structure

```ts
describe('UnitTestingDemo', () => {   // test suite
  it('should create', () => {         // test case
    expect(component).toBeTruthy();
  });
});
```

| API | Meaning |
| --- | --- |
| `describe` | Groups related tests (a suite) |
| `it` / `test` | One test case |
| `expect` | Assertion |
| `it.only` / `describe.only` | Run only this test / suite |
| `it.skip` / `describe.skip` | Skip this test / suite |

---

## Lifecycle hooks

Hooks run around tests. This project uses all four in `unit-testing-demo.spec.ts`.

```
beforeAll   → once before the whole suite
  beforeEach  → before every it()
    it()
  afterEach   → after every it()
afterAll    → once after the whole suite
```

| Hook | When it runs | Typical use |
| --- | --- | --- |
| `beforeAll` | Once before all tests in the suite | One-time setup (DB connection, shared config) |
| `beforeEach` | Before **each** `it` | Create `TestBed`, component, and fixture (used here) |
| `afterEach` | After **each** `it` | Reset state, clear spies/mocks, restore originals |
| `afterAll` | Once after all tests | Close connections, cleanup shared resources |

In this project `beforeEach` is the most important hook: Angular's `TestBed` builds a **fresh component instance** for every test so one `it()` cannot leak state into the next (for example `cars` after `addNewCar('Maruti')`).

```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [UnitTestingDemo],
  }).compileComponents();

  fixture = TestBed.createComponent(UnitTestingDemo);
  component = fixture.componentInstance;
  await fixture.whenStable();
});
```

---

## Matchers used in this project

These are the assertions already written in the specs.

| Matcher | Used for | Example from this repo |
| --- | --- | --- |
| `toBeTruthy()` | Value is truthy (component exists) | `expect(component).toBeTruthy()` |
| `toBe(value)` | Strict equality (`===`) | `expect(component.add(10, 20)).toBe(30)` |
| `toBeDefined()` | Not `undefined` | `expect(component.cars).toBeDefined()` |
| `toBeInstanceOf(Class)` | Correct type | `expect(component.cars).toBeInstanceOf(Array)` |
| `toContain(item)` | Array/string contains a value | `expect(component.cars).toContain('Tata')` |
| `not.toContain(item)` | Value is **not** present | `expect(component.cars).not.toContain('Maruti')` |
| `toHaveBeenCalled()` | Spy was invoked | `expect(processDataSpy).toHaveBeenCalled()` |
| `toHaveBeenCalledWith(...)` | Spy was called with those args | `expect(processDataSpy).toHaveBeenCalledWith(['item1', 'item2', 'item3'])` |

`.length` is still compared with `toBe`:

```ts
expect(component.cars.length).toBe(2);
```

---

## Other matchers worth knowing

Add these as tests grow. They are the ones used most often in real Angular work.

| Matcher | Use when |
| --- | --- |
| `toEqual(obj)` | Deep compare arrays/objects (not `===`) |
| `toBeFalsy()` | `false`, `0`, `''`, `null`, `undefined` |
| `toBeNull()` / `toBeUndefined()` | Exact null / undefined |
| `toBeGreaterThan` / `toBeLessThan` | Numeric comparison |
| `toBeCloseTo(n, digits)` | Floating-point math |
| `toMatch(/regex/)` | String pattern |
| `toThrow()` / `toThrowError()` | Function throws |
| `toHaveLength(n)` | Array/string length |
| `toHaveBeenCalledTimes(n)` | Spy call count |
| `toHaveBeenCalledOnce()` | Spy called exactly once |
| `toHaveReturnedWith(value)` | Spy return value |

`toEqual` is especially important: `toBe` fails for two arrays with the same contents because they are different references.

```ts
expect(component.cars).toEqual(['Tata', 'Honda']); // preferred for arrays
```

---

## Spies

A **spy** wraps a real method. The original code still runs, but the test can see **whether it was called, how many times, and with which arguments**.

This project spies on `processData` while `fetchData()` runs the real implementation:

```ts
it('should call processData with the correct data', () => {
  const processDataSpy = vi.spyOn(component, 'processData');
  const result = component.fetchData();

  expect(processDataSpy).toHaveBeenCalled();
  expect(processDataSpy).toHaveBeenCalledWith(['item1', 'item2', 'item3']);
  expect(result).toBe(3);
});
```

| API | Meaning |
| --- | --- |
| `vi.spyOn(object, 'method')` | Watch a method (Vitest) |
| `toHaveBeenCalled()` | It was called at least once |
| `toHaveBeenCalledWith(args)` | It was called with those arguments |
| `spy.mockRestore()` | Put the original method back |

Use a spy when you care about **collaboration** between methods (`fetchData` → `processData`), not only the final return value.

---

## Stubs

A **stub** replaces a method with a **fake** implementation. The real method does **not** run. Use this to isolate the unit under test from HTTP, timers, or other methods.

This project does not stub yet. Typical Vitest pattern:

```ts
it('should stub processData and return a fake length', () => {
  const processDataStub = vi
    .spyOn(component, 'processData')
    .mockReturnValue(99);          // stub: fake return value

  const result = component.fetchData();

  expect(processDataStub).toHaveBeenCalled();
  expect(result).toBe(99);         // real processData never ran
});
```

| | Spy | Stub |
| --- | --- | --- |
| Original method runs? | Yes | No (replaced) |
| You can assert calls? | Yes | Yes |
| You control the return value? | No (unless you also mock) | Yes (`mockReturnValue`, `mockImplementation`) |
| When to use | Verify a method was called | Avoid real HTTP, slow code, or side effects |

Related Vitest APIs:

```ts
vi.fn()                              // standalone fake function
vi.spyOn(obj, 'm').mockReturnValue(x) // spy + stub
vi.spyOn(obj, 'm').mockResolvedValue(x) // stub an async method
vi.spyOn(obj, 'm').mockRejectedValue(err)
```

---

## What is more important to add next

These are the highest-value next steps for this repo, in order:

1. **`toEqual` for arrays** — assert `cars` as a full list, not only `toContain`.
2. **`toHaveBeenCalledTimes(1)`** — prove `processData` is not called extra times.
3. **A real stub** — `mockReturnValue` / `mockImplementation` on `processData` or a future HTTP method.
4. **`afterEach(() => vi.restoreAllMocks())`** — stop spies from leaking between tests.
5. **DOM / template tests** — `fixture.detectChanges()` and `fixture.nativeElement.querySelector(...)` (started in `app.spec.ts`).
6. **Pipe edge cases** — `1`, `2`, `3`, `11`, `12`, `13` (the current remainder logic treats `11` as `11st`).
7. **HttpClient testing** — `HttpTestingController` when you add a service that calls an API.
8. **Coverage** — `ng test --coverage` and keep component + pipe branches covered.

Useful Angular testing helpers to learn next:

| Helper | Why it matters |
| --- | --- |
| `fixture.detectChanges()` | Runs change detection so the template updates |
| `DebugElement` / `By.css()` | Query the rendered DOM |
| `fakeAsync` + `tick()` | Control `setTimeout` / `setInterval` |
| `HttpTestingController` | Fake HTTP without a real backend |
| `RouterTestingHarness` | Test routed components |

---

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` / `ng serve` | Dev server |
| `ng test` | Unit tests (Vitest) |
| `ng build` | Production build |
| `ng test --coverage` | Tests with coverage report |
