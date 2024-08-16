import { Post } from '@prisma/client';

export interface PostSearchType {
  items_page_per?: number;
  page?: number;
  search?: string;
}
export interface PostPaginationResType {
  data: Post[];
  total: number;
  page: number;
  itemperpage: number;
}
