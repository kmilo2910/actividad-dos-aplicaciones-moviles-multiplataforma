export function formatCurrency(value) {
  const amount = Number(value) || 0;
  return `COP ${amount.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}
