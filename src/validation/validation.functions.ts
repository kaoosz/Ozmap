export function requiredMessage(field: unknown): string {
  return `the field ${field} is required`;
}

export function invalidTypeMessage(field: unknown, type: string): string {
  return `the field ${field} is type ${type}.`;
}
