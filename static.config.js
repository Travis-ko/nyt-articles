import path from 'path'
import { request } from 'graphql-request';

const GRAPHCMS_ENDPOINT = 'https://api-uswest.graphcms.com/v1/cjvo53xav2q9e01ehppwpv540/master';
const query = `{
  posts {
    id
    title
    image{
      handle
    }
    description
    tags
    author{
      id
      name
    }
  }
  authors{
    id
    name
    avatar{
      handle
    }
    bibliography
  }
}
`

export default {
  getRoutes: async () => {
    const {posts, authors} = await request(GRAPHCMS_ENDPOINT, query)

    return [
      {
        path: '/',
        getData: () => ({
          posts,
        }),
        children: posts.map(post => ({
          path: `/post/${post.id}`,
          template: 'src/pages/post',
          getData: () => ({
            post,
          }),
        })),
      },
      {
        path: '/about',
        component: 'src/pages/about',
        getData: () => ({
          authors
        })
      }
    ]
  },
  plugins: [
    [
      require.resolve('react-static-plugin-source-filesystem'),
      {
        location: path.resolve('./src/pages'),
      },
    ],
    require.resolve('react-static-plugin-reach-router'),
    require.resolve('react-static-plugin-sitemap'),
  ],
}
