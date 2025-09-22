export interface MenuType {
    menuId: number,
    appId: string,
    title: string,
    url: string,
    parentId: null | number,
    sequence: number,
    depth: number,
    useYN: string,
    description: string,
    icon: string,
    type: string,
    children?: MenuType[]
}
