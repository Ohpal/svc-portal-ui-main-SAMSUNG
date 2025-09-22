type VDataTableProps = InstanceType<typeof VDataTable>;

export interface DataTableType extends /* @vue-ignore */ VDataTableProps {
  title: string;
  headers: any[];
  items: any[];
  model?: any;
  usePagination?: boolean;
  pageNumber?: number;
  pageSize?: number;
  pageSizeItems?: any[];
  totalRecords?: number;
  useCheckBox?: boolean;
  loading?: boolean;
  checkedList?: any[] | {};
}
