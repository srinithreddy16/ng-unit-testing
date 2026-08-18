import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTestingDemo } from './unit-testing-demo';

describe('UnitTestingDemo', () => {   //describe.only; describe.skip
  let component: UnitTestingDemo;
  let fixture: ComponentFixture<UnitTestingDemo>;

  beforeAll(() =>{
    console.log('Before All...')
  })
  beforeEach(async () => {
    console.log('Before each...')
    await TestBed.configureTestingModule({
      imports: [UnitTestingDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(UnitTestingDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    console.log('After All...');
  });
  afterAll(() => {
    console.log('After All...')
  })


  it('should create', () => {   //it.only(); it.skip()
    console.log('It-1')
    expect(component).toBeTruthy();
  });

  it('should test add function', () => {
     console.log('It-2')
    expect(component.add(10, 20)).toBe(30);
    expect(component.add(10, -20)).toBe(-10);
    expect(component.add(-10, -20)).toBe(-30);
    expect(component.add(-10, 20)).toBe(10);
  });

  it('should test sumOfDigits function', () => {
     console.log('It-3')
    expect(component.sumOfDigits(0)).toBe(0);
    expect(component.sumOfDigits(7)).toBe(7);
    expect(component.sumOfDigits(10)).toBe(1);
    expect(component.sumOfDigits(123)).toBe(6);
    expect(component.sumOfDigits(999)).toBe(27);
  });

  it('should test addNewCar function', () => {
     console.log('It-4')
    expect(component.cars).toBeDefined();
    expect(component.cars).toBeInstanceOf(Array);
    expect(component.cars.length).toBe(2);
    expect(component.cars).toContain('Tata');
    expect(component.cars).not.toContain('Maruti');

    component.addNewCar('Maruti');

    expect(component.cars).toBeDefined();
    expect(component.cars).toBeInstanceOf(Array);
    expect(component.cars.length).toBe(3);
    expect(component.cars).toContain('Tata');
    expect(component.cars).toContain('Maruti');
    expect(component.cars).not.toContain('Hyundai');
  }); 
  
  it('should call processData with the correct data', () => {
    const processDataSpy = vi.spyOn(component, 'processData'); // Spy For processData function
    const result = component.fetchData();
    expect(processDataSpy).toHaveBeenCalled(); // Verify processData was called
    expect(processDataSpy).toHaveBeenCalledWith(['item1', 'item2', 'item3']); // Verify correct arguments
    expect(result).toBe(3); // Verify the return value
  });
});
