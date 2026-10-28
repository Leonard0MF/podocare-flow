/*
 * Data de hoje no fuso local, no formato YYYY-MM-DD.
 *
 * Não usar toISOString(): ele converte para UTC e, no
 * Brasil, depois das 21h já retorna o dia seguinte.
 */
export function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
