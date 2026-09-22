export const equipmentCategories = [
  "loaders", "excavators", "dump-trucks", "mixers", "attachments",
  "pile-drivers", "backhoe-loaders", "skid-steers", "forklifts", "telehandlers",
  "bulldozers", "graders", "rollers", "mobile-cranes", "concrete-pumps",
] as const;

export const categoryLabels = {
  loaders: "Фронтальные погрузчики",
  excavators: "Экскаваторы",
  "dump-trucks": "Самосвалы",
  mixers: "Бетономешалки",
  attachments: "Навесное оборудование",
  "pile-drivers": "Сваебойные установки",
  "backhoe-loaders": "Экскаваторы-погрузчики",
  "skid-steers": "Мини-погрузчики",
  forklifts: "Вилочные погрузчики",
  telehandlers: "Телескопические погрузчики",
  bulldozers: "Бульдозеры",
  graders: "Автогрейдеры",
  rollers: "Дорожные катки",
  "mobile-cranes": "Автокраны",
  "concrete-pumps": "Бетононасосы",
} satisfies Record<(typeof equipmentCategories)[number], string>;
