export interface FindAllArticlesQuery {
  limit?: number
  offset?: number
  tag?: string
  author?: string
  favorited?: string
}