export const machineryScenes = [
  ["01-mine", "Работа в высокогорном карьере"],
  ["02-valley", "Земляные работы в долине"],
  ["03-mountain-road", "Обслуживание горных дорог"],
  ["04-quarry", "Погрузка щебня"],
  ["05-farm", "Помощник в хозяйстве"],
  ["06-river", "Перевалка гравия"],
  ["07-winter", "Уборка снега"],
  ["08-sand", "Работа с песком"],
  ["09-dawn", "Начало смены в горах"],
  ["10-loading", "Погрузка в самосвал"],
  ["11-earthworks", "Подготовка стройплощадки"],
  ["12-orchard", "Работа в саду"],
  ["13-pass", "Техника на перевале"],
  ["14-detail", "Ковш и ходовая часть"],
  ["15-fleet", "Техника для больших задач"],
  ["16-field-road", "Дороги между полями"],
  ["17-gravel", "Работа с сыпучими материалами"],
  ["18-service", "Подготовка к следующей смене"],
  ["19-autumn", "Осенние работы"],
  ["20-blue-hour", "Вечерняя смена"],
].map(([id, title]) => ({ id, title, src: `/images/scenes/${id}.webp` }));

const loaderScenes: Record<string, string> = {
  lg393: "04-quarry", lg936: "06-river", lg939: "11-earthworks",
  lg933: "05-farm", lg920: "12-orchard", t933l: "08-sand", lg946: "17-gravel",
};
export function getLoaderScene(slug: string) {
  return loaderScenes[slug] ? `/images/scenes/${loaderScenes[slug]}.webp` : undefined;
}
