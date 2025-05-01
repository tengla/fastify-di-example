import { container, type DependencyContainer } from "tsyringe";

// Track request containers to allow proper cleanup
const requestContainers = new WeakMap<object, DependencyContainer>();

/**
 * Creates a child container for a specific request
 * @param requestContext Any object that uniquely identifies the request (e.g., req object)
 * @returns A child container scoped to the request
 */
export function getRequestContainer(requestContext: object): DependencyContainer {
  // Check if we already have a container for this request
  if (requestContainers.has(requestContext)) {
    return requestContainers.get(requestContext)!;
  }
  
  // Create a new child container for this request
  const childContainer = container.createChildContainer();
  requestContainers.set(requestContext, childContainer);
  
  return childContainer;
}

/**
 * Disposes the container associated with a request
 * @param requestContext The request object
 */
export function disposeRequestContainer(requestContext: object): void {
  if (requestContainers.has(requestContext)) {
    const childContainer = requestContainers.get(requestContext)!;
    childContainer.clearInstances();
    requestContainers.delete(requestContext);
  }
}