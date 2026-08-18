import { Component } from '@angular/core';

@Component({
  selector: 'app-unit-testing-demo',
  imports: [],
  templateUrl: './unit-testing-demo.html',
  styleUrl: './unit-testing-demo.css',
})
export class UnitTestingDemo {
  add(a: number, b: number): number {
    return a + b;
  }

  sumOfDigits(num:number){
    let sum=0;
    while(num != 0){
      let rem = num % 10;
      sum  = sum + rem;
      num = Math.floor(num / 10);
    }
    return sum;
  }

  cars = ['Tata', 'Honda'];
  addNewCar(newCar: string) {
    this.cars.push(newCar);
  }

  processData(data: any) {
    console.log('Processing data:', data);
    return data.length;
  }
  fetchData() {
    const data = ['item1', 'item2', 'item3'];
    return this.processData(data);
  }

  

}
