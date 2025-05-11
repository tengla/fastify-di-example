export function Foo(bar: string = "bar") {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // Decorator logic here
    console.log({ target, descriptor });
    console.log(`Decorator applied to ${propertyKey}`);
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      console.log(this.constructor.name, 'was fooed', bar);
      console.log(`Method ${propertyKey} called with args:`, args);
      // Call the original method
      const result = await originalMethod.apply(this, args);
      console.log(`Method ${propertyKey} returned:`, result);
      return result;
    };
  };
}