export interface SearchOptionsType {
    searchKey: string | null,
    searchText: string | null,
    pageSize: number,
    pageNumber: number,
    sort: string,
    order: 'desc' | 'acs'
}
