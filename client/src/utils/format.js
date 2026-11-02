export function formatPrice(value) {
  return "₹" + Number(value).toLocaleString("en-IN");
}