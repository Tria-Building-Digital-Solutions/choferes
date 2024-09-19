export type ColumnTranslations<T> = {
  [K in keyof T]: string;
};
