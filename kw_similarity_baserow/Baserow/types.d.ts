interface BaserowField {
  id: number;
  table_id: number;
  name: string;
  order: number;
  type: string;
  primary: boolean;
  text_default: string;
}

type BaserowQueryOperator =
  | "equal"
  | "not_equal"
  | "filename_contains"
  | "has_file_type"
  | "contains"
  | "contains_not"
  | "length_is_lower_than"
  | "higher_than"
  | "lower_than"
  | "date_equal"
  | "date_before"
  | "date_after"
  | "date_not_equal"
  | "date_equals_today"
  | "date_equals_days_ago"
  | "date_equals_month"
  | "date_equals_day_of_month"
  | "date_equals_year"
  | "single_select_equal"
  | "single_select_not_equal"
  | "link_row_has"
  | "link_row_has_not"
  | "boolean"
  | "empty"
  | "not_empty"
  | "multiple_select_has"
  | "multiple_select_has_not";

type BaserowListRecordsResponse<T> = {
  count: number;
  next: string;
  previous?: string;
  results: T[];
};
