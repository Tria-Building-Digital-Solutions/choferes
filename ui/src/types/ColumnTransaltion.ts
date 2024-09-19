export type ColumnTranslations<T> = {
  [key in keyof T]?: string;
};
