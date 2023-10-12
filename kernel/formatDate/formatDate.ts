export function formatDate(date: Date) {

  return date.toLocaleString("pt-BR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}